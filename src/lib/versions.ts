import { cache } from "react";
import { after } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { toShowcaseProject, type ShowcaseProject } from "@/lib/projects";
import { buildChapters, getSiteContent, toExperienceItem } from "@/lib/content/load";
import type { CareerChapter } from "@/content/site";
import type { ExperienceItem } from "@/lib/content/types";

// Uma "versão" do site é o que um visitante vê: a versão geral (servida em
// "/") ou a versão de uma candidatura (servida em "/<slug>"). Os dados
// pessoais são os mesmos; mudam a abertura, os projetos e as experiências.

export type SiteVersion = {
  applicationId: string | null;
  isDefault: boolean;
  // Prefixo das URLs desta versão: "" na geral, "/<slug>" nas candidaturas.
  basePath: string;
  companyName: string | null;
  hero: { eyebrow: string; title: string; intro: string; cta: string | null };
  projects: ShowcaseProject[];
  experiences: ExperienceItem[];
  chapters: CareerChapter[];
};

const applicationInclude = {
  projects: { include: { project: true }, orderBy: { order: "asc" } },
  experiences: { include: { experience: true }, orderBy: { order: "asc" } },
} as const;

type ApplicationWithRelations = NonNullable<
  Awaited<ReturnType<typeof prisma.application.findFirst<{ include: typeof applicationInclude }>>>
>;

const isExpired = (application: { expiresAt: Date | null }) =>
  !!application.expiresAt && application.expiresAt.getTime() < Date.now();

async function buildVersion(application: ApplicationWithRelations | null): Promise<SiteVersion> {
  const content = await getSiteContent();

  // Sem seleção = tudo o que está marcado como visível.
  let projects: ShowcaseProject[];
  if (application && application.projects.length > 0) {
    projects = application.projects.map(({ project, customDescription, highlighted }) =>
      toShowcaseProject(project, { description: customDescription, highlighted }),
    );
  } else {
    const rows = await prisma.project.findMany({ where: { visible: true }, orderBy: { createdAt: "desc" } });
    projects = rows.map((row) => toShowcaseProject(row));
  }

  const experiences =
    application && application.experiences.length > 0
      ? application.experiences.map(({ experience, customSummary, customHighlights }) =>
          toExperienceItem(experience, { summary: customSummary, highlights: customHighlights }),
        )
      : content.experiences;

  const isCompany = !!application && !application.isDefault;
  const hero = {
    eyebrow: isCompany ? `Para ${application.companyName} — ${application.roleTitle}` : content.hero.eyebrow,
    title: isCompany ? `Olá, *${application.companyName}*.` : content.hero.title,
    intro: application?.introText.trim() || content.hero.intro,
    cta: application?.ctaText ?? null,
  };

  return {
    applicationId: application?.id ?? null,
    isDefault: !isCompany,
    basePath: isCompany ? `/${application.slug}` : "",
    companyName: isCompany ? application.companyName : null,
    hero,
    projects,
    experiences,
    chapters: buildChapters(experiences, content.texts),
  };
}

// Versão geral: a candidatura marcada como "versão geral" ou, se nenhuma
// estiver, todos os projetos e experiências visíveis.
export const getDefaultVersion = cache(async () => {
  const application = await prisma.application.findFirst({
    where: { isDefault: true },
    include: applicationInclude,
  });
  return buildVersion(application);
});

export type VersionLookup =
  | { status: "ok"; version: SiteVersion }
  | { status: "default" } // o slug é o da versão geral: redirecionar para "/"
  | { status: "missing" };

export const getVersionBySlug = cache(async (slug: string): Promise<VersionLookup> => {
  const application = await prisma.application.findUnique({ where: { slug }, include: applicationInclude });
  if (!application) return { status: "missing" };
  if (application.isDefault) return { status: "default" };
  if (application.status === "ARCHIVED" || isExpired(application)) return { status: "missing" };
  return { status: "ok", version: await buildVersion(application) };
});

const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|slack|telegram|discord|linkedin|embedly|curl|wget/i;

// Conta uma visita a uma versão de candidatura. Só conta a entrada no site
// (não a navegação interna), ignora robôs/prévias de link e o modo prévia
// do admin (?preview=1). Roda depois da resposta para não atrasar a página.
export async function trackVisit(version: SiteVersion, preview: boolean) {
  const applicationId = version.applicationId;
  if (!applicationId || version.isDefault || preview) return;

  const requestHeaders = await headers();
  if (BOT.test(requestHeaders.get("user-agent") ?? "")) return;
  const referer = requestHeaders.get("referer");
  const host = requestHeaders.get("host");
  if (referer && host && URL.parse(referer)?.host === host) return;

  after(async () => {
    const now = new Date();
    const current = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { status: true, firstViewedAt: true },
    });
    if (!current) return;
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: now,
        firstViewedAt: current.firstViewedAt ?? now,
        status: current.status === "SENT" ? "VIEWED" : current.status,
      },
    });
  });
}
