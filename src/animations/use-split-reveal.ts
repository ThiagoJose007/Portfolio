"use client";

import type { RefObject } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { afterReveal } from "@/components/site/transition/navigation";

type SplitRevealOptions = {
  by?: "lines" | "words" | "chars";
  // "scroll": anima quando entra na tela · "reveal": anima quando a página é revelada
  on?: "scroll" | "reveal";
  delay?: number;
};

// Texto que "sobe" de dentro de uma máscara, linha a linha / palavra / letra.
export function useSplitReveal(
  ref: RefObject<HTMLElement | null>,
  { by = "lines", on = "scroll", delay = 0 }: SplitRevealOptions = {},
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      let cancel = () => {};

      const split = SplitText.create(el, {
        type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const targets = self[by];
          const tween = gsap.from(targets, {
            yPercent: 115,
            rotate: by === "chars" ? 6 : 0,
            duration: 1.3,
            delay,
            stagger: by === "chars" ? 0.018 : by === "words" ? 0.035 : 0.09,
            paused: on === "reveal",
            scrollTrigger: on === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
          });
          if (on === "reveal") {
            cancel();
            cancel = afterReveal(() => tween.play());
          }
          return tween;
        },
      });

      return () => {
        cancel();
        split.revert();
      };
    },
    { scope: ref },
  );
}
