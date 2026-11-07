"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/content/types";

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
