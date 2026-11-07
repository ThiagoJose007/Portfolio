"use client";

import { useRef } from "react";
import { useReveal } from "@/animations/use-reveal";
import type { AwardItem, EducationItem, SimpleItem } from "@/lib/content/types";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";
import type { SceneTarget } from "../scene/scene-store";

// Seções de leitura das páginas Sobre e Experiência: blocos simples, com
// hierarquia clara (rótulo → título → conteúdo) e entrada suave ao rolar.

function Section({
  id,
  index,
  label,
  title,
  scene,
  children,
}: {
  id?: string;
  index?: string;
  label: string;
  title?: string;
  scene?: SceneTarget;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);
  useSceneSection(rootRef, scene ?? { opacity: 0.25 });

  return (
    <section id={id} ref={rootRef} className="relative px-5 py-[12vh] md:px-8">
      <div data-reveal>
        <Eyebrow index={index}>{label}</Eyebrow>
        {title && (
          <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.2vw,4.2rem)] font-medium leading-[0.95] tracking-[-0.035em]">
            <Accent text={title} />
          </h2>
        )}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

export function ProcessSection({ index, steps }: { index?: string; steps: SimpleItem[] }) {
  const { texts } = useSiteContent();
  if (steps.length === 0) return null;
  return (
    <Section index={index} label="Processo" title={texts["process.title"]} scene={{ shape: 2, x: 0.5, scale: 0.7, opacity: 0.35 }}>
      <ol className="grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.id} data-reveal className="flex flex-col gap-6 bg-ink p-7 md:p-8">
            <span className="font-serif text-6xl italic leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-xl font-medium tracking-tight">{step.title}</span>
              {step.text && <span className="mt-2 block whitespace-pre-line text-cream/70">{step.text}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function SkillsGrid({ index }: { index?: string }) {
  const { skills } = useSiteContent();
  if (skills.groups.length === 0) return null;
  return (
    <Section index={index} label={skills.label} title={skills.title} scene={{ shape: 2, y: 0.06, scale: 0.72, noise: 0.15, opacity: 0.4 }}>
      <div className="grid gap-4 md:grid-cols-2">
        {skills.groups.map((group) => (
          <article key={group.id} data-reveal className="rounded-[28px] border border-cream/12 bg-cream/[0.03] p-7 md:p-9">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{group.label}</h3>
            {group.headline && <p className="mt-3 text-xl font-medium tracking-tight md:text-2xl">{group.headline}</p>}
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.stacks.map((stack) => (
                <li key={stack} className="rounded-full border border-cream/20 px-3.5 py-1.5 text-sm text-cream/90">
                  {stack}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ItemList({ items }: { items: SimpleItem[] }) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.id} className="border-t border-cream/12 pt-4">
          <p className="text-lg font-medium tracking-tight">{item.title}</p>
          {item.text && <p className="mt-1 whitespace-pre-line text-cream/65">{item.text}</p>}
        </li>
      ))}
    </ul>
  );
}

// Classes completas (o Tailwind não enxerga nomes montados em tempo de execução).
const GRID_COLS: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3" };

// Valores, hobbies e "o que busco" (slides "About me" do deck).
export function BeyondSection({ index }: { index?: string }) {
  const { texts, values, hobbies, goals } = useSiteContent();
  const columns = [
    { label: texts["beyond.goals"], items: goals },
    { label: texts["beyond.values"], items: values },
    { label: texts["beyond.hobbies"], items: hobbies },
  ].filter((column) => column.items.length > 0);
  if (columns.length === 0) return null;
  return (
    <Section index={index} label="Além do currículo" title={texts["beyond.title"]} scene={{ shape: 0, x: -0.5, scale: 0.6, opacity: 0.4 }}>
      <div className={`grid gap-10 ${GRID_COLS[columns.length]}`}>
        {columns.map((column) => (
          <div key={column.label} data-reveal>
            <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{column.label}</h3>
            <ItemList items={column.items} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FreelanceSection({ index }: { index?: string }) {
  const { profile, freelance, services } = useSiteContent();
  if (!profile.freelanceEnabled || (services.length === 0 && !freelance.text.trim())) return null;
  return (
    <Section index={index} label="Freelancer" title={freelance.title}>
      <div className="grid gap-10 md:grid-cols-12">
        {freelance.text && (
          <p data-reveal className="whitespace-pre-line text-lg text-cream/80 md:col-span-5">
            {freelance.text}
          </p>
        )}
        {services.length > 0 && (
          <div data-reveal className="md:col-span-6 md:col-start-7">
            <ItemList items={services} />
          </div>
        )}
      </div>
    </Section>
  );
}

export function EducationSection({ index, items }: { index?: string; items: EducationItem[] }) {
  const { texts } = useSiteContent();
  if (items.length === 0) return null;
  return (
    <Section index={index} label="Formação" title={texts["education.title"]} scene={{ shape: 3, x: 0.5, scale: 0.6, opacity: 0.35 }}>
      <ul className="divide-y divide-cream/12 border-y border-cream/12">
        {items.map((item) => (
          <li key={item.id} data-reveal className="grid gap-2 py-6 md:grid-cols-12 md:gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:col-span-3 md:pt-1.5">
              {item.period || "—"} · {item.kind}
            </p>
            <div className="md:col-span-9">
              <p className="text-2xl font-medium tracking-tight">{item.course}</p>
              <p className="mt-1 text-cream/70">{item.institution}</p>
              {item.description && <p className="mt-3 whitespace-pre-line text-cream/65">{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AwardsSection({ index, items }: { index?: string; items: AwardItem[] }) {
  const { texts } = useSiteContent();
  if (items.length === 0) return null;
  return (
    <Section index={index} label="Prêmios" title={texts["awards.title"]}>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} data-reveal className="flex gap-5 rounded-[24px] border border-cream/12 p-6">
            <span aria-hidden className="text-2xl text-accent">
              ★
            </span>
            <span>
              <span className="block text-lg font-medium tracking-tight">{item.title}</span>
              <span className="mt-1 block text-sm text-cream/65">
                {[item.project, item.issuer, item.year].filter(Boolean).join(" · ")}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
