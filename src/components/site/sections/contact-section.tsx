"use client";

import { useRef } from "react";
import { contact, profile } from "@/content/site";
import { useMagnetic } from "@/animations/use-magnetic";
import { useReveal } from "@/animations/use-reveal";
import { useSplitReveal } from "@/animations/use-split-reveal";
import { Accent, Eyebrow } from "../accent";
import { useSceneSection } from "../scene/use-scene-section";
import { SectionCurve } from "../section-curve";
import { scrollToTarget } from "../transition/navigation";

export function ContactSection({
  index,
  afterLight = false,
  text = contact.text,
}: {
  index?: string;
  // Desenha a curva escura sobre a seção clara anterior (depoimentos).
  afterLight?: boolean;
  text?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useSceneSection(rootRef, { shape: 4, x: 0.52, y: -0.1, scale: 0.85, noise: 0.15 });
  useSplitReveal(titleRef, { by: "chars" });
  useReveal(rootRef);
  useMagnetic(buttonRef, 0.4);

  return (
    <section
      id="contato"
      ref={rootRef}
      className="relative flex min-h-svh flex-col justify-between px-5 pb-8 pt-[18vh] md:px-8"
    >
      {afterLight && <SectionCurve className="fill-ink" />}

      <div>
        <Eyebrow index={index}>{contact.label}</Eyebrow>
        <h2
          ref={titleRef}
          className="mt-6 max-w-[12ch] text-[clamp(3rem,9vw,10rem)] font-medium leading-[0.9] tracking-[-0.045em]"
        >
          <Accent text={contact.title} />
        </h2>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
          <a
            ref={buttonRef}
            href={`mailto:${profile.email}`}
            data-reveal
            className="grid size-40 shrink-0 place-items-center rounded-full bg-accent text-center text-lg font-medium text-ink md:size-52"
          >
            {contact.cta} ↗
          </a>
          <div data-reveal className="max-w-md">
            <p className="whitespace-pre-line text-lg text-cream/75">{text}</p>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-4 inline-block text-2xl tracking-tight md:text-3xl"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-24 grid gap-8 border-t border-cream/15 pb-24 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted md:grid-cols-4 md:pb-0 md:pr-32">
        <ul className="flex gap-5">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="link-underline text-cream">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <p>{profile.location}</p>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <button
          type="button"
          onClick={() => scrollToTarget(0)}
          className="link-underline justify-self-start uppercase text-cream md:justify-self-end"
        >
          Voltar ao topo ↑
        </button>
      </footer>
    </section>
  );
}
