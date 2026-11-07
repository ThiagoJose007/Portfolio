"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const TICKS = 56;
const GAP = 18; // px livres ao redor do contador

// Régua vertical com o % de scroll (referência: labs.noomoagency.com).
// O contador desliza pela régua e os traços próximos dele "abrem espaço".
export function ScrollProgress() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const label = labelRef.current;
      if (!root || !label) return;
      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]", root);

      const update = (progress: number) => {
        const height = root.offsetHeight;
        const y = progress * height;
        label.textContent = `${Math.round(progress * 100)}%`;
        gsap.set(label, { y });
        ticks.forEach((tick, i) => {
          const tickY = (i / (TICKS - 1)) * height;
          const distance = Math.abs(tickY - y);
          gsap.set(tick, {
            autoAlpha: distance < GAP ? 0 : tickY < y ? 1 : 0.35,
            scaleX: 1 + Math.max(0, 1 - distance / 70) * 1.2,
          });
        });
      };

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => update(self.progress),
        onRefresh: (self) => update(self.progress),
      });
      update(0);
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-[54vh] w-6 -translate-y-1/2 text-cream mix-blend-difference md:block"
    >
      {Array.from({ length: TICKS }, (_, i) => (
        <span
          key={i}
          data-tick
          className="absolute right-0 h-px w-2 origin-right bg-current"
          style={{ top: `${(i / (TICKS - 1)) * 100}%` }}
        />
      ))}
      <span
        ref={labelRef}
        className="absolute -top-3 right-0 font-mono text-[10px] tracking-wider [writing-mode:vertical-rl]"
      >
        0%
      </span>
    </div>
  );
}
