"use client";

import { useEffect, useRef } from "react";
import { useSiteContent } from "../content-context";
import { createParticleScene } from "./create-scene";

export function ParticleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { initials } = useSiteContent().profile;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      return createParticleScene(canvas, initials);
    } catch (error) {
      // Sem WebGL o site continua funcionando, só sem o objeto 3D.
      console.warn("WebGL indisponível, cena 3D desativada.", error);
    }
  }, [initials]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
