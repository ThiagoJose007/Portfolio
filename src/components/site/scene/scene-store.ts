"use client";

import { gsap } from "@/lib/gsap";
import type { SceneShape } from "@/content/site";

// Estado "vivo" lido a cada frame pelo render loop do three.js.
// As seções não falam com o three.js diretamente: elas só pedem um novo
// estado e o GSAP interpola os valores até lá.
export type SceneState = {
  shape: number; // 0..4, valores intermediários = morph entre formas
  x: number; // deslocamento horizontal em frações da metade da viewport (-1..1)
  y: number;
  scale: number;
  noise: number; // amplitude da distorção por ruído
  spin: number; // velocidade de rotação (rad/s)
  opacity: number;
};

export type SceneTarget = Partial<Omit<SceneState, "shape">> & {
  shape?: SceneShape;
};

export const DEFAULT_SCENE: SceneState = {
  shape: 0,
  x: 0,
  y: 0,
  scale: 1,
  noise: 0.35,
  spin: 0.12,
  opacity: 1,
};

export const sceneState: SceneState = { ...DEFAULT_SCENE };

export function setScene(target: SceneTarget, duration = 1.8) {
  gsap.to(sceneState, {
    ...DEFAULT_SCENE,
    ...target,
    duration,
    ease: "power3.inOut",
    overwrite: "auto",
  });
}
