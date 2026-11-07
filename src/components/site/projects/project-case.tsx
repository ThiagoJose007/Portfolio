"use client";

import { useRef } from "react";
import type { ShowcaseProject } from "@/lib/projects";
import { useReveal } from "@/animations/use-reveal";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Eyebrow } from "../accent";
import { useSceneSection } from "../scene/use-scene-section";
import { afterReveal } from "../transition/navigation";
import { TransitionLink } from "../transition/transition-link";
import { useSitePaths } from "../version-path";
import { ProjectCover } from "./project-cover";
import { gsap, useGSAP } from "@/lib/gsap";

// YouTube/Vimeo viram embed; arquivos de vídeo tocam direto.
function videoEmbed(url: string) {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (youtube) return { kind: "iframe" as const, src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe" as const, src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { kind: "video" as const, src: url };
}

// Estudo de caso: o que o entrevistador técnico quer ler — contexto,
// problema, processo/decisões e resultado — com imagens ao longo do texto.
export function ProjectCase({
  project,
  position,
  total,
  next,
}: {
  project: ShowcaseProject;
  position: number;
  total: number;
  next: ShowcaseProject | null;
}) {
  const { home, project: projectPath } = useSitePaths();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useSceneSection(rootRef, { shape: 2, x: 0.5, y: 0.1, scale: 1.2, opacity: 0.15, noise: 0.4 });
  useSplitReveal(titleRef, { by: "words", on: "reveal" });
  useReveal(rootRef);
  useGSAP(
    () => {
      const fades = gsap.utils.toArray<HTMLElement>("[data-case-fade]");
      const tween = gsap.from(fades, { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08, delay: 0.4, paused: true });
      return afterReveal(() => tween.play());
    },
    { scope: rootRef },
  );

  const meta = [
    { label: "Meu papel", value: project.role },
    { label: "Cliente", value: project.client },
    { label: "Ano", value: project.year },
    { label: "Stack", value: project.tags.join(", ") },
  ].filter((item) => item.value);

  const chapters = [
    { label: "Contexto", text: project.description },
    { label: "Problema", text: project.problem },
    { label: "Processo e decisões", text: project.process },
    { label: "Resultado", text: project.outcome },
  ].filter((item): item is { label: string; text: string } => !!item.text?.trim());

  // As imagens da galeria se intercalam com os capítulos do texto.
  const gallery = [...project.gallery];
  const video = project.videoUrl ? videoEmbed(project.videoUrl) : null;

  return (
    <article ref={rootRef} className="relative px-5 pb-[12vh] pt-[22vh] md:px-8">
      <div data-case-fade className="flex items-center justify-between">
        <Eyebrow index={`${String(position).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}>Projeto</Eyebrow>
        <TransitionLink href={`${home}#projetos`} className="link-underline font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          ← Todos os projetos
        </TransitionLink>
      </div>

      <h1
        ref={titleRef}
        className="mt-6 max-w-[18ch] text-[clamp(2.8rem,7vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.04em]"
      >
        {project.title}
      </h1>
      <p data-case-fade className="mt-8 max-w-2xl text-xl leading-snug text-cream/75 md:text-2xl">
        {project.summary}
      </p>

      <div data-case-fade className="mt-12 grid gap-8 border-t border-cream/15 pt-6 md:grid-cols-[1fr_auto]">
        {meta.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{item.label}</dt>
                <dd className="mt-1.5 text-cream/90">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="flex flex-wrap items-start gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-accent"
            >
              Ver ao vivo ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cream/30 px-5 py-2.5 text-sm transition-colors hover:border-cream"
            >
              Repositório ↗
            </a>
          )}
        </div>
      </div>

      <div data-reveal className="mt-14 aspect-[16/9] overflow-hidden rounded-sm">
        <ProjectCover project={project} />
      </div>

      <div className="mt-[10vh] space-y-[10vh]">
        {chapters.map((chapter, i) => {
          const image = gallery.shift();
          return (
            <section key={chapter.label} className="space-y-[8vh]">
              <div data-reveal className="grid gap-6 md:grid-cols-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent md:col-span-3">
                  {String(i + 1).padStart(2, "0")} · {chapter.label}
                </p>
                <p className="whitespace-pre-line text-lg leading-relaxed text-cream/85 md:col-span-8 md:text-xl">
                  {chapter.text}
                </p>
              </div>
              {image && (
                // eslint-disable-next-line @next/next/no-img-element -- imagens enviadas pelo admin
                <img data-reveal src={image} alt="" className="w-full rounded-sm object-cover" />
              )}
            </section>
          );
        })}

        {video && (
          <div data-reveal className="aspect-video overflow-hidden rounded-sm bg-cream/5">
            {video.kind === "iframe" ? (
              <iframe
                src={video.src}
                title={`Vídeo — ${project.title}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            ) : (
              <video src={video.src} controls playsInline className="size-full object-cover" />
            )}
          </div>
        )}

        {gallery.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {gallery.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element -- imagens enviadas pelo admin
              <img key={src} data-reveal src={src} alt="" className="w-full rounded-sm object-cover" />
            ))}
          </div>
        )}
      </div>

      {next && (
        <TransitionLink
          href={projectPath(next.slug)}
          data-reveal
          className="group mt-[14vh] flex items-end justify-between gap-6 border-t border-cream/15 pt-8"
        >
          <span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Próximo projeto</span>
            <span className="mt-3 block text-[clamp(2rem,5vw,5rem)] font-medium leading-none tracking-[-0.035em]">
              {next.title}
            </span>
          </span>
          <span aria-hidden className="text-4xl transition-transform group-hover:translate-x-2">
            →
          </span>
        </TransitionLink>
      )}
    </article>
  );
}
