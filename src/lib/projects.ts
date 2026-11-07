import type { Project } from "@/generated/prisma/client";

// Formato serializável que os componentes client recebem.
export type ShowcaseProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string | null;
  gallery: string[];
  tags: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  role: string | null;
  year: string | null;
  client: string | null;
  problem: string | null;
  process: string | null;
  outcome: string | null;
  videoUrl: string | null;
  highlighted: boolean;
};

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export function toShowcaseProject(
  project: Project,
  overrides: { description?: string | null; highlighted?: boolean } = {},
): ShowcaseProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: overrides.description || project.description,
    coverImage: project.coverImage,
    gallery: toStringArray(project.gallery),
    tags: toStringArray(project.tags),
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    role: project.role,
    year: project.year,
    client: project.client,
    problem: project.problem,
    process: project.process,
    outcome: project.outcome,
    videoUrl: project.videoUrl,
    highlighted: overrides.highlighted ?? false,
  };
}
