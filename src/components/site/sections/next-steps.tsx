"use client";

import { useRef } from "react";
import { useReveal } from "@/animations/use-reveal";
import { Eyebrow } from "../accent";
import { useSiteContent } from "../content-context";
import { TransitionLink } from "../transition/transition-link";
import { useSitePaths } from "../version-path";

// Ponte no fim da página inicial: para quem quer ir além dos projetos.
export function NextSteps() {
  const { profile } = useSiteContent();
  const { about, experience } = useSitePaths();
  const rootRef = useRef<HTMLElement>(null);
  useReveal(rootRef);

  const cards = [
    { href: about, eyebrow: "Quem sou", title: "Sobre mim", text: "Como penso, como trabalho e as ferramentas que uso." },
    {
      href: experience,
      eyebrow: "Trajetória",
      title: "Experiência",
      text: "Empresas, cargos e o que entreguei em cada uma.",
    },
  ];

  const cardClass =
    "group flex h-full flex-col justify-between gap-10 rounded-[28px] border border-cream/12 bg-cream/[0.03] p-7 transition-colors hover:border-cream/40 md:p-9";

  return (
    <section ref={rootRef} className="relative px-5 pb-[10vh] md:px-8">
      <Eyebrow>Continue</Eyebrow>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <TransitionLink key={card.href} href={card.href} data-reveal className={cardClass}>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{card.eyebrow}</span>
            <span>
              <span className="flex items-center justify-between text-3xl font-medium tracking-tight">
                {card.title}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
              <span className="mt-2 block text-cream/65">{card.text}</span>
            </span>
          </TransitionLink>
        ))}
        {profile.cvUrl ? (
          <a href={profile.cvUrl} target="_blank" rel="noreferrer" data-reveal className={`${cardClass} border-accent/40`}>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">PDF</span>
            <span>
              <span className="flex items-center justify-between text-3xl font-medium tracking-tight">
                Currículo
                <span aria-hidden className="transition-transform group-hover:translate-y-1">
                  ↓
                </span>
              </span>
              <span className="mt-2 block text-cream/65">Tudo em uma página, para guardar ou encaminhar.</span>
            </span>
          </a>
        ) : (
          <TransitionLink href="#contato" data-reveal className={cardClass}>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Vamos conversar</span>
            <span className="flex items-center justify-between text-3xl font-medium tracking-tight">
              Contato <span aria-hidden>↓</span>
            </span>
          </TransitionLink>
        )}
      </div>
    </section>
  );
}
