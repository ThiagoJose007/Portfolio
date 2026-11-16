// Idiomas do site. O inglês é o idioma principal (os campos das tabelas
// guardam o inglês); o português fica na tabela `translations`.

export const LOCALES = ["en", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
// Escolha do visitante (seletor EN/PT do menu ou ?lang=).
export const LOCALE_COOKIE = "lang";
// Idioma resolvido pelo proxy para esta requisição.
export const LOCALE_HEADER = "x-site-locale";

export const isLocale = (value: unknown): value is Locale => value === "en" || value === "pt";

export const HTML_LANG: Record<Locale, string> = { en: "en", pt: "pt-BR" };

// Primeiros segmentos que pertencem à versão geral (não são slug de candidatura).
export const GENERAL_SEGMENTS = new Set(["", "sobre", "experiencia", "projetos", "links"]);
