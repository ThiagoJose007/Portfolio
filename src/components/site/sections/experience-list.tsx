"use client";

import { useRef } from "react";
import { useReveal } from "@/animations/use-reveal";
import { useSplitReveal } from "@/animations/use-split-reveal";
import type { ExperienceItem } from "@/lib/content/types";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";

// Experiência no formato que o RH lê: cargo e empresa em destaque, período
// e local ao lado, a frase do capítulo como subtítulo e as conquistas em
// lista. Do mais recente para o mais antigo.
export function ExperienceList({ index, experiences }: { index?: string; experiences: ExperienceItem[] }) {
  const { career, texts, profile } = useSiteContent();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, { shape: 1, x: 0.55, y: 0.1, scale: 0.8, opacity: 0.3, noise: 0.3 });
  useSplitReveal(titleRef, { by: "words" });
  useReveal(rootRef);

  const items = [...experiences].reverse();
  const next = texts["career.next.title"]?.trim()
    ? { title: texts["career.next.title"], text: texts["career.next.text"], period: texts["career.next.period"] }
    : null;

  return (
    <section id="experiencia" ref={rootRef} className="relative px-5 py-[12vh] md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow index={index}>{career.label}</Eyebrow>
          <h2
            ref={titleRef}
            className="mt-4 max-w-3xl text-[clamp(2.2rem,4.6vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.035em]"
          >
            <Accent text={career.title} />
          </h2>
        </div>
        {profile.tldr.career && (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{profile.tldr.career}</p>
        )}
      </div>

      <ol className="mt-14 border-t border-cream/15">
        {items.map((item, i) => (
          <li key={item.id} data-reveal className="grid gap-4 border-b border-cream/15 py-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{item.period}</p>
              {item.location && <p className="mt-2 text-sm text-muted">{item.location}</p>}
              {i === 0 && !item.end && (
                <span className="mt-3 inline-block rounded-full border border-accent/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  Atual
                </span>
              )}
            </div>
            <div className="md:col-span-9">
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.025em]">
                {item.role} <span className="text-cream/45">·</span> {item.company}
              </h3>
              {item.headline && (
                <p className="mt-2 text-lg text-cream/60">
                  <Accent text={item.headline} />
                </p>
              )}
              {item.summary && <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-cream/80">{item.summary}</p>}
              {item.highlights.length > 0 && (
                <ul className="mt-5 max-w-3xl space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-cream/85">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>

      {next && (
        <div data-reveal className="mt-12 grid gap-4 rounded-[28px] border border-dashed border-cream/25 p-7 md:grid-cols-12 md:gap-8 md:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent md:col-span-3">{next.period}</p>
          <div className="md:col-span-9">
            <p className="text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.05] tracking-[-0.025em]">
              <Accent text={next.title} />
            </p>
            {next.text && <p className="mt-3 max-w-3xl text-lg text-cream/75">{next.text}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
