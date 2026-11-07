"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

// As palavras "acendem" conforme o scroll avança (scrub), como uma leitura guiada.
export function useScrubText(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
      });
      return () => split.revert();
    },
    { scope: ref },
  );
}
