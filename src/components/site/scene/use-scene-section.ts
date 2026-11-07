"use client";

import type { RefObject } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setScene, type SceneTarget } from "./scene-store";

// Quando a seção ocupa o centro da tela, a cena 3D assume o estado pedido.
// Funciona nos dois sentidos do scroll (onToggle cobre enter e enterBack).
export function useSceneSection(
  ref: RefObject<HTMLElement | null>,
  target: SceneTarget,
  { start = "top 55%", end = "bottom 45%" }: { start?: string; end?: string } = {},
) {
  useGSAP(
    () => {
      if (!ref.current) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        end,
        onToggle: (self) => self.isActive && setScene(target),
      });
    },
    { scope: ref },
  );
}
