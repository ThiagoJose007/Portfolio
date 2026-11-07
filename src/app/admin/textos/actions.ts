"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TEXT_FIELDS } from "@/lib/content/texts";

// Grava todas as chaves do formulário. Os textos podem ficar vazios de
// propósito (ex.: esconder o último capítulo da carreira).
export async function saveTexts(formData: FormData) {
  const entries = TEXT_FIELDS.filter((field) => formData.has(field.key)).map((field) => {
    const raw = String(formData.get(field.key) ?? "").replace(/\r\n/g, "\n");
    return { key: field.key, value: field.multiline || field.list ? raw.trim() : raw.trim().replace(/\s+/g, " ") };
  });

  await prisma.$transaction(
    entries.map(({ key, value }) =>
      prisma.siteText.upsert({ where: { key }, create: { key, value }, update: { value } }),
    ),
  );

  revalidatePath("/", "layout");
  redirect("/admin/textos?salvo=1");
}
