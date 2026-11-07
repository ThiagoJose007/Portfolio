"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Transição entre seções: uma "bolha" com a cor da próxima seção invade a
// anterior e vai se achatando conforme o scroll (scrub).
export function SectionCurve({ className }: { className: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const curve = { depth: 0 };
    const render = () =>
      pathRef.current?.setAttribute("d", `M 0 100 Q 50 ${curve.depth} 100 100 Z`);
    render();
    gsap.to(curve, {
      depth: 100,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: svg.parentElement,
        start: "top bottom",
        end: "top 25%",
        scrub: true,
      },
    });
  });

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 top-px h-[14vh] w-full -translate-y-full ${className}`}
    >
      <path ref={pathRef} d="M 0 100 Q 50 0 100 100 Z" />
    </svg>
  );
}
