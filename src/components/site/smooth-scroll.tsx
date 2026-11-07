"use client";

import { ScrollSmoother, prefersReducedMotion, useGSAP } from "@/lib/gsap";

// O ScrollSmoother precisa existir antes de qualquer ScrollTrigger com pin.
// Como efeitos rodam na ordem dos irmãos, `SmootherInit` (renderizado antes do
// conteúdo) é criado antes dos efeitos das seções.
function SmootherInit() {
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      smoothTouch: 0.1,
      effects: false,
    });
  });
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmootherInit />
      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">{children}</div>
      </div>
    </>
  );
}
