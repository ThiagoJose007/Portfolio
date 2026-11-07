"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePinnedSteps } from "@/animations/use-pinned-steps";
import { Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { setScene } from "../scene/scene-store";

// Pontos em volta do objeto 3D onde as stacks aparecem como "anotações"
// (referência: vaulk.com). Em % da área da seção.
const ANCHORS = [
  { x: "33%", y: "31%" },
  { x: "61%", y: "22%" },
  { x: "68%", y: "46%" },
  { x: "26%", y: "52%" },
  { x: "60%", y: "66%" },
  { x: "36%", y: "70%" },
];

export function SkillsSection({ index }: { index?: string }) {
  const { skills: content } = useSiteContent();
  const skills = content.groups;
  const rootRef = useRef<HTMLElement>(null);

  usePinnedSteps(rootRef, {
    count: skills.length,
    stepLength: 70,
    onProgress: (progress, q) => {
      gsap.set(q("[data-skills-fill]"), { scaleY: Math.max(progress, 1 / skills.length) });
    },
    onActive: (i) =>
      setScene({ shape: 2, y: 0.06, scale: 0.72, noise: 0.08 + i * 0.04, spin: 0.2 }),
    onStep: (i, prev, q) => {
      q("[data-skill-item]").forEach((item, j) => item.classList.toggle("is-active", j === i));
      gsap.to(q("[data-skills-count]"), {
        duration: 0.6,
        scrambleText: { text: String(i + 1).padStart(2, "0"), chars: "0123456789" },
      });

      const panels = q("[data-skill-panel]");
      const next = panels[i];
      // No mobile os painéis ficam empilhados no fluxo: só anima a entrada.
      const pinned = window.matchMedia("(min-width: 768px)").matches;
      if (!pinned) gsap.set(panels, { autoAlpha: 1 });
      if (pinned && prev >= 0) {
        const old = panels[prev];
        gsap.to(old.querySelectorAll("[data-chip]"), {
          autoAlpha: 0,
          scale: 0.9,
          duration: 0.35,
          stagger: 0.03,
          overwrite: true,
        });
        gsap.to(old.querySelector("[data-headline]"), {
          autoAlpha: 0,
          y: -30,
          filter: "blur(8px)",
          duration: 0.5,
          overwrite: true,
        });
      }
      if (pinned) gsap.set(panels, { autoAlpha: (j: number) => (j === i || j === prev ? 1 : 0) });
      gsap.fromTo(
        next.querySelectorAll("[data-chip]"),
        { autoAlpha: 0, scale: 0.9 },
        { autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.07, delay: 0.15, overwrite: true },
      );
      next.querySelectorAll<HTMLElement>("[data-chip-text]").forEach((chip, j) => {
        gsap.to(chip, {
          duration: 0.9,
          delay: 0.15 + j * 0.07,
          scrambleText: { text: chip.dataset.label ?? "", chars: "upperCase", speed: 0.6 },
        });
      });
      gsap.fromTo(
        next.querySelector("[data-headline]"),
        { autoAlpha: 0, y: 30, filter: "blur(8px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9, delay: 0.1, overwrite: true },
      );
    },
  });

  return (
    <div>
      <section
        id="habilidades"
        ref={rootRef}
        className="bg-grid relative overflow-hidden px-5 py-24 md:h-svh md:px-8 md:py-0"
      >
        <div className="relative z-10 flex items-start justify-between md:absolute md:inset-x-8 md:top-[12vh]">
          <div>
            <Eyebrow index={index}>{content.label}</Eyebrow>
            <h2 className="mt-4 max-w-md text-3xl font-medium tracking-tight md:text-4xl">
              {content.title}
            </h2>
          </div>
          <p className="hidden font-mono text-xs tracking-[0.2em] text-muted md:block">
            <span data-skills-count className="text-cream">
              01
            </span>{" "}
            / {String(skills.length).padStart(2, "0")}
          </p>
        </div>

        {/* Indicador lateral (referência: GSAP lateral pin indicator) */}
        <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 md:block">
          <span className="absolute left-0 top-0 h-full w-px bg-cream/15" />
          <span data-skills-fill className="absolute left-0 top-0 h-full w-px origin-top bg-accent" />
          <ul className="space-y-6 pl-5">
            {skills.map((group, i) => (
              <li
                key={group.id}
                data-skill-item
                className="skill-item font-mono text-[11px] uppercase leading-tight tracking-[0.18em]"
              >
                <span className="block opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {group.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-12 md:absolute md:inset-0 md:mt-0">
          {skills.map((group, i) => (
            <div
              key={group.id}
              data-step
              data-skill-panel
              className="relative mb-16 md:absolute md:inset-0 md:mb-0"
            >
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent md:hidden">
                {String(i + 1).padStart(2, "0")} · {group.label}
              </p>
              <p
                data-headline
                className="mx-auto max-w-3xl text-2xl font-medium leading-tight tracking-tight md:absolute md:inset-x-0 md:bottom-[11vh] md:text-center md:text-[clamp(1.6rem,2.8vw,2.8rem)]"
              >
                {group.headline}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 md:contents">
                {group.stacks.map((stack, j) => (
                  <li
                    key={stack}
                    data-chip
                    className="flex items-center gap-2 border border-cream/25 bg-ink/70 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] backdrop-blur md:absolute md:left-[var(--x)] md:top-[var(--y)]"
                    style={{ "--x": ANCHORS[j % ANCHORS.length].x, "--y": ANCHORS[j % ANCHORS.length].y } as React.CSSProperties}
                  >
                    <span className="grid size-3 place-items-center border border-accent text-[7px] leading-none text-accent">
                      ×
                    </span>
                    <span data-chip-text data-label={stack.toUpperCase()}>
                      {stack.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
