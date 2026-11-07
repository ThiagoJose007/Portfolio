"use client";

import { useMemo, useRef, useState } from "react";
import type { ShowcaseProject } from "@/lib/projects";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/animations/use-reveal";
import { Eyebrow } from "../accent";
import { ProjectCover } from "./project-cover";
import { ProjectModal } from "./project-modal";

// Lista completa com filtro por tag (animado com Flip) e a capa do projeto
// seguindo o cursor no hover (referência: demos "smooth flexbox filtering" e
// "show cursor image on hover").
export function ProjectsIndex({ projects }: { projects: ShowcaseProject[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("Todos");
  const [hovered, setHovered] = useState<ShowcaseProject | null>(null);
  const [selected, setSelected] = useState<ShowcaseProject | null>(null);

  const tags = useMemo(
    () => ["Todos", ...Array.from(new Set(projects.flatMap((project) => project.tags)))],
    [projects],
  );

  useReveal(rootRef);

  const { contextSafe } = useGSAP(
    () => {
      gsap.set(previewRef.current, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.6 });
    },
    { scope: rootRef },
  );

  const applyFilter = (tag: string) =>
    contextSafe(() => {
      setFilter(tag);
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", listRef.current);
      const state = Flip.getState(rows);
      rows.forEach((row) => {
        const rowTags = (row.dataset.tags ?? "").split("|");
        row.style.display = tag === "Todos" || rowTags.includes(tag) ? "" : "none";
      });
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    })();

  const movePreview = (event: React.PointerEvent) =>
    contextSafe(() => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      gsap.to(previewRef.current, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        duration: 0.6,
        ease: "power3",
      });
    })();

  const showPreview = (project: ShowcaseProject | null) =>
    contextSafe(() => {
      setHovered(project);
      gsap.to(previewRef.current, {
        autoAlpha: project ? 1 : 0,
        scale: project ? 1 : 0.6,
        duration: 0.45,
        overwrite: "auto",
      });
    })();

  if (projects.length === 0) return null;

  return (
    <section ref={rootRef} className="relative px-5 py-[14vh] md:px-8" onPointerMove={movePreview}>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Eyebrow>Índice</Eyebrow>
          <h2 className="mt-4 text-[clamp(2rem,4vw,4rem)] font-medium leading-none tracking-[-0.03em]">
            Todos os projetos
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tag">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={filter === tag}
              onClick={() => applyFilter(tag)}
              className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                filter === tag
                  ? "border-cream bg-cream text-ink"
                  : "border-cream/25 hover:border-cream"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <ul ref={listRef} className="mt-14 border-t border-cream/15" onPointerLeave={() => showPreview(null)}>
        {projects.map((project, i) => (
          <li key={project.id} data-row data-reveal data-tags={project.tags.join("|")}>
            <button
              type="button"
              data-cursor="Abrir"
              onPointerEnter={() => showPreview(project)}
              onClick={() => setSelected(project)}
              className="group grid w-full grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-cream/15 py-7 text-left md:grid-cols-[4rem_1.2fr_1fr_auto] md:py-9"
            >
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                {project.title}
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted md:block">
                {project.tags.join(" · ")}
              </span>
              <span aria-hidden className="text-xl transition-transform duration-500 group-hover:-rotate-45">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/3] w-[22vw] overflow-hidden rounded-sm md:block"
      >
        {hovered && <ProjectCover project={hovered} />}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
