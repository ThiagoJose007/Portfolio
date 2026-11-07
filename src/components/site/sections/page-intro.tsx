"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import type { SceneTarget } from "../scene/scene-store";
import { useSceneSection } from "../scene/use-scene-section";
import { afterReveal } from "../transition/navigation";

// Abertura das páginas internas (Sobre, Projetos, Carreira, Depoimentos).
export function PageIntro({
  eyebrow,
  title,
  text,
  scene,
}: {
  eyebrow: string;
  title: string;
  text: string;
  scene: SceneTarget;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, scene, { end: "bottom 40%" });
  useSplitReveal(titleRef, { by: "chars", on: "reveal" });

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-intro-fade]");
      const tween = gsap.from(fades, { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.1, delay: 0.5, paused: true });
      const cancel = afterReveal(() => tween.play());
      gsap.to("[data-intro-content]", {
        yPercent: -20,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      return cancel;
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative flex min-h-[85svh] flex-col justify-end px-5 pb-[10vh] pt-[24vh] md:px-8">
      <div data-intro-content>
        <div data-intro-fade>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          ref={titleRef}
          className="mt-6 max-w-[16ch] text-[clamp(3rem,9vw,9.5rem)] font-medium leading-[0.9] tracking-[-0.045em]"
        >
          <Accent text={title} />
        </h1>
        <p data-intro-fade className="mt-8 max-w-xl text-lg text-cream/70 md:ml-[40%]">
          {text}
        </p>
      </div>
    </section>
  );
}
