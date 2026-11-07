"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";
import { afterReveal } from "../transition/navigation";

// Abertura da página Sobre: o "Resumo em 30 segundos" (TL;DR) com foto —
// tudo o que o RH precisa para decidir se continua lendo.
export function AboutHero() {
  const { profile, texts } = useSiteContent();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, { shape: 3, x: 0.55, scale: 0.8, opacity: 0.6 }, { end: "bottom 40%" });
  useSplitReveal(titleRef, { by: "words", on: "reveal" });
  useGSAP(
    () => {
      const tween = gsap.from("[data-about-fade]", {
        autoAlpha: 0,
        y: 24,
        duration: 1.1,
        stagger: 0.07,
        delay: 0.4,
        paused: true,
      });
      return afterReveal(() => tween.play());
    },
    { scope: rootRef },
  );

  const facts = [
    { label: "Carreira", value: profile.tldr.career },
    { label: "Onde estou", value: profile.tldr.basedIn || profile.location },
    { label: "Skillset", value: profile.tldr.skillset },
    { label: "Experiência com", value: profile.tldr.experience },
    { label: "Idiomas", value: profile.tldr.languages },
    { label: "Status", value: profile.availability },
  ].filter((fact) => fact.value.trim());
  const linkedin = profile.socials.find((social) => /linkedin/i.test(social.label + social.href));

  return (
    <section ref={rootRef} className="relative px-5 pb-[10vh] pt-[18vh] md:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div data-about-fade>
            <Eyebrow>
              <Accent text={texts["about.tldr.title"].replace(/\*/g, "")} />
            </Eyebrow>
          </div>
          <h1
            ref={titleRef}
            className="mt-6 text-[clamp(3rem,7.5vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.045em]"
          >
            {profile.name}
          </h1>
          <p data-about-fade className="mt-4 text-xl text-accent md:text-2xl">
            {profile.role}
          </p>

          <dl data-about-fade className="mt-10 divide-y divide-cream/12 border-y border-cream/12">
            {facts.map((fact) => (
              <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{fact.label}</dt>
                <dd className="text-lg leading-snug text-cream/90">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div data-about-fade className="mt-8 flex flex-wrap gap-3">
            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
              >
                Baixar CV ↓
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
              >
                LinkedIn ↗
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
            >
              {profile.email}
            </a>
          </div>
        </div>

        {profile.photo && (
          <div data-about-fade className="md:col-span-4 md:col-start-9">
            {/* eslint-disable-next-line @next/next/no-img-element -- foto enviada pelo admin */}
            <img
              src={profile.photo}
              alt={`Foto de ${profile.name}`}
              className="aspect-[3/4] w-full rounded-sm object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
