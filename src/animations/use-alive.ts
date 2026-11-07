"use client";

import { useLayoutEffect, useRef } from "react";

// `alive.current` vira false antes do revert do useGSAP — desde que este hook
// seja chamado ANTES do useGSAP (cleanups rodam na ordem de declaração).
// Callbacks do ScrollTrigger checam isso para não animar nada enquanto a
// seção está sendo desmontada (desfazer um pin dispara callbacks, e criar
// tweens num contexto que está sendo revertido entra em loop).
export function useAlive() {
  const alive = useRef(true);
  useLayoutEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  return alive;
}
