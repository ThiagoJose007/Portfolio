"use client";

import { useRef, useState } from "react";
import type { ShowcaseProject } from "@/lib/projects";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useAlive } from "@/animations/use-alive";
import { Accent, Eyebrow } from "../accent";
import { useSceneSection } from "../scene/use-scene-section";
import { scrollToTarget } from "../transition/navigation";
import { ProjectCover } from "./project-cover";
import { ProjectModal } from "./project-modal";

const SMALL = 0.34; // escala dos cards fora de foco
const GAP = 24;

// Slider lateral (referência: oryzo.ai): o card em foco ocupa a moldura
// central, os outros ficam pequenos dos lados e o texto à esquerda acompanha.
export function ProjectsShowcase({
  projects,
  title = "Trabalhos *selecionados*",
  index,
}: {
  projects: ShowcaseProject[];
  title?: string;
  index?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [selected, setSelected] = useState<ShowcaseProject | null>(null);
  const count = projects.length;
  const alive = useAlive();

  useSceneSection(rootRef, { shape: 1, x: 0, scale: 1.5, opacity: 0.25, noise: 0.5 });

  useGSAP(
    () => {
      if (count === 0) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const infos = gsap.utils.toArray<HTMLElement>("[data-info]");
        gsap.set(cards, { xPercent: -50, yPercent: -50 });
        gsap.set(infos, { autoAlpha: (i: number) => (i === 0 ? 1 : 0) });

        const setActive = (next: number) => {
          const prev = activeRef.current;
          if (next === prev) return;
          activeRef.current = next;
          gsap.to(infos[prev], { autoAlpha: 0, y: -24, duration: 0.4, overwrite: true });
          gsap.fromTo(
            infos[next],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.1, overwrite: true },
          );
          gsap.to("[data-showcase-count]", {
            duration: 0.5,
            scrambleText: { text: String(next + 1).padStart(2, "0"), chars: "0123456789" },
          });
        };

        const layout = (p: number) => {
          const w = cards[0].offsetWidth;
          const h = cards[0].offsetHeight;
          const ws = w * SMALL;
          cards.forEach((card, i) => {
            const d = i - p;
            const ad = Math.min(Math.abs(d), count);
            const near = Math.min(ad, 1);
            const x =
              ad <= 1
                ? Math.sign(d) * ad * (w / 2 + GAP + ws / 2)
                : Math.sign(d) * (w / 2 + GAP + ws / 2 + (ad - 1) * (ws + GAP));
            gsap.set(card, {
              x,
              y: near * h * 0.27,
              scale: gsap.utils.interpolate(1, SMALL, near),
              zIndex: Math.round(100 - ad * 10),
            });
            gsap.set(card.querySelector("[data-shade]"), { opacity: near * 0.45 });
          });
          setActive(Math.round(p));
        };

        activeRef.current = 0;
        layout(0);
        if (count < 2) return;

        triggerRef.current = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${(count - 1) * 70}%`,
          pin: true,
          snap: { snapTo: 1 / (count - 1), duration: 0.5, delay: 0.08, ease: "power2.inOut" },
          onUpdate: (self) => {
            if (!alive.current) return;
            layout(self.progress * (count - 1));
            gsap.set("[data-showcase-progress]", { scaleX: self.progress });
          },
          onRefresh: (self) => alive.current && layout(self.progress * (count - 1)),
        });
        return () => {
          triggerRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [count] },
  );

  // Clique no card em foco abre os detalhes; nos outros, rola até ele.
  const onCardClick = (i: number) => {
    const st = triggerRef.current;
    if (!st || i === activeRef.current) {
      setSelected(projects[i]);
      return;
    }
    scrollToTarget(st.start + (i / (count - 1)) * (st.end - st.start));
  };

  return (
    <div>
      <section id="projetos" ref={rootRef} className="relative overflow-hidden py-24 md:h-svh md:py-0">
        <div className="px-5 md:absolute md:left-8 md:top-[14vh] md:z-10 md:w-[min(26vw,380px)] md:px-0">
          <Eyebrow index={index}>Projetos</Eyebrow>
          <h2 className="mt-4 text-[clamp(2rem,3.2vw,3.4rem)] font-medium leading-none tracking-[-0.03em]">
            <Accent text={title} />
          </h2>

          {count > 0 && (
            <div className="relative mt-10 hidden h-[34vh] md:block">
              {projects.map((project, i) => (
                <div key={project.id} data-info className="absolute inset-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {project.highlighted && <span className="mr-2 text-accent">★ destaque</span>}
                    {project.tags.slice(0, 3).join(" · ")}
                  </p>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight">{project.title}</h3>
                  <p className="mt-3 line-clamp-4 text-cream/70">{project.summary}</p>
                  <button
                    type="button"
                    onClick={() => setSelected(projects[i])}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/30 px-5 py-2.5 text-sm transition-colors hover:border-cream"
                  >
                    Ver detalhes <span aria-hidden>→</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {count === 0 ? (
          <p className="px-5 pt-10 text-muted md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:p-0">
            Nenhum projeto publicado ainda.
          </p>
        ) : (
          <>
            {/* Desktop: moldura + trilho */}
            <div className="absolute inset-0 hidden md:block">
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[74vh] w-[min(30vw,54vh)] -translate-x-1/2 -translate-y-1/2 border border-dashed border-cream/40"
              >
                <span className="absolute right-4 top-4 size-2 rounded-full bg-cream" />
              </div>
              {projects.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  data-card
                  data-cursor="Ver"
                  aria-label={`Abrir ${project.title}`}
                  onClick={() => onCardClick(i)}
                  className="absolute left-1/2 top-1/2 h-[calc(74vh-24px)] w-[calc(min(30vw,54vh)-24px)] origin-center overflow-hidden rounded-sm"
                >
                  <ProjectCover project={project} />
                  <span data-shade className="absolute inset-0 bg-ink opacity-0" />
                </button>
              ))}
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 font-mono text-[11px] tracking-[0.18em] text-muted">
                <span data-showcase-count className="text-cream">01</span>
                <span className="relative block h-px w-32 bg-cream/20">
                  <span data-showcase-progress className="absolute inset-0 origin-left scale-x-0 bg-cream" />
                </span>
                <span>{String(count).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Mobile: carrossel com scroll-snap */}
            <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:hidden">
              {projects.map((project) => (
                <li key={project.id} className="w-[78vw] shrink-0 snap-center">
                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="block aspect-[3/4] w-full overflow-hidden rounded-sm"
                  >
                    <ProjectCover project={project} />
                  </button>
                  <h3 className="mt-4 text-xl font-medium">{project.title}</h3>
                  <p className="mt-1 text-sm text-cream/70">{project.summary}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
