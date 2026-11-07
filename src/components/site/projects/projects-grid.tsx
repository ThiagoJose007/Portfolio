"use client";

import { useRef } from "react";
import type { ShowcaseProject } from "@/lib/projects";
import { useReveal } from "@/animations/use-reveal";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { useSceneSection } from "../scene/use-scene-section";
import { TransitionLink } from "../transition/transition-link";
import { useSitePaths } from "../version-path";
import { ProjectCover } from "./project-cover";

// Vitrine da página inicial: todos os projetos da versão visíveis de uma vez,
// cada card com o essencial (papel, ano, resumo, stack) e link para o estudo
// de caso.
export function ProjectsGrid({ projects, title, index }: { projects: ShowcaseProject[]; title?: string; index?: string }) {
  const copy = useSiteContent().projects;
  const { project: projectPath } = useSitePaths();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, { shape: 1, x: 0.55, y: 0.2, scale: 1.3, opacity: 0.22, noise: 0.5 });
  useSplitReveal(titleRef, { by: "words" });
  useReveal(rootRef, { stagger: 0.1 });

  return (
    <section id="projetos" ref={rootRef} className="relative px-5 pb-[14vh] pt-[12vh] md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow index={index}>Projetos</Eyebrow>
          <h2
            ref={titleRef}
            className="mt-4 max-w-3xl text-[clamp(2.2rem,4.6vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.035em]"
          >
            <Accent text={title ?? copy.title} />
          </h2>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {String(projects.length).padStart(2, "0")} projetos
        </p>
      </div>

      {projects.length === 0 ? (
        <p className="mt-12 text-muted">Nenhum projeto publicado ainda.</p>
      ) : (
        <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => {
            const meta = [project.role, project.year].filter(Boolean).join(" · ");
            return (
              <li key={project.id} data-reveal>
                <TransitionLink
                  href={projectPath(project.slug)}
                  data-cursor="Ver"
                  className="group block outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-cream/5">
                    <div className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                      <ProjectCover project={project} />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-cream backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {project.highlighted && (
                      <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                        ★ Destaque
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-medium tracking-tight">{project.title}</h3>
                    <span
                      aria-hidden
                      className="mt-1 text-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </div>
                  {meta && (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{meta}</p>
                  )}
                  <p className="mt-3 line-clamp-3 text-cream/70">{project.summary}</p>
                  {project.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 5).map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-cream/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/70"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
