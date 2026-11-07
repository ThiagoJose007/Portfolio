import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Experience } from "@/generated/prisma/client";
import * as defaults from "@/content/site";
import type { CareerChapter, SceneShape } from "@/content/site";
import { splitLines, TEXT_DEFAULTS } from "./texts";
import type { ExperienceItem, Profile, SiteContent, SimpleItem, SocialLink } from "./types";

export const formatPeriod = (start?: string | null, end?: string | null, current = "hoje") => {
  const from = start?.trim();
  const to = end?.trim();
  if (from && to) return `${from} — ${to}`;
  if (from) return `${from} — ${current}`;
  return to ?? "";
};

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const toSocials = (value: unknown): SocialLink[] =>
  Array.isArray(value)
    ? value.flatMap((item) =>
        item && typeof item === "object" && "label" in item && "href" in item
          ? [{ label: String(item.label), href: String(item.href) }]
          : [],
      )
    : [];

const toShape = (value: number): SceneShape => (value >= 0 && value <= 4 ? (value as SceneShape) : 0);

export function toExperienceItem(
  row: Experience,
  overrides: { summary?: string | null; highlights?: unknown } = {},
): ExperienceItem {
  const customHighlights = toStringArray(overrides.highlights);
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location,
    start: row.start,
    end: row.end,
    period: formatPeriod(row.start, row.end),
    headline: row.headline,
    summary: overrides.summary || row.summary,
    highlights: customHighlights.length > 0 ? customHighlights : toStringArray(row.highlights),
    shape: toShape(row.shape),
  };
}

// Capítulos do storytelling de carreira: as experiências (da mais antiga para
// a mais recente) + o capítulo final editável em Textos ("E agora, juntos").
export function buildChapters(experiences: ExperienceItem[], texts: Record<string, string>): CareerChapter[] {
  const chapters: CareerChapter[] = experiences.map((item) => ({
    period: item.period,
    role: item.role,
    place: item.company,
    title: item.headline || item.role,
    text: item.summary,
    highlights: item.highlights,
    shape: item.shape,
  }));
  if (texts["career.next.title"]?.trim()) {
    chapters.push({
      period: texts["career.next.period"],
      role: texts["career.next.role"],
      place: texts["career.next.place"],
      title: texts["career.next.title"],
      text: texts["career.next.text"],
      shape: 4,
    });
  }
  return chapters;
}

// Conteúdo de fábrica (src/content/site.ts), usado enquanto nada foi
// importado para o banco em /admin.
function defaultContent(): ContentData {
  const chapters = defaults.career.chapters.slice(0, -1);
  return {
    profile: {
      ...defaults.profile,
      photo: null,
      cvUrl: null,
      bio: "",
      tldr: { career: "", basedIn: defaults.profile.location, skillset: "", experience: "", languages: "" },
      freelanceEnabled: false,
    },
    experiences: chapters.map((chapter, i): ExperienceItem => {
      const [start, end] = chapter.period.split(" — ");
      return {
        id: `default-${i}`,
        company: chapter.place,
        role: chapter.role,
        location: null,
        start,
        end: end === "hoje" ? null : (end ?? null),
        period: chapter.period,
        headline: chapter.title,
        summary: chapter.text,
        highlights: [],
        shape: chapter.shape,
      };
    }),
    education: [],
    process: [],
    values: [],
    hobbies: [],
    goals: [],
    services: [],
    awards: [],
    stats: defaults.about.stats,
    skillGroups: defaults.skills,
    testimonialItems: defaults.testimonials.items,
  };
}

async function loadFromDatabase() {
  const profileRow = await prisma.profile.findUnique({ where: { id: "main" } });
  if (!profileRow) return null;

  const [experiences, education, skillGroups, stats, process, aboutItems, awards, testimonials] = await Promise.all([
    prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.skillGroup.findMany({ orderBy: { order: "asc" } }),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.processStep.findMany({ orderBy: { order: "asc" } }),
    prisma.aboutItem.findMany({ orderBy: { order: "asc" } }),
    prisma.award.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
  ]);

  const profile: Profile = {
    name: profileRow.name,
    initials: profileRow.initials,
    role: profileRow.role,
    location: profileRow.location,
    timeZone: profileRow.timeZone,
    availability: profileRow.availability,
    email: profileRow.email,
    photo: profileRow.photo,
    cvUrl: profileRow.cvUrl,
    socials: toSocials(profileRow.socials),
    bio: profileRow.bio,
    tldr: {
      career: profileRow.tldrCareer,
      basedIn: profileRow.tldrBasedIn,
      skillset: profileRow.tldrSkillset,
      experience: profileRow.tldrExperience,
      languages: profileRow.tldrLanguages,
    },
    freelanceEnabled: profileRow.freelanceEnabled,
  };

  const itemsOf = (kind: (typeof aboutItems)[number]["kind"]): SimpleItem[] =>
    aboutItems.filter((item) => item.kind === kind).map(({ id, title, text }) => ({ id, title, text }));

  return {
    profile,
    experiences: experiences.map((row) => toExperienceItem(row)),
    education: education.map((row) => ({
      id: row.id,
      institution: row.institution,
      course: row.course,
      kind: row.kind,
      period: formatPeriod(row.start, row.end, "em andamento"),
      description: row.description,
    })),
    process: process.map(({ id, title, text }) => ({ id, title, text })),
    values: itemsOf("VALUE"),
    hobbies: itemsOf("HOBBY"),
    goals: itemsOf("GOAL"),
    services: itemsOf("SERVICE"),
    awards: awards.map(({ id, title, issuer, project, year }) => ({ id, title, issuer, project, year })),
    stats: stats.map(({ value, suffix, label }) => ({ value, suffix, label })),
    skillGroups: skillGroups.map((row) => ({
      id: row.id,
      label: row.label,
      headline: row.headline,
      stacks: toStringArray(row.stacks),
    })),
    testimonialItems: testimonials.map(({ quote, name, role }) => ({ quote, name, role })),
  };
}

type ContentData = NonNullable<Awaited<ReturnType<typeof loadFromDatabase>>>;

// Uma consulta por requisição, mesmo que layout e página peçam o conteúdo.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [data, textRows] = await Promise.all([
    loadFromDatabase().then((result) => result ?? defaultContent()),
    prisma.siteText.findMany(),
  ]);

  const texts: Record<string, string> = { ...TEXT_DEFAULTS };
  for (const row of textRows) texts[row.key] = row.value;

  const { stats, skillGroups, testimonialItems, ...rest } = data;

  return {
    ...rest,
    texts,
    hero: {
      eyebrow: texts["hero.eyebrow"],
      title: texts["hero.title"],
      intro: texts["hero.intro"],
      tags: splitLines(texts["hero.tags"]),
    },
    about: { label: texts["about.label"], manifesto: texts["about.manifesto"], stats },
    skills: { label: texts["skills.label"], title: texts["skills.title"], groups: skillGroups },
    career: { label: texts["career.label"], title: texts["career.title"] },
    testimonials: { label: texts["testimonials.label"], title: texts["testimonials.title"], items: testimonialItems },
    contact: {
      label: texts["contact.label"],
      title: texts["contact.title"],
      text: texts["contact.text"],
      cta: texts["contact.cta"],
    },
    projects: { title: texts["projects.title"] },
    freelance: { title: texts["freelance.title"], text: texts["freelance.text"] },
  };
});
