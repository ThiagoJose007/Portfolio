"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildApplicationSlug(companyName: string) {
  const token = randomBytes(4).toString("hex");
  return `${slugify(companyName)}-${token}`;
}

export async function createApplication(formData: FormData) {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  const introText = String(formData.get("introText") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "").trim() || null;

  if (!companyName || !roleTitle || !introText) {
    throw new Error("Empresa, vaga e texto de introdução são obrigatórios.");
  }

  const application = await prisma.application.create({
    data: {
      companyName,
      roleTitle,
      introText,
      ctaText,
      slug: buildApplicationSlug(companyName),
    },
  });

  revalidatePath("/admin/applications");
  redirect(`/admin/applications/${application.id}`);
}

export async function updateApplication(applicationId: string, formData: FormData) {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  const introText = String(formData.get("introText") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT") as
    | "DRAFT"
    | "SENT"
    | "VIEWED"
    | "ARCHIVED";

  const expiresRaw = String(formData.get("expiresAt") ?? "").trim();
  // Data sem hora: o link vale até o fim do dia escolhido.
  const expiresAt = expiresRaw ? new Date(`${expiresRaw}T23:59:59`) : null;

  const current = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!current) return;
  if (!current.isDefault && (!companyName || !roleTitle || !introText)) {
    throw new Error("Empresa, vaga e texto de introdução são obrigatórios.");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: current.isDefault
      ? { introText, ctaText }
      : { companyName, roleTitle, introText, ctaText, status, expiresAt },
  });

  refresh(applicationId);
}

const refresh = (applicationId: string) => {
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  revalidatePath("/", "layout");
};

// Cria a candidatura especial que define o que aparece em "/".
export async function createDefaultVersion() {
  const existing = await prisma.application.findFirst({ where: { isDefault: true } });
  const application =
    existing ??
    (await prisma.application.create({
      data: {
        companyName: "Versão geral",
        roleTitle: "",
        introText: "",
        isDefault: true,
        slug: buildApplicationSlug("geral"),
      },
    }));
  revalidatePath("/admin/applications");
  redirect(`/admin/applications/${application.id}`);
}

export async function addExperienceToApplication(applicationId: string, formData: FormData) {
  const experienceId = String(formData.get("experienceId") ?? "");
  if (!experienceId) return;
  const order = await prisma.applicationExperience.count({ where: { applicationId } });
  await prisma.applicationExperience.create({ data: { applicationId, experienceId, order } });
  refresh(applicationId);
}

export async function removeExperienceFromApplication(formData: FormData) {
  const id = String(formData.get("applicationExperienceId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!id) return;
  await prisma.applicationExperience.delete({ where: { id } });
  refresh(applicationId);
}

export async function updateApplicationExperience(formData: FormData) {
  const id = String(formData.get("applicationExperienceId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!id) return;
  const highlights = String(formData.get("customHighlights") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  await prisma.applicationExperience.update({
    where: { id },
    data: {
      order: Number(formData.get("order") ?? 0),
      customSummary: String(formData.get("customSummary") ?? "").trim() || null,
      customHighlights: highlights.length > 0 ? highlights : Prisma.DbNull,
    },
  });
  refresh(applicationId);
}

export async function deleteApplication(formData: FormData) {
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationId) return;

  await prisma.application.delete({ where: { id: applicationId } });
  revalidatePath("/admin/applications");
  redirect("/admin/applications");
}

export async function addProjectToApplication(
  applicationId: string,
  formData: FormData,
) {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return;

  const currentCount = await prisma.applicationProject.count({
    where: { applicationId },
  });

  await prisma.applicationProject.create({
    data: {
      applicationId,
      projectId,
      order: currentCount,
    },
  });

  refresh(applicationId);
}

export async function removeProjectFromApplication(formData: FormData) {
  const applicationProjectId = String(formData.get("applicationProjectId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationProjectId) return;

  await prisma.applicationProject.delete({ where: { id: applicationProjectId } });
  refresh(applicationId);
}

export async function updateApplicationProject(formData: FormData) {
  const applicationProjectId = String(formData.get("applicationProjectId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  const order = Number(formData.get("order") ?? 0);
  const highlighted = formData.get("highlighted") === "on";
  const customDescription =
    String(formData.get("customDescription") ?? "").trim() || null;

  if (!applicationProjectId) return;

  await prisma.applicationProject.update({
    where: { id: applicationProjectId },
    data: { order, highlighted, customDescription },
  });

  refresh(applicationId);
}
