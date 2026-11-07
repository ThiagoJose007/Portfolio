"use client";

import { useRef } from "react";
import { career } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { usePinnedSteps } from "@/animations/use-pinned-steps";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { setScene } from "../scene/scene-store";

// Storytelling da carreira (referência: storytelling.noomoagency.com): a seção
// fica fixa, o objeto 3D muda de forma a cada capítulo e o texto ao lado troca.
export function CareerSection({ index }: { index?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { chapters } = career;

  useSplitReveal(titleRef, { by: "words" });

  usePinnedSteps(rootRef, {
    count: chapters.length,
    stepLength: 90,
    onProgress: (progress, q) => gsap.set(q("[data-career-progress]"), { scaleX: progress }),
    onActive: (i) =>
      setScene({ shape: chapters[i].shape, x: -0.3, y: -0.16, scale: 0.72, noise: 0.25 }),
    onStep: (i, prev, q) => {
      const pinned = window.matchMedia("(min-width: 768px)").matches;
      const items = q("[data-chapter]");
      q("[data-chapter-dot]").forEach((dot, j) => dot.classList.toggle("is-active", j <= i));
      gsap.to(q("[data-career-count]"), {
        duration: 0.7,
        scrambleText: { text: String(i + 1).padStart(2, "0"), chars: "0123456789" },
      });

      if (!pinned) {
        gsap.set(items, { autoAlpha: 1, y: 0, filter: "none" });
        return;
      }
      if (prev >= 0) {
        gsap.to(items[prev], {
          autoAlpha: 0,
          y: -50,
          filter: "blur(10px)",
          duration: 0.6,
          overwrite: true,
        });
      }
      gsap.set(items, { autoAlpha: (j: number) => (j === i || j === prev ? 1 : 0) });
      gsap.fromTo(
        items[i],
        { autoAlpha: 0, y: 50, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.15, overwrite: true },
      );
    },
  });

  return (
    <div>
      <section id="carreira" ref={rootRef} className="relative overflow-hidden px-5 py-24 md:h-svh md:px-8 md:py-0">
        <div className="relative z-10 text-center md:pt-[11vh]">
          <div className="flex justify-center">
            <Eyebrow index={index}>{career.label}</Eyebrow>
          </div>
          <h2
            ref={titleRef}
            className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.2vw,4.4rem)] font-medium leading-[1] tracking-[-0.03em]"
          >
            <Accent text={career.title} />
          </h2>
        </div>

        {/* Contador grande à esquerda */}
        <div className="absolute bottom-[12vh] left-8 hidden md:block">
          <p className="font-serif text-[9rem] italic leading-none">
            <span data-career-count>01</span>
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            capítulo / {String(chapters.length).padStart(2, "0")}
          </p>
        </div>

        <div className="relative mt-14 space-y-16 md:absolute md:right-[7vw] md:top-1/2 md:mt-0 md:h-[44vh] md:w-[min(36vw,560px)] md:-translate-y-[30%] md:space-y-0">
          {chapters.map((chapter, i) => (
            <article key={i} data-step data-chapter className="md:absolute md:inset-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">{chapter.period}</span> · {chapter.role} · {chapter.place}
              </p>
              <h3 className="mt-5 text-[clamp(2rem,3.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.03em]">
                <Accent text={chapter.title} />
              </h3>
              <span className="my-7 block h-px w-full bg-gradient-to-r from-cream/40 to-transparent" />
              <p className="max-w-md text-lg leading-relaxed text-cream/75">{chapter.text}</p>
            </article>
          ))}
        </div>

        {/* Linha do tempo */}
        <div className="absolute bottom-8 left-8 right-40 hidden md:block">
          <div className="relative h-px bg-cream/15">
            <span data-career-progress className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </div>
          <ol className="mt-4 flex justify-between">
            {chapters.map((chapter, i) => (
              <li
                key={i}
                data-chapter-dot
                className="chapter-dot flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
              >
                <span className="size-1.5 rounded-full bg-current" />
                {chapter.period}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
