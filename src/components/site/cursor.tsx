"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Cursor seguidor (gsap.quickTo). Cresce sobre links/botões e mostra um rótulo
// em elementos com `data-cursor="Texto"`. Desligado em telas touch.
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    if (!dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(dot, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.45, ease: "power3" });
    let current: Element | null = null;

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      gsap.to(dot, { autoAlpha: 1, duration: 0.3, overwrite: "auto" });

      const target =
        (event.target as Element | null)?.closest("[data-cursor], a, button") ?? null;
      if (target === current) return;
      current = target;
      const label = target?.getAttribute("data-cursor") ?? "";
      if (textRef.current) textRef.current.textContent = label;
      gsap.to(dot, {
        scale: label ? 6 : target ? 2.6 : 1,
        duration: 0.5,
        ease: "site",
        overwrite: "auto",
      });
      gsap.to(textRef.current, { autoAlpha: label ? 1 : 0, duration: 0.25 });
    };
    const onLeave = () => gsap.to(dot, { autoAlpha: 0, duration: 0.3 });

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  });

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] grid size-3 place-items-center rounded-full bg-cream opacity-0 mix-blend-difference"
    >
      <span
        ref={textRef}
        className="whitespace-nowrap font-mono text-[2px] uppercase tracking-wider text-ink opacity-0"
      />
    </div>
  );
}
