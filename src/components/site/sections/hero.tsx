"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
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
  eyebrow: string;
  title: string;
  intro: string;
  cta?: string | null;
};

// Abertura: quem sou em 5 segundos. Título, texto curto, fatos rápidos
// (o TL;DR do Perfil) e as ações principais.
export function Hero({ eyebrow, title, intro, cta }: HeroProps) {
  const { hero, profile } = useSiteContent();
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

      const intro = gsap.timeline({ paused: true }).to(fades, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.45);
      tags.forEach((tag, i) => {
        intro.set(tag, { autoAlpha: 1 }, 0.8 + i * 0.12).to(
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

      return cancel;
    },
    { scope: rootRef },
  );

  const facts = [
    { label: "Cargo", value: profile.role },
    { label: "Carreira", value: profile.tldr.career },
    { label: "Base", value: profile.tldr.basedIn || profile.location },
    { label: "Status", value: profile.availability },
  ].filter((fact) => fact.value.trim());

  const linkedin = profile.socials.find((social) => /linkedin/i.test(social.label + social.href));

  return (
    <section id="inicio" ref={rootRef} className="relative flex min-h-[680px] flex-col overflow-hidden px-5 md:h-svh md:px-8">
      <div data-hero-content className="relative flex flex-1 flex-col justify-center pb-[8vh] pt-[16vh] md:pt-[14vh]">
        <div data-hero-fade>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          ref={titleRef}
          className="mt-6 max-w-[14ch] text-[clamp(2.6rem,6.2vw,6.6rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          <Accent text={title} />
        </h1>

        <div className="mt-8 flex max-w-xl flex-col gap-7">
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
              Ver projetos ↓
            </button>
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
              >
                Baixar CV
              </a>
            )}
            {linkedin ? (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
              >
                LinkedIn ↗
              </a>
            ) : (
              <button
                type="button"
                onClick={() => scrollToTarget("#contato")}
                className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
              >
                Contato
              </button>
            )}
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

      {/* Fatos rápidos: o essencial para quem tem 10 segundos. */}
      {facts.length > 0 && (
        <dl
          data-hero-fade
          className="relative mb-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-cream/15 pt-5 md:mb-10 md:grid-cols-4 md:pr-32"
        >
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{fact.label}</dt>
              <dd className="mt-1.5 text-sm leading-snug text-cream/90 md:text-base">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
