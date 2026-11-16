"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/content/types";
import { UI } from "@/lib/i18n/ui";

// O conteúdo editável é carregado no servidor (layout do site) e chega aos
// componentes client por aqui.
const SiteContentContext = createContext<SiteContent | null>(null);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const content = useContext(SiteContentContext);
  if (!content) throw new Error("useSiteContent precisa estar dentro de <SiteContentProvider>.");
  return content;
}

// Textos fixos da interface no idioma da página.
export function useUi() {
  return UI[useSiteContent().locale];
}
