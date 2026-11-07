import type { Metadata } from "next";
import { findProject, getDefaultVersion, ProjectView, type PageProps } from "@/components/site/views";

type Props = PageProps & { params: Promise<{ project: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { project } = findProject(await getDefaultVersion(), (await params).project);
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const { project } = await params;
  return <ProjectView version={await getDefaultVersion()} slug={project} searchParams={searchParams} />;
}
