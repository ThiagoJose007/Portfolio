"use server";

import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
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

  await prisma.application.update({
    where: { id: applicationId },
    data: { companyName, roleTitle, introText, ctaText, status },
  });

  revalidatePath(`/admin/applications/${applicationId}`);
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

  revalidatePath(`/admin/applications/${applicationId}`);
}

export async function removeProjectFromApplication(formData: FormData) {
  const applicationProjectId = String(formData.get("applicationProjectId") ?? "");
  const applicationId = String(formData.get("applicationId") ?? "");
  if (!applicationProjectId) return;

  await prisma.applicationProject.delete({ where: { id: applicationProjectId } });
  revalidatePath(`/admin/applications/${applicationId}`);
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

  revalidatePath(`/admin/applications/${applicationId}`);
}
