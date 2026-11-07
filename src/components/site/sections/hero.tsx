"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";
import { afterReveal, scrollToTarget } from "../transition/navigation";

// Rótulos que flutuam em volta da esfera (referência: byotone.com).
const TAG_POSITIONS = [
  { left: "63%", top: "16%" },
  { left: "86%", top: "26%" },
  { left: "59%", top: "70%" },
  { left: "85%", top: "64%" },
];

type HeroProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  cta?: string | null;
};

export function Hero({
  eyebrow: eyebrowProp,
  title: titleProp,
  intro: introProp,
  cta,
}: HeroProps) {
  const { hero, profile } = useSiteContent();
  const eyebrow = eyebrowProp ?? hero.eyebrow;
  const title = titleProp ?? hero.title;
  const intro = introProp ?? hero.intro;
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, { shape: 0, x: 0.4, scale: 1.05 }, { end: "bottom 40%" });
  useSplitReveal(titleRef, { by: "words", on: "reveal", delay: 0.05 });

  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      const tags = gsap.utils.toArray<HTMLElement>("[data-hero-tag]");
      gsap.set(fades, { autoAlpha: 0, y: 24 });
      gsap.set(tags, { autoAlpha: 0 });

      const intro = gsap
        .timeline({ paused: true })
        .to(fades, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45)
        .from("[data-hero-marquee]", { yPercent: 100, duration: 1.6 }, 0.2);
      tags.forEach((tag, i) => {
        intro
          .set(tag, { autoAlpha: 1 }, 0.8 + i * 0.12)
          .to(
            tag.querySelector("[data-text]"),
            {
              duration: 1.1,
              scrambleText: { text: tag.dataset.label ?? "", chars: "upperCase", speed: 0.5 },
            },
            "<",
          );
      });
      const cancel = afterReveal(() => intro.play());

      // Ao rolar, o conteúdo sobe e some enquanto a esfera continua.
      gsap.to("[data-hero-content]", {
        yPercent: -14,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom 15%", scrub: true },
      });

      // Letreiro com o nome: muda de direção conforme o sentido do scroll.
      const marquee = gsap.to("[data-marquee-track]", {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });
      // Começa "adiantado" para poder tocar ao contrário sem bater no início.
      marquee.totalTime(marquee.duration() * 100);
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 4);
          gsap.to(marquee, { timeScale: self.direction * boost, duration: 0.2, overwrite: true });
          gsap.to(marquee, { timeScale: self.direction, duration: 1.2, delay: 0.2 });
        },
      });

      return cancel;
    },
    { scope: rootRef },
  );

  const name = `${profile.name} — `;

  return (
    <section
      id="inicio"
      ref={rootRef}
      className="relative flex min-h-[640px] flex-col overflow-hidden px-5 md:h-svh md:px-8"
    >
      <div data-hero-content className="relative flex flex-1 flex-col justify-center pb-[6vh] pt-[16vh] md:pt-[12vh]">
        <div data-hero-fade>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          ref={titleRef}
          className="mt-6 max-w-[14ch] text-[clamp(2.6rem,6.2vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          <Accent text={title} />
        </h1>

        <div className="mt-10 flex max-w-md flex-col gap-7">
          <p data-hero-fade className="whitespace-pre-line text-base leading-relaxed text-cream/70 md:text-lg">
            {intro}
          </p>
          {cta && (
            <p data-hero-fade className="text-base font-medium text-cream">
              {cta}
            </p>
          )}
          <div data-hero-fade className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToTarget("#projetos")}
              className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
            >
              Ver projetos
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget("#contato")}
              className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
            >
              Contato
            </button>
          </div>
        </div>

        {hero.tags.map((tag, i) => (
          <p
            key={tag}
            data-hero-tag
            data-label={tag}
            className="absolute hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/80 md:flex"
            style={TAG_POSITIONS[i % TAG_POSITIONS.length]}
          >
            <span className="inline-block size-1.5 bg-accent" />
            <span data-text>{tag}</span>
          </p>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-[calc(13vw+2.5rem)] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" data-hero-fade>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Role para explorar</span>
        <span className="scroll-cue block h-10 w-px bg-cream/40" />
      </div>

      <div className="relative -mx-5 overflow-hidden md:-mx-8" aria-hidden>
        <div data-hero-marquee className="flex">
          <div data-marquee-track className="flex shrink-0 whitespace-nowrap">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block pr-[0.2em] text-[clamp(4.5rem,15vw,16rem)] font-medium leading-[0.8] tracking-[-0.05em]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
