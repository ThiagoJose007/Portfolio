"use client";

import { usePathname } from "next/navigation";

// Segmentos que pertencem à versão geral. Qualquer outro primeiro segmento é
// o slug de uma candidatura ("/edge-k7x2q/sobre" → base "/edge-k7x2q").
const GENERAL_SEGMENTS = new Set(["", "sobre", "experiencia", "projetos"]);

export function basePathOf(pathname: string) {
  const segment = pathname.split("/")[1] ?? "";
  return GENERAL_SEGMENTS.has(segment) ? "" : `/${segment}`;
}

export function sitePaths(base: string) {
  return {
    home: base || "/",
    about: `${base}/sobre`,
    experience: `${base}/experiencia`,
    project: (slug: string) => `${base}/projetos/${slug}`,
  };
}

export function useSitePaths() {
  const pathname = usePathname();
  const base = basePathOf(pathname);
  return { pathname, base, ...sitePaths(base) };
}

// Nome da página atual (anel do menu, overlay de transição).
export function pageLabel(pathname: string) {
  const rest = pathname.slice(basePathOf(pathname).length) || "/";
  if (rest.startsWith("/sobre")) return "Sobre mim";
  if (rest.startsWith("/experiencia")) return "Experiência";
  if (rest.startsWith("/projetos/")) return "Projeto";
  return "Início";
}
