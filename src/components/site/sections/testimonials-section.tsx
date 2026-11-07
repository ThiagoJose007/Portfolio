"use client";

import { useRef } from "react";
import type { Testimonial } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";
import { SectionCurve } from "../section-curve";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full w-[min(82vw,420px)] shrink-0 flex-col justify-between rounded-[28px] border border-ink/10 bg-cream p-7 md:p-9">
      <blockquote>
        <span aria-hidden className="block font-serif text-6xl leading-[0.6] text-accent">
          “
        </span>
        <p className="mt-4 text-lg leading-snug tracking-tight md:text-xl">{item.quote}</p>
      </blockquote>
      <figcaption className="mt-10 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-ink font-mono text-[11px] text-cream">
          {initialsOf(item.name)}
        </span>
        <span className="text-sm leading-tight">
          {item.name}
          <br />
          <span className="text-ink/55">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// Seção clara: a cena 3D some e duas faixas de depoimentos correm em sentidos
// opostos, acelerando com a velocidade do scroll.
export function TestimonialsSection({ index }: { index?: string }) {
  const { testimonials } = useSiteContent();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { items } = testimonials;
  const rows = [items, [...items].reverse()];

  useSceneSection(rootRef, { opacity: 0 }, { start: "top 40%", end: "bottom 60%" });
  useSplitReveal(titleRef, { by: "words" });

  useGSAP(
    () => {
      const tweens = gsap.utils.toArray<HTMLElement>("[data-row-track]").map((track, i) => {
        const tween = gsap.fromTo(
          track,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 45, ease: "none", repeat: -1 },
        );
        track.addEventListener("pointerenter", () => gsap.to(tween, { timeScale: 0.15, duration: 0.6 }));
        track.addEventListener("pointerleave", () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
        return tween;
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
          tweens.forEach((tween) => {
            gsap.to(tween, { timeScale: boost, duration: 0.2, overwrite: true });
            gsap.to(tween, { timeScale: 1, duration: 1.4, delay: 0.2 });
          });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="depoimentos" ref={rootRef} className="relative bg-paper py-[16vh] text-ink">
      <SectionCurve className="fill-paper" />

      <div className="px-5 md:px-8">
        <Eyebrow index={index}>{testimonials.label}</Eyebrow>
        <h2
          ref={titleRef}
          className="mt-5 max-w-4xl text-[clamp(2.2rem,5.4vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          <Accent text={testimonials.title} />
        </h2>
      </div>

      <div className="mt-16 space-y-5 overflow-hidden">
        {rows.map((row, i) => (
          <div key={i} data-row-track className="flex w-max gap-5 pr-5">
            {[...row, ...row].map((item, j) => (
              <TestimonialCard key={j} item={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
