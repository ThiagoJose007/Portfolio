"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { readFields } from "../_components/field-defs";
import { PROFILE_FIELDS } from "./fields";

// "LinkedIn | https://…" → { label, href }
function parseSocials(lines: string[]) {
  return lines.flatMap((line) => {
    const [label, ...rest] = line.split("|");
    const href = rest.join("|").trim();
    return label.trim() && href ? [{ label: label.trim(), href }] : [];
  });
}

export async function saveProfile(formData: FormData) {
  const { socials, ...data } = readFields(PROFILE_FIELDS, formData);
  const values = {
    ...data,
    socials: parseSocials(socials as string[]),
  } as unknown as Prisma.ProfileCreateInput;

  await prisma.profile.upsert({
    where: { id: "main" },
    create: { ...values, id: "main" },
    update: values,
  });

  revalidatePath("/", "layout");
  redirect("/admin/perfil?salvo=1");
}
