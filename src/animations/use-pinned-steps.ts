"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useAlive } from "./use-alive";

// Seletor restrito à seção (gsap.utils.selector).
type Query = (selector: string) => HTMLElement[];

type PinnedStepsOptions = {
  count: number;
  // Chamado quando o passo visível muda (anima o DOM). `prev` é -1 na primeira vez.
  onStep: (index: number, prev: number, q: Query) => void;
  // Chamado sempre que a seção está ativa e o passo muda, inclusive ao
  // (re)entrar na seção — usado para sincronizar a cena 3D.
  onActive?: (index: number) => void;
  // Progresso contínuo (0..1) do trecho fixado — ex.: a barra lateral.
  onProgress?: (progress: number, q: Query) => void;
  // Quanto scroll (em % da altura da tela) cada passo consome.
  stepLength?: number;
};

// Seção "storytelling": no desktop ela fica fixa (pin) e o scroll avança
// pelos passos; no mobile cada `[data-step]` vira um gatilho próprio no fluxo
// normal da página.
export function usePinnedSteps(
  ref: RefObject<HTMLElement | null>,
  { count, onStep, onActive, onProgress, stepLength = 80 }: PinnedStepsOptions,
) {
  const alive = useAlive();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || count === 0) return;
      const q: Query = gsap.utils.selector(el);
      // Sem contextSafe de propósito: chamar uma função contextSafe dentro do
      // mm.add() faz os dois contextos se referenciarem e o revert entra em
      // recursão infinita. Tweens criados dentro do mm.add() já são revertidos
      // pelo próprio matchMedia.
      const mm = gsap.matchMedia();
      let current = -1;
      let active = false;
      const go = (index: number) => {
        if (!alive.current || index === current) return;
        const prev = current;
        current = index;
        onStep(index, prev, q);
        if (active) onActive?.(index);
      };
      const setActive = (value: boolean) => {
        if (!alive.current) return;
        active = value;
        if (value) onActive?.(Math.max(current, 0));
      };

      mm.add("(min-width: 768px)", () => {
        current = -1;
        go(0);
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => `+=${count * stepLength}%`,
          pin: true,
          onToggle: (self) => setActive(self.isActive),
          onUpdate: (self) => {
            if (!alive.current) return;
            onProgress?.(self.progress, q);
            go(Math.min(count - 1, Math.floor(self.progress * count)));
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        current = -1;
        go(0);
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => setActive(self.isActive),
        });
        gsap.utils.toArray<HTMLElement>("[data-step]", el).forEach((stepEl, i) => {
          ScrollTrigger.create({
            trigger: stepEl,
            start: "top 65%",
            end: "bottom 35%",
            onToggle: (self) => self.isActive && go(i),
          });
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );
}
