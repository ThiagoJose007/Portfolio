"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSiteContent } from "../content-context";
import { MENU_CLOSE_EVENT } from "../transition/navigation";
import { TransitionLink } from "../transition/transition-link";
import { pageLabel, useSitePaths } from "../version-path";

const RING_RADIUS = 50;
// Círculo fechado: canto superior direito (desktop: 32px da borda).
const CORNER_MARGIN = 32;
const CIRCLE_SIZE = 56;
// Distância (x) do centro da tela até o canto superior direito.
const cornerOffset = () => document.documentElement.clientWidth / 2 - CORNER_MARGIN - CIRCLE_SIZE / 2;
// A partir daqui (px de scroll) o menu se fecha no círculo.
const COLLAPSE_AT = 140;
// Aberto manualmente no meio da página: fecha depois de rolar isso.
const CLOSE_AFTER_SCROLL = 240;

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
        <text key={`${text}-${i}`} className="menu-ring-char fill-current font-mono text-[9px] tracking-normal">
          <textPath href="#menu-ring-path" startOffset={`${(i / chars.length) * 100}%`}>
            {char}
          </textPath>
        </text>
      ))}
    </svg>
  );
}

type NavLink = { label: string; href: string; active?: boolean; external?: boolean };

// Menu único, sempre no topo.
// - Fechado: só o círculo laranja, fixo no canto superior direito, com
//   "MENU · <página atual>" no anel.
// - Aberto (desktop): o círculo desliza até o centro e uma pílula com as
//   páginas se abre para os dois lados. No celular o círculo fica no canto e
//   abre uma lista logo abaixo dele.
// No desktop ele começa aberto no topo da página e se fecha no círculo ao
// rolar; clicar no círculo abre/fecha a qualquer momento.
export function MenuDock() {
  const { profile } = useSiteContent();
  const { pathname, home, about, experience } = useSitePaths();
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopTl = useRef<gsap.core.Timeline | null>(null);
  const mobileTl = useRef<gsap.core.Timeline | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const openedAt = useRef(0);
  const openRef = useRef(false);

  const links: NavLink[] = [
    ...(pathname === home ? [] : [{ label: "Início", href: home }]),
    { label: "Projetos", href: `${home}#projetos` },
    { label: "Sobre mim", href: about, active: pathname === about },
    { label: "Experiência", href: experience, active: pathname === experience },
    { label: "Contato", href: "#contato" },
    ...(profile.cvUrl ? [{ label: "Baixar CV ↓", href: profile.cvUrl, external: true }] : []),
  ];
  // No desktop os itens se dividem dos dois lados do círculo.
  const half = Math.ceil(links.length / 2);
  const left = links.slice(0, half);
  const right = links.slice(half);

  const { contextSafe } = useGSAP(
    () => {
      gsap.to(".menu-ring", { rotate: 360, duration: 16, ease: "none", repeat: -1 });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Fechado, o círculo fica no canto superior direito; aberto, desliza
        // até o centro e a pílula se abre a partir dele.
        const timeline = gsap
          .timeline({ paused: true })
          .set([".menu-side", ".menu-pill"], { visibility: "visible" }, 0.3)
          .fromTo(".menu-pill", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.out" }, 0.3)
          .fromTo(
            ".menu-side .nav-item",
            { autoAlpha: 0, y: -8 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.03 },
            0.45,
          )
          .to(".menu-ring", { autoAlpha: 0, duration: 0.25 }, 0)
          .to(".menu-bar-top", { y: 0, rotate: 45, duration: 0.35 }, 0)
          .to(".menu-bar-bottom", { y: 0, rotate: -45, duration: 0.35 }, 0);
        desktopTl.current = timeline;
        gsap.set(".menu-shift", { x: cornerOffset() });
        // Largura da janela mudou: recalcula a distância até o canto.
        const onResize = () => {
          if (!openRef.current) gsap.set(".menu-shift", { x: cornerOffset() });
        };
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("resize", onResize);
          desktopTl.current = null;
        };
      });
      mm.add("(max-width: 767px)", () => {
        mobileTl.current = gsap
          .timeline({ paused: true })
          .set(".menu-drop", { visibility: "visible" })
          .fromTo(".menu-drop-bg", { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.out" }, 0)
          .fromTo(
            ".menu-drop .nav-item",
            { autoAlpha: 0, y: -10 },
            { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04 },
            0.1,
          )
          .to(".menu-ring", { autoAlpha: 0, duration: 0.25 }, 0)
          .to(".menu-bar-top", { y: 0, rotate: 45, duration: 0.35 }, 0)
          .to(".menu-bar-bottom", { y: 0, rotate: -45, duration: 0.35 }, 0);
        return () => {
          mobileTl.current = null;
        };
      });

      const desktop = window.matchMedia("(min-width: 768px)");
      let wasAtTop: boolean | null = null;
      const sync = (self: ScrollTrigger) => {
        const y = self.scroll();
        const atTop = y < COLLAPSE_AT;
        // Desktop: abre ao chegar no topo, fecha ao sair dele.
        if (desktop.matches && atTop !== wasAtTop) setOpen(atTop);
        else if (!atTop && Math.abs(y - openedAt.current) > CLOSE_AFTER_SCROLL) setOpen(false);
        wasAtTop = atTop;
      };
      triggerRef.current = ScrollTrigger.create({ start: 0, end: "max", onUpdate: sync, onRefresh: sync });
      sync(triggerRef.current);

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const timeline = desktop ? desktopTl.current : mobileTl.current;
    openRef.current = open;
    if (open) {
      openedAt.current = triggerRef.current?.scroll() ?? window.scrollY;
      // Desktop: o círculo vai do canto ao centro e a pílula se abre.
      if (desktop) gsap.to(".menu-shift", { x: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
      timeline?.timeScale(1).play();
    } else {
      timeline?.timeScale(1.5).reverse();
      // …e ao fechar, a pílula se recolhe e o círculo volta para o canto.
      if (desktop) gsap.to(".menu-shift", { x: cornerOffset(), duration: 0.5, delay: 0.3, ease: "power3.inOut", overwrite: true });
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
      if (open && window.scrollY >= COLLAPSE_AT && !rootRef.current?.contains(event.target as Node)) setOpen(false);
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
      x: (event.clientX - rect.left - rect.width / 2) * 0.25,
      y: (event.clientY - rect.top - rect.height / 2) * 0.25,
      duration: 0.4,
    });
  });
  const onButtonOut = contextSafe(() => {
    gsap.to(".menu-magnet", { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  });

  const itemClass =
    "block whitespace-nowrap rounded-full px-4 py-2.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent";

  const renderItem = (item: NavLink) => {
    const className = `${itemClass} ${
      item.external
        ? "text-accent hover:bg-accent hover:text-ink"
        : item.active
          ? "bg-cream text-ink"
          : "text-cream hover:bg-cream/10"
    }`;
    return (
      <li key={item.label} className="nav-item">
        {item.external ? (
          <a href={item.href} target="_blank" rel="noreferrer" className={className}>
            {item.label}
          </a>
        ) : (
          <TransitionLink href={item.href} aria-current={item.active ? "page" : undefined} className={className}>
            {item.label}
          </TransitionLink>
        )}
      </li>
    );
  };

  return (
    <div ref={rootRef} className="fixed right-5 top-5 z-50 md:left-1/2 md:right-auto md:w-max md:-translate-x-1/2">
      <nav aria-label="Navegação principal" className="menu-shift relative">
        {/* Fundo da pílula (desktop): abre a partir do centro. */}
        <span className="menu-pill invisible absolute -inset-x-2 -inset-y-1 hidden rounded-full border border-cream/10 bg-[#1b1b1f]/80 backdrop-blur-xl md:block" />

        <div className="relative flex items-center md:grid md:grid-cols-[1fr_auto_1fr] md:gap-2">
          <ul inert={!open} className="menu-side invisible hidden justify-end md:flex">
            {left.map(renderItem)}
          </ul>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu-drop"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
            onPointerMove={onButtonMove}
            onPointerLeave={onButtonOut}
            className="relative grid size-14 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cream"
          >
            <span className="menu-magnet absolute -inset-4 text-cream mix-blend-difference">
              <RingText text={`MENU · ${pageLabel(pathname).toUpperCase()} · `} />
            </span>
            <span className="menu-magnet absolute inset-0 grid place-items-center">
              <span className="absolute inset-0 rounded-full bg-accent shadow-[0_8px_30px_rgba(255,95,46,0.35)]" />
              <span className="relative block h-3 w-5">
                <span className="menu-bar-top absolute left-0 top-1/2 block h-[2px] w-full -translate-y-[5px] bg-ink" />
                <span className="menu-bar-bottom absolute left-0 top-1/2 block h-[2px] w-full translate-y-[3px] bg-ink" />
              </span>
            </span>
          </button>

          <ul inert={!open} className="menu-side invisible hidden md:flex">
            {right.map(renderItem)}
          </ul>
        </div>

        {/* Celular: lista logo abaixo do círculo. */}
        <div
          id="menu-drop"
          inert={!open}
          className="menu-drop invisible absolute right-0 top-[calc(100%+18px)] w-56 md:hidden"
        >
          <span className="menu-drop-bg absolute inset-0 origin-top-right rounded-[24px] border border-cream/10 bg-[#1b1b1f]/95 backdrop-blur-xl" />
          <ul className="relative flex flex-col gap-0.5 p-2 text-center">{links.map(renderItem)}</ul>
        </div>
      </nav>
    </div>
  );
}
