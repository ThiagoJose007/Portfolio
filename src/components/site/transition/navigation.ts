"use client";

import { ScrollSmoother } from "@/lib/gsap";

// Ponte entre os links do site e o overlay de transição (PageTransition).
// Mantido fora do React para que qualquer componente possa disparar uma
// navegação animada sem precisar de context.

type Navigator = (href: string) => void;

let navigator: Navigator | null = null;
let revealed = false;
let queue: Array<() => void> = [];

export function registerNavigator(fn: Navigator) {
  navigator = fn;
  return () => {
    if (navigator === fn) navigator = null;
  };
}

export function navigate(href: string) {
  if (!navigator) return false;
  navigator(href);
  return true;
}

// A página fica "coberta" pelo overlay durante o carregamento inicial e nas
// trocas de rota. Animações de entrada esperam a revelação para começar.
export function setRevealed(value: boolean) {
  revealed = value;
  if (!value) return;
  const pending = queue;
  queue = [];
  pending.forEach((fn) => fn());
}

export function afterReveal(fn: () => void) {
  if (revealed) {
    fn();
    return () => {};
  }
  queue.push(fn);
  return () => {
    queue = queue.filter((item) => item !== fn);
  };
}

export function scrollToTarget(target: string | number, smooth = true) {
  const smoother = ScrollSmoother.get();
  if (typeof target === "string" && !document.querySelector(target)) return;
  if (smoother) {
    smoother.scrollTo(target, smooth, "top top");
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }
}

export const MENU_CLOSE_EVENT = "site:menu-close";
