"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { MENU_CLOSE_EVENT, scrollToTarget } from "../transition/navigation";
import { TransitionLink } from "../transition/transition-link";
import { DockIcon } from "./dock-icon";

const RING_RADIUS = 50;

// Texto que corre pela borda do círculo: cada caractere é um <textPath> com
// startOffset próprio, o que distribui as letras igualmente em qualquer fonte.
function RingText({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <svg viewBox="0 0 120 120" className="menu-ring pointer-events-none absolute inset-0 size-full">
      <path
        id="menu-ring-path"
        fill="none"
        d={`M 60,60 m -${RING_RADIUS},0 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 ${RING_RADIUS * 2},0 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 -${RING_RADIUS * 2},0`}
      />
      {chars.map((char, i) => (
        <text key={`${text}-${i}`} className="menu-ring-char fill-current font-mono text-[8.5px] tracking-normal">
          <textPath href="#menu-ring-path" startOffset={`${(i / chars.length) * 100}%`}>
            {char}
          </textPath>
        </text>
      ))}
    </svg>
  );
}

export function MenuDock() {
  const pathname = usePathname();
  // Nas páginas de candidatura o menu navega pelas seções da própria página.
  const anchorMode = pathname.startsWith("/p/");
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openTl = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".dock-item");
      gsap.set(".dock", { autoAlpha: 0 });

      openTl.current = gsap
        .timeline({ paused: true })
        .set(".dock", { autoAlpha: 1 })
        .to(".menu-backdrop", { autoAlpha: 1, duration: 0.5 }, 0)
        .fromTo(
          ".dock-bg",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, easeReverse: "power3.in" },
          0,
        )
        .fromTo(
          items,
          { y: 24, scale: 0.2, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.55)",
            easeReverse: "power3.in",
            stagger: { each: 0.05, from: "end" },
          },
          0.08,
        )
        .to(".menu-disc", { backgroundColor: "#4f5bff", scale: 0.9, duration: 0.5 }, 0)
        .to(".menu-bar-top", { y: 0, rotate: 45, duration: 0.45 }, 0)
        .to(".menu-bar-bottom", { y: 0, rotate: -45, duration: 0.45 }, 0);

      // O texto gira em volta do círculo o tempo todo; no desktop ele só
      // aparece no hover (em touch fica sempre visível).
      const canHover = window.matchMedia("(hover: hover)").matches;
      gsap.set(".menu-ring", { autoAlpha: canHover ? 0 : 1, scale: canHover ? 0.85 : 1 });
      gsap.to(".menu-ring", { rotate: 360, duration: 14, ease: "none", repeat: -1 });
    },
    { scope: rootRef },
  );

  // Letras entram uma a uma, como se o texto "corresse" pela borda.
  const showRing = contextSafe(() => {
    gsap.to(".menu-ring", { autoAlpha: 1, scale: 1, duration: 0.6, overwrite: "auto" });
    gsap.fromTo(
      ".menu-ring-char",
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, stagger: 0.025, ease: "none", overwrite: true },
    );
  });
  const hideRing = contextSafe(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    gsap.to(".menu-ring", { autoAlpha: 0, scale: 0.85, duration: 0.4, overwrite: "auto" });
  });

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      openTl.current?.timeScale(1).play();
      const first = rootRef.current?.querySelector<HTMLElement>(".dock-link");
      first?.focus({ preventScroll: true });
    } else {
      openTl.current?.timeScale(1.6).reverse();
    }
    // O rótulo troca (MENU ↔ FECHAR): reanima as novas letras.
    if (rootRef.current?.matches(":has(button:hover)") || open) showRing();
    else hideRing();
  }, [open, showRing, hideRing]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(MENU_CLOSE_EVENT, close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(MENU_CLOSE_EVENT, close);
    };
  }, [open, close]);

  // Efeito macOS dock: ícones crescem conforme a distância do ponteiro
  // e empurram os vizinhos para os lados.
  const onDockMove = (event: React.PointerEvent<HTMLUListElement>) =>
    contextSafe(() => {
      if (event.pointerType !== "mouse") return;
      const links = gsap.utils.toArray<HTMLElement>(".dock-link", rootRef.current);
      const list = event.currentTarget.getBoundingClientRect();
      const min = list.width / links.length;
      const max = min * 1.6;
      const bound = min * Math.PI;
      const pointer = event.clientX - list.left;
      let firstX = 0;
      let lastX = 0;

      links.forEach((link, i) => {
        const distance = i * min + min / 2 - pointer;
        let x: number;
        let scale = 1;
        if (-bound < distance && distance < bound) {
          const rad = (distance / min) * 0.5;
          scale = 1 + (max / min - 1) * Math.cos(rad);
          x = 2 * (max - min) * Math.sin(rad);
        } else {
          x = (-bound < distance ? 2 : -2) * (max - min);
        }
        if (i === 0) firstX = x;
        if (i === links.length - 1) lastX = x;
        gsap.to(link, { x, scale, duration: 0.3, overwrite: "auto" });
      });
      gsap.to(".dock-bg", {
        left: Math.min(0, firstX),
        right: -Math.max(0, lastX),
        duration: 0.3,
      });
    })();

  const onDockLeave = contextSafe(() => {
    gsap.to(".dock-link", { x: 0, scale: 1, duration: 0.35 });
    gsap.to(".dock-bg", { left: 0, right: 0, duration: 0.35 });
  });

  // Botão "magnético": segue levemente o ponteiro.
  const onButtonMove = contextSafe((event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(".menu-magnet", {
      x: (event.clientX - rect.left - rect.width / 2) * 0.3,
      y: (event.clientY - rect.top - rect.height / 2) * 0.3,
      duration: 0.4,
    });
  });
  const onButtonOut = contextSafe(() => {
    if (!open) hideRing();
    gsap.to(".menu-magnet", { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  });

  return (
    <div ref={rootRef}>
      <div
        className="menu-backdrop invisible fixed inset-0 z-40 bg-ink/50 opacity-0 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden
      />

      <div className="fixed bottom-6 right-5 z-50 md:bottom-8 md:right-10">
        <nav
          id="site-dock"
          aria-label="Navegação principal"
          inert={!open}
          className="dock absolute bottom-[calc(100%+12px)] right-0 md:bottom-1/2 md:right-[calc(100%+14px)] md:translate-y-1/2"
        >
          <span className="dock-bg absolute inset-0 origin-right rounded-[26px] border border-cream/10 bg-[#1b1b1f]/80 backdrop-blur-xl" />
          <ul className="relative flex items-end gap-1 p-2.5" onPointerMove={onDockMove} onPointerLeave={onDockLeave}>
            {nav.map((item) => {
              const active = !anchorMode && item.href === pathname;
              const className =
                "dock-link group relative block size-12 origin-bottom rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-accent md:size-14";
              const content = (
                <>
                  <DockIcon name={item.icon} />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {item.label}
                  </span>
                </>
              );
              return (
                <li key={item.href} className="dock-item relative">
                  {anchorMode ? (
                    <a
                      href={item.anchor}
                      className={className}
                      aria-label={item.label}
                      onClick={(event) => {
                        event.preventDefault();
                        close();
                        scrollToTarget(item.anchor);
                      }}
                    >
                      {content}
                    </a>
                  ) : (
                    <TransitionLink
                      href={item.href}
                      className={className}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                    >
                      {content}
                    </TransitionLink>
                  )}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-cream" />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-dock"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
          onPointerEnter={showRing}
          onPointerMove={onButtonMove}
          onPointerLeave={onButtonOut}
          className="relative grid size-[76px] place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cream"
        >
          <span className="menu-magnet absolute -inset-5 text-cream mix-blend-difference">
            <RingText text={open ? "FECHAR · FECHAR · " : "MENU · MENU · MENU · "} />
          </span>
          <span className="menu-magnet absolute inset-0 grid place-items-center">
            <span className="menu-disc absolute inset-0 rounded-full bg-accent shadow-[0_10px_40px_rgba(255,95,46,0.35)]" />
            <span className="relative block h-3 w-6">
              <span className="menu-bar-top absolute left-0 top-1/2 block h-[2px] w-full -translate-y-[5px] bg-ink" />
              <span className="menu-bar-bottom absolute left-0 top-1/2 block h-[2px] w-full translate-y-[3px] bg-ink" />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
