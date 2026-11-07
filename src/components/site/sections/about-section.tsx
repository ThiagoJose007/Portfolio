"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/animations/use-reveal";
import { useScrubText } from "@/animations/use-scrub-text";
import { Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";

export function AboutSection({ index }: { index?: string }) {
  const { about, profile, texts } = useSiteContent();
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useSceneSection(rootRef, { shape: 0, x: -0.62, y: 0.1, scale: 0.6, opacity: 0.7, noise: 0.5 });
  useScrubText(textRef);
  useReveal(rootRef);

  // Contadores sobem de 0 até o valor quando entram na tela.
  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="sobre" ref={rootRef} className="relative px-5 py-[16vh] md:px-8">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Eyebrow index={index}>{about.label}</Eyebrow>
        </div>
        <p
          ref={textRef}
          className="text-[clamp(1.6rem,3.4vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.025em] md:col-span-9"
        >
          {about.manifesto}
        </p>
      </div>

      {profile.bio && (
        <div data-reveal className="mt-[10vh] grid gap-6 md:grid-cols-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent md:col-span-3 md:pt-1.5">
            {texts["about.bio.label"]}
          </p>
          <p className="whitespace-pre-line text-lg leading-relaxed text-cream/80 md:col-span-7 md:text-xl">
            {profile.bio}
          </p>
        </div>
      )}

      {about.stats.length > 0 && (
      <dl className="mt-[12vh] grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 md:ml-[25%] md:grid-cols-3">
        {about.stats.map((stat) => (
          <div key={stat.label} data-reveal className="bg-ink p-7 md:p-9">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {stat.label}
            </dt>
            <dd className="mt-6 text-6xl font-medium tracking-tight md:text-7xl">
              <span data-count={stat.value}>{stat.value}</span>
              <span className="text-accent">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
      )}
    </section>
  );
}
