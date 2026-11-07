import type { Metadata } from "next";
import { findProject, ProjectView, versionFromSlug, versionMetadata, type PageProps } from "@/components/site/views";

type Props = PageProps & { params: Promise<{ version: string; project: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version: slug, project: projectSlug } = await params;
  const version = await versionFromSlug(slug, `/projetos/${projectSlug}`);
  return versionMetadata(version, findProject(version, projectSlug).project.title);
}

export default async function VersionProjectPage({ params, searchParams }: Props) {
  const { version: slug, project } = await params;
  const version = await versionFromSlug(slug, `/projetos/${project}`);
  return <ProjectView version={version} slug={project} searchParams={searchParams} />;
}
