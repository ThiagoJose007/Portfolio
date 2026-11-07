"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Fade + subida em lote para todos os `[data-reveal]` dentro do container,
// conforme entram na tela.
export function useReveal(
  ref: RefObject<HTMLElement | null>,
  { selector = "[data-reveal]", y = 40, stagger = 0.08 } = {},
) {
  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(selector, ref.current);
      if (!targets.length) return;
      gsap.set(targets, { autoAlpha: 0, y });
      ScrollTrigger.batch(targets, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, stagger, overwrite: true }),
      });
    },
    { scope: ref },
  );
}
