"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import type { ShowcaseProject } from "@/lib/projects";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import { ProjectCover } from "./project-cover";

// Painel lateral com os detalhes do projeto. Vai para o <body> via portal:
// dentro do #smooth-content (que usa transform) `position: fixed` não funciona.
export function ProjectModal({
  project,
  onClose,
}: {
  project: ShowcaseProject;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(() => {});

  useGSAP(
    (_, contextSafe) => {
      ScrollSmoother.get()?.paused(true);
      gsap
        .timeline()
        .from("[data-modal-backdrop]", { autoAlpha: 0, duration: 0.5 })
        .from("[data-modal-panel]", { xPercent: 100, duration: 0.9 }, 0)
        .from("[data-modal-item]", { y: 40, autoAlpha: 0, stagger: 0.06, duration: 0.9 }, 0.25);
      rootRef.current?.querySelector<HTMLElement>("[data-modal-close]")?.focus();

      let closing = false;
      const close = contextSafe!(() => {
        if (closing) return;
        closing = true;
        gsap
          .timeline({ onComplete: onClose })
          .to("[data-modal-panel]", { xPercent: 100, duration: 0.6, ease: "power3.in" })
          .to("[data-modal-backdrop]", { autoAlpha: 0, duration: 0.4 }, 0.15);
      });
      closeRef.current = close;
      const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        ScrollSmoother.get()?.paused(false);
      };
    },
    { scope: rootRef },
  );

  const close = () => closeRef.current();

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="site-root fixed inset-0 z-[55] flex justify-end"
    >
      <div data-modal-backdrop className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
      <div
        data-modal-panel
        className="relative h-full w-full max-w-2xl overflow-y-auto overscroll-contain bg-[#141417] p-6 md:p-10"
      >
        <div className="flex items-start justify-between gap-6" data-modal-item>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {project.tags.join(" · ") || "Projeto"}
          </p>
          <button
            type="button"
            data-modal-close
            onClick={close}
            className="rounded-full border border-cream/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-cream"
          >
            Fechar
          </button>
        </div>

        <h2
          id="project-modal-title"
          data-modal-item
          className="mt-8 text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          {project.title}
        </h2>
        <p data-modal-item className="mt-5 text-lg text-cream/70">
          {project.summary}
        </p>

        <div data-modal-item className="mt-10 aspect-[4/3] overflow-hidden rounded-2xl">
          <ProjectCover project={project} />
        </div>

        <p data-modal-item className="mt-10 whitespace-pre-line text-base leading-relaxed text-cream/85">
          {project.description}
        </p>

        {project.gallery.length > 0 && (
          <div data-modal-item className="mt-10 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element -- URLs externas cadastradas no admin
              <img key={src} src={src} alt="" className="w-full rounded-xl object-cover" />
            ))}
          </div>
        )}

        {(project.liveUrl || project.repoUrl) && (
          <div data-modal-item className="mt-10 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
              >
                Ver projeto ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-cream/30 px-6 py-3 text-sm transition-colors hover:border-cream"
              >
                Repositório ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
