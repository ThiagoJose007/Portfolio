"use server";

import { prisma } from "@/lib/prisma";
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

function readTags(formData: FormData) {
  const raw = String(formData.get("tags") ?? "");
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createProject(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const repoUrl = String(formData.get("repoUrl") ?? "").trim() || null;
  const liveUrl = String(formData.get("liveUrl") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  const tags = readTags(formData);

  if (!title || !summary || !description) {
    throw new Error("Título, resumo e descrição são obrigatórios.");
  }

  await prisma.project.create({
    data: {
      title,
      slug: slugify(title),
      summary,
      description,
      coverImage,
      repoUrl,
      liveUrl,
      visible,
      tags,
    },
  });

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(projectId: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const repoUrl = String(formData.get("repoUrl") ?? "").trim() || null;
  const liveUrl = String(formData.get("liveUrl") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  const tags = readTags(formData);

  if (!title || !summary || !description) {
    throw new Error("Título, resumo e descrição são obrigatórios.");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      title,
      summary,
      description,
      coverImage,
      repoUrl,
      liveUrl,
      visible,
      tags,
    },
  });

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return;

  await prisma.project.delete({ where: { id: projectId } });
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
