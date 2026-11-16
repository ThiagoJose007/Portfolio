import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "./config";

// Campos com versão em português, por entidade. O valor da tabela é o inglês;
// o português fica em `translations` (entity, entityId, field, locale).
export const TRANSLATABLE: Record<string, readonly string[]> = {
  profile: ["role", "availability", "bio", "tldrCareer", "tldrBasedIn", "tldrSkillset", "tldrExperience", "tldrLanguages", "linksBio"],
  experience: ["company", "role", "location", "headline", "summary", "highlights"],
  education: ["course", "institution", "description"],
  skillGroup: ["label", "headline", "stacks"],
  stat: ["label"],
  processStep: ["title", "text"],
  aboutItem: ["title", "text"],
  award: ["title", "issuer", "project"],
  testimonial: ["quote", "role"],
  project: ["title", "summary", "description", "role", "client", "problem", "process", "outcome"],
  linkItem: ["title", "description"],
};

// Campos que são listas (Json string[]); a tradução guarda uma linha por item.
const LIST_FIELDS = new Set(["highlights", "stacks"]);

export const isTranslatable = (entity: string, field: string) => TRANSLATABLE[entity]?.includes(field) ?? false;

const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

type TranslationMap = Map<string, string>;
const keyOf = (entity: string, entityId: string, field: string) => `${entity}|${entityId}|${field}`;

// Todas as traduções de um idioma, uma consulta por requisição.
export const loadTranslationMap = cache(async (locale: Locale): Promise<TranslationMap> => {
  if (locale === "en") return new Map();
  const rows = await prisma.translation.findMany({ where: { locale } });
  return new Map(rows.map((row) => [keyOf(row.entity, row.entityId, row.field), row.value]));
});

// Cópia da linha com os campos traduzidos (os que não têm tradução ficam em inglês).
export function localize<T extends { id: string }>(entity: string, row: T, map: TranslationMap): T {
  if (map.size === 0) return row;
  const copy: Record<string, unknown> = { ...row };
  for (const field of TRANSLATABLE[entity] ?? []) {
    const value = map.get(keyOf(entity, row.id, field));
    if (value?.trim()) copy[field] = LIST_FIELDS.has(field) ? lines(value) : value;
  }
  return copy as T;
}

export function translatedText(map: TranslationMap, key: string) {
  return map.get(keyOf("text", key, "value"));
}

// Valores em português de um registro, para preencher os formulários do admin.
export async function getTranslations(entity: string, entityId: string): Promise<Record<string, string>> {
  const rows = await prisma.translation.findMany({ where: { entity, entityId, locale: "pt" } });
  return Object.fromEntries(rows.map((row) => [row.field, row.value]));
}

// Grava as traduções (português). Campo vazio apaga a tradução.
export async function saveTranslations(entity: string, entityId: string, values: Record<string, string>) {
  await prisma.$transaction(
    Object.entries(values).map(([field, raw]) => {
      const value = LIST_FIELDS.has(field) ? lines(raw).join("\n") : raw.trim();
      const where = { entity_entityId_field_locale: { entity, entityId, field, locale: "pt" } };
      return value
        ? prisma.translation.upsert({ where, create: { entity, entityId, field, locale: "pt", value }, update: { value } })
        : prisma.translation.deleteMany({ where: { entity, entityId, field, locale: "pt" } });
    }),
  );
}

export async function deleteTranslations(entity: string, entityId: string) {
  await prisma.translation.deleteMany({ where: { entity, entityId } });
}
