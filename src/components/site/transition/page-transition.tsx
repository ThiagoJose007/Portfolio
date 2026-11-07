"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nav, profile } from "@/content/site";
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import {
  MENU_CLOSE_EVENT,
  registerNavigator,
  scrollToTarget,
  setRevealed,
} from "./navigation";

// Overlay em "ondas" (baseado no demo SVG Shape Overlays): cobre a tela,
// troca a rota por baixo e revela a nova página.

const NUM_POINTS = 9;
const FULL = "M 0 0 H 100 V 100 H 0 Z";

type Mode = "cover" | "reveal";

function buildPath(points: number[], mode: Mode) {
  let d = mode === "cover" ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;
  for (let j = 0; j < NUM_POINTS - 1; j++) {
    const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
    const cp = p - 100 / (NUM_POINTS - 1) / 2;
    d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
  }
  return d + (mode === "cover" ? " V 100 H 0" : " V 0 H 0");
}

function waveTimeline(paths: SVGPathElement[], mode: Mode) {
  const all = paths.map(() => new Array<number>(NUM_POINTS).fill(100));
  const delays = Array.from({ length: NUM_POINTS }, () => Math.random() * 0.22);
  const render = () =>
    paths.forEach((path, i) => path.setAttribute("d", buildPath(all[i], mode)));

  const tl = gsap.timeline({
    onUpdate: render,
    defaults: { ease: "power2.inOut", duration: 0.75 },
  });
  all.forEach((points, i) => {
    const pathDelay = 0.14 * (mode === "cover" ? i : paths.length - i - 1);
    points.forEach((_, j) => tl.to(points, { [j]: 0 }, delays[j] + pathDelay));
  });
  render();
  return tl;
}

function labelFor(pathname: string) {
  if (pathname.startsWith("/p/")) return "Olá";
  return nav.find((item) => item.href === pathname)?.label ?? profile.name;
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const state = useRef({ busy: true, target: "", hash: "" });

  const paths = () => gsap.utils.toArray<SVGPathElement>("path", rootRef.current);

  const { contextSafe } = useGSAP(
    () => {
      // Carregamento inicial: contador 0 → 100 enquanto as fontes carregam,
      // depois revela a página.
      const counter = { value: 0 };
      const intro = gsap.timeline({ paused: true });
      intro
        .to(counter, {
          value: 100,
          duration: prefersReducedMotion() ? 0.2 : 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        })
        .to(labelRef.current, { autoAlpha: 0, yPercent: -60, duration: 0.5 })
        .add(waveTimeline(paths(), "reveal"), "-=0.3")
        .call(() => setRevealed(true), [], "-=0.55")
        .call(() => {
          state.current.busy = false;
          if (window.location.hash) scrollToTarget(window.location.hash, false);
        })
        .set(rootRef.current, { autoAlpha: 0 });

      document.fonts.ready.then(() => intro.play());
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const cover = contextSafe((href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        window.dispatchEvent(new Event(MENU_CLOSE_EVENT));
        scrollToTarget(url.hash || 0);
        return;
      }
      if (state.current.busy) return;

      state.current = { busy: true, target: url.pathname, hash: url.hash };
      window.dispatchEvent(new Event(MENU_CLOSE_EVENT));
      setRevealed(false);

      if (labelRef.current) {
        const text = labelRef.current.querySelector("[data-label]");
        if (text) text.textContent = labelFor(url.pathname);
      }
      if (counterRef.current) counterRef.current.textContent = "";

      const tl = gsap.timeline();
      tl.set(rootRef.current, { autoAlpha: 1 })
        .add(waveTimeline(paths(), "cover"))
        .fromTo(
          labelRef.current,
          { autoAlpha: 0, yPercent: 60 },
          { autoAlpha: 1, yPercent: 0, duration: 0.6 },
          "-=0.35",
        )
        .call(() => router.push(url.pathname + url.search + url.hash, { scroll: false }));
      if (prefersReducedMotion()) tl.timeScale(2.5);
    });
    return registerNavigator(cover);
  }, [router, contextSafe]);

  // A nova rota já foi montada (por baixo do overlay): zera o scroll,
  // recalcula os ScrollTriggers e revela.
  useEffect(() => {
    const { busy, target, hash } = state.current;
    if (!busy || !target || pathname !== target) return;
    state.current.target = "";
    scrollToTarget(0, false);
    window.scrollTo(0, 0);
    const reveal = contextSafe(() => {
      ScrollTrigger.refresh();
      if (hash) scrollToTarget(hash, false);
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(rootRef.current, { autoAlpha: 0 });
          state.current.busy = false;
        },
      });
      tl.to(labelRef.current, { autoAlpha: 0, yPercent: -60, duration: 0.45 })
        .add(waveTimeline(paths(), "reveal"), 0.1)
        .call(() => setRevealed(true), [], 0.45);
      if (prefersReducedMotion()) tl.timeScale(2.5);
    });
    requestAnimationFrame(reveal);
  }, [pathname, contextSafe]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[70] grid place-items-center"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d={FULL} fill="var(--color-accent)" />
        <path d={FULL} fill="var(--color-ink)" />
      </svg>
      <p
        ref={labelRef}
        className="relative flex items-baseline gap-4 font-serif text-5xl italic text-cream md:text-7xl"
      >
        <span data-label>{profile.name}</span>
        <span ref={counterRef} className="font-mono text-xs not-italic tracking-widest text-muted">
          000
        </span>
      </p>
    </div>
  );
}
