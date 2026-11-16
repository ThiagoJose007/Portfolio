"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { readFields, readTranslations } from "../_components/field-defs";
import { deleteTranslations, saveTranslations } from "@/lib/i18n/translations";
import { hashPassword } from "@/lib/project-access";
import { PROJECT_FIELDS } from "./fields";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function readProject(formData: FormData) {
  const data = readFields(PROJECT_FIELDS, formData);
  const tags = String(data.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  // Senha: só muda se uma nova for digitada ou se pedir para remover.
  const newPassword = String(formData.get("newPassword") ?? "").trim();
  const password = formData.get("removePassword") === "on" ? null : newPassword ? hashPassword(newPassword) : undefined;
  return { ...data, tags, ...(password !== undefined && { password }) } as unknown as Omit<
    Prisma.ProjectCreateInput,
    "slug"
  >;
}

export async function createProject(formData: FormData) {
  const data = readProject(formData);

  const project = await prisma.project.create({ data: { ...data, slug: slugify(data.title) } });
  await saveTranslations("project", project.id, readTranslations(PROJECT_FIELDS, formData));

  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function updateProject(projectId: string, formData: FormData) {
  await prisma.project.update({ where: { id: projectId }, data: readProject(formData) });
  await saveTranslations("project", projectId, readTranslations(PROJECT_FIELDS, formData));

  revalidatePath("/admin/projects");
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return;

  await prisma.project.delete({ where: { id: projectId } });
  await deleteTranslations("project", projectId);
  revalidatePath("/admin/projects");
}

export async function toggleProjectVisibility(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  const nextVisible = formData.get("nextVisible") === "true";
  if (!projectId) return;

  await prisma.project.update({
    where: { id: projectId },
    data: { visible: nextVisible },
  });

  revalidatePath("/admin/projects");
}
