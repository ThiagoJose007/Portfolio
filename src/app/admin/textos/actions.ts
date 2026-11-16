"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TEXT_FIELDS } from "@/lib/content/texts";

const PT = "__pt";

const clean = (raw: FormDataEntryValue | null, multiline: boolean) => {
  const value = String(raw ?? "").replace(/\r\n/g, "\n");
  return multiline ? value.trim() : value.trim().replace(/\s+/g, " ");
};

// Grava os textos em inglês (site_texts) e em português (translations).
// Os textos podem ficar vazios de propósito (ex.: esconder o último capítulo).
export async function saveTexts(formData: FormData) {
  const fields = TEXT_FIELDS.filter((field) => formData.has(field.key));

  await prisma.$transaction(
    fields.flatMap((field) => {
      const multiline = !!(field.multiline || field.list);
      const en = clean(formData.get(field.key), multiline);
      const pt = clean(formData.get(field.key + PT), multiline);
      const where = { entity_entityId_field_locale: { entity: "text", entityId: field.key, field: "value", locale: "pt" } };
      return [
        prisma.siteText.upsert({ where: { key: field.key }, create: { key: field.key, value: en }, update: { value: en } }),
        prisma.translation.upsert({
          where,
          create: { entity: "text", entityId: field.key, field: "value", locale: "pt", value: pt },
          update: { value: pt },
        }),
      ];
    }),
  );

  revalidatePath("/", "layout");
  redirect("/admin/textos?salvo=1");
}
