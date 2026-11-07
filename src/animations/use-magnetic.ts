"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// O elemento é "atraído" pelo ponteiro e volta com mola ao sair.
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !window.matchMedia("(hover: hover)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * strength);
        yTo((event.clientY - rect.top - rect.height / 2) * strength);
      };
      const onLeave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: true });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref },
  );
}
