"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { seedContent } from "@/lib/content/seed";
import { deleteTranslations, saveTranslations } from "@/lib/i18n/translations";
import {
  AWARDS_COPY,
  EDUCATION_COPY,
  EXPERIENCES_COPY,
  GOALS_COPY,
  PROCESS_COPY,
  PROFILE_COPY,
  PROJECTS_COPY,
  SKILLS_COPY,
  STATS_COPY,
  VALUES_COPY,
} from "@/lib/content/linkedin-copy";

export async function importDefaultContent() {
  const created = await seedContent();
  revalidatePath("/", "layout");
  redirect(`/admin?importado=${encodeURIComponent(created.join(", ") || "nada")}`);
}

type Row = { id: string };
type Model = {
  findMany(args?: object): Promise<Row[]>;
  deleteMany(args?: object): Promise<unknown>;
  create(args: { data: object }): Promise<Row>;
};

// Apaga a lista (e as traduções) e recria com os textos novos.
async function replaceList(
  model: Model,
  entity: string,
  items: { data: Record<string, unknown>; pt: Record<string, string> }[],
  where: object = {},
) {
  for (const row of await model.findMany({ where })) await deleteTranslations(entity, row.id);
  await model.deleteMany({ where });
  for (const [order, item] of items.entries()) {
    const row = await model.create({ data: { ...item.data, ...where, order } });
    await saveTranslations(entity, row.id, item.pt);
  }
}

const asModel = (model: unknown) => model as Model;

// Aplica os textos sugeridos (baseados no LinkedIn), em inglês e português.
// Substitui perfil, textos, experiências, formação, números, habilidades,
// processo, valores, "o que busco" e prêmios. Não mexe em nome, e-mail,
// foto, CV, redes, hobbies, freelancer, links nem candidaturas; projetos
// novos entram como rascunho oculto.
export async function applySuggestedCopy(formData: FormData) {
  if (formData.get("confirm") !== "on") redirect("/admin?aplicado=confirme");

  if (!(await prisma.profile.findUnique({ where: { id: "main" } }))) await seedContent();

  const en = Object.fromEntries(Object.entries(PROFILE_COPY).map(([key, value]) => [key, value.en]));
  const pt = Object.fromEntries(Object.entries(PROFILE_COPY).map(([key, value]) => [key, value.pt]));
  await prisma.profile.update({ where: { id: "main" }, data: { ...en, freelanceEnabled: false } });
  await saveTranslations("profile", "main", pt);

  // Textos das seções: voltam ao padrão (que já é o texto novo, em EN e PT).
  await prisma.siteText.deleteMany();
  await prisma.translation.deleteMany({ where: { entity: "text" } });

  await replaceList(
    asModel(prisma.experience),
    "experience",
    EXPERIENCES_COPY.map((item) => ({
      data: {
        company: item.company.en,
        role: item.role.en,
        location: item.location.en,
        start: item.start,
        end: item.end,
        headline: item.headline.en,
        summary: item.summary.en,
        highlights: item.highlights.en,
        shape: item.shape,
      },
      pt: {
        company: item.company.pt,
        role: item.role.pt,
        location: item.location.pt,
        headline: item.headline.pt,
        summary: item.summary.pt,
        highlights: item.highlights.pt.join("\n"),
      },
    })),
  );
  await replaceList(
    asModel(prisma.education),
    "education",
    EDUCATION_COPY.map((item) => ({
      data: { course: item.course.en, institution: item.institution.en, kind: item.kind, start: item.start, end: item.end },
      pt: { course: item.course.pt, institution: item.institution.pt },
    })),
  );
  await replaceList(
    asModel(prisma.stat),
    "stat",
    STATS_COPY.map((item) => ({ data: { value: item.value, suffix: item.suffix, label: item.label.en }, pt: { label: item.label.pt } })),
  );
  await replaceList(
    asModel(prisma.skillGroup),
    "skillGroup",
    SKILLS_COPY.map((item) => ({
      data: { label: item.label.en, headline: item.headline.en, stacks: item.stacks.en },
      pt: { label: item.label.pt, headline: item.headline.pt, stacks: item.stacks.pt.join("\n") },
    })),
  );
  await replaceList(
    asModel(prisma.processStep),
    "processStep",
    PROCESS_COPY.map((item) => ({ data: { title: item.title.en, text: item.text.en }, pt: { title: item.title.pt, text: item.text.pt } })),
  );
  for (const [kind, items] of [
    ["VALUE", VALUES_COPY],
    ["GOAL", GOALS_COPY],
  ] as const) {
    await replaceList(
      asModel(prisma.aboutItem),
      "aboutItem",
      items.map((item) => ({ data: { title: item.title.en, text: item.text.en }, pt: { title: item.title.pt, text: item.text.pt } })),
      { kind },
    );
  }
  await replaceList(
    asModel(prisma.award),
    "award",
    AWARDS_COPY.map((item) => ({
      data: { title: item.title.en, issuer: item.issuer.en, project: item.project?.en ?? null, year: item.year },
      pt: { title: item.title.pt, issuer: item.issuer.pt, project: item.project?.pt ?? "" },
    })),
  );

  // Depoimentos de exemplo saem (os reais ficam).
  const placeholders = await prisma.testimonial.findMany({ where: { quote: { startsWith: "Espaço para um depoimento" } } });
  for (const row of placeholders) await deleteTranslations("testimonial", row.id);
  await prisma.testimonial.deleteMany({ where: { id: { in: placeholders.map((row) => row.id) } } });

  // Estudos de caso como rascunho oculto (não duplica se já existir).
  for (const item of PROJECTS_COPY) {
    if (await prisma.project.findUnique({ where: { slug: item.slug } })) continue;
    const project = await prisma.project.create({
      data: {
        slug: item.slug,
        title: item.title.en,
        summary: item.summary.en,
        role: item.role.en,
        client: item.client.en,
        year: item.year,
        description: item.description.en,
        outcome: item.outcome.en,
        tags: item.tags,
        visible: false,
      },
    });
    await saveTranslations("project", project.id, {
      title: item.title.pt,
      summary: item.summary.pt,
      role: item.role.pt,
      client: item.client.pt,
      description: item.description.pt,
      outcome: item.outcome.pt,
    });
  }

  revalidatePath("/", "layout");
  redirect("/admin?aplicado=1");
}
