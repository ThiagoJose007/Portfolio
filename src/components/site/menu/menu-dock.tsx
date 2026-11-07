"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSiteContent } from "../content-context";
import { MENU_CLOSE_EVENT } from "../transition/navigation";
import { TransitionLink } from "../transition/transition-link";
import { pageLabel, useSitePaths } from "../version-path";

const RING_RADIUS = 50;
// A partir daqui (px de scroll) a navegação do topo se recolhe no círculo.
const COLLAPSE_AT = 140;

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

// Navegação:
// - Desktop, no topo da página: pílula aberta no canto superior direito, com
//   os nomes das páginas.
// - Ao rolar, ela se recolhe e dá lugar ao círculo laranja (canto inferior),
//   cujo anel diz "MENU · <página atual>". O círculo abre a mesma pílula ao
//   lado dele.
// - Mobile: só o círculo, que abre a lista acima dele.
export function MenuDock() {
  const { profile } = useSiteContent();
  const { pathname, home, about, experience } = useSitePaths();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openTl = useRef<gsap.core.Timeline | null>(null);
  const topTl = useRef<gsap.core.Timeline | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const openedAt = useRef(0);

  const isHome = pathname === home;
  const links = [
    // Sem o cabeçalho, "Início" é o caminho de volta fora da página inicial.
    ...(isHome ? [] : [{ label: "Início", href: home, active: false }]),
    { label: "Projetos", href: `${home}#projetos`, active: false },
    { label: "Sobre mim", href: about, active: pathname === about },
    { label: "Experiência", href: experience, active: pathname === experience },
    { label: "Contato", href: "#contato", active: false },
  ];

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(".dock", { autoAlpha: 0 });

      openTl.current = gsap
        .timeline({ paused: true })
        .set(".dock", { autoAlpha: 1 })
        .fromTo(".dock-bg", { scaleX: 0 }, { scaleX: 1, duration: 0.6, easeReverse: "power3.in" }, 0)
        .fromTo(
          ".dock .nav-item",
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, easeReverse: "power3.in", stagger: { each: 0.04, from: "end" } },
          0.08,
        )
        .to(".menu-ring", { autoAlpha: 0, scale: 0.85, duration: 0.3 }, 0)
        .to(".menu-disc", { scale: 0.9, duration: 0.4 }, 0)
        .to(".menu-bar-top", { y: 0, rotate: 45, duration: 0.4 }, 0)
        .to(".menu-bar-bottom", { y: 0, rotate: -45, duration: 0.4 }, 0);

      gsap.to(".menu-ring", { rotate: 360, duration: 14, ease: "none", repeat: -1 });

      // Topo (desktop): pílula visível, círculo escondido. Rolando: o inverso.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        topTl.current = gsap
          .timeline({ paused: true })
          .fromTo(
            ".top-nav .nav-item",
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -14, duration: 0.35, stagger: { each: 0.035, from: "end" } },
            0,
          )
          .fromTo(".top-nav-bg", { scaleX: 1 }, { scaleX: 0, duration: 0.5, ease: "power3.inOut" }, 0.1)
          .set(".top-nav", { visibility: "hidden" })
          .fromTo(
            ".menu-fab",
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" },
            0.3,
          );
        topTl.current.progress((triggerRef.current?.scroll() ?? 0) < COLLAPSE_AT ? 0 : 1);
        return () => {
          topTl.current = null;
        };
      });

      // Compara a posição diretamente (um intervalo start/end "sairia" do
      // estado ao chegar no fim da página).
      const sync = (self: ScrollTrigger) => {
        const y = self.scroll();
        setAtTop(y < COLLAPSE_AT);
        // Aberta pelo círculo: fecha ao voltar ao topo (lá a pílula do topo
        // assume) ou depois de rolar um pouco.
        if (y < COLLAPSE_AT || Math.abs(y - openedAt.current) > 240) setOpen(false);
      };
      triggerRef.current = ScrollTrigger.create({ start: 0, end: "max", onUpdate: sync, onRefresh: sync });
      setAtTop(triggerRef.current.scroll() < COLLAPSE_AT);

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (atTop) {
      topTl.current?.timeScale(1.4).reverse();
    } else {
      topTl.current?.timeScale(1).play();
    }
  }, [atTop]);

  useEffect(() => {
    if (open) {
      openedAt.current = triggerRef.current?.scroll() ?? window.scrollY;
      openTl.current?.timeScale(1).play();
    } else {
      openTl.current?.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (open && !rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener(MENU_CLOSE_EVENT, close);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener(MENU_CLOSE_EVENT, close);
    };
  }, [open, close]);

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
    gsap.to(".menu-magnet", { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  });

  const itemClass =
    "block whitespace-nowrap rounded-full px-4 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent";

  const items = (
    <>
      {links.map((item) => (
        <li key={item.label} className="nav-item">
          <TransitionLink
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`${itemClass} ${item.active ? "bg-cream text-ink" : "text-cream hover:bg-cream/10"}`}
          >
            {item.label}
          </TransitionLink>
        </li>
      ))}
      {profile.cvUrl && (
        <li className="nav-item">
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className={`${itemClass} border border-accent/60 text-accent hover:bg-accent hover:text-ink`}
          >
            Baixar CV ↓
          </a>
        </li>
      )}
    </>
  );

  return (
    <div ref={rootRef}>
      {/* Desktop, topo da página */}
      <nav
        aria-label="Navegação principal"
        inert={!atTop}
        className="top-nav fixed right-8 top-6 z-50 hidden md:block"
      >
        <span className="top-nav-bg absolute inset-0 origin-right rounded-[28px] border border-cream/10 bg-[#1b1b1f]/70 backdrop-blur-xl" />
        <ul className="relative flex items-center gap-0.5 p-1.5">{items}</ul>
      </nav>

      <div className="menu-fab fixed bottom-6 right-5 z-50 md:bottom-8 md:right-10">
        <nav
          id="site-dock"
          aria-label="Menu"
          inert={!open}
          className="dock absolute bottom-[calc(100%+12px)] right-0 md:bottom-1/2 md:right-[calc(100%+14px)] md:translate-y-1/2"
        >
          <span className="dock-bg absolute inset-0 origin-right rounded-[28px] border border-cream/10 bg-[#1b1b1f]/85 backdrop-blur-xl" />
          <ul className="relative flex flex-col items-stretch gap-0.5 p-2 md:flex-row md:items-center">{items}</ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-dock"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
          onPointerMove={onButtonMove}
          onPointerLeave={onButtonOut}
          className="relative grid size-[76px] place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cream"
        >
          <span className="menu-magnet absolute -inset-5 text-cream mix-blend-difference">
            <RingText text={`MENU · ${pageLabel(pathname).toUpperCase()} · `} />
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
