import type { Metadata } from "next";
import { ExperienceView, versionFromSlug, versionMetadata, type PageProps } from "@/components/site/views";

type Props = PageProps & { params: Promise<{ version: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return versionMetadata(await versionFromSlug((await params).version, "/experiencia"), "Experiência");
}

export default async function VersionExperiencePage({ params, searchParams }: Props) {
  const version = await versionFromSlug((await params).version, "/experiencia");
  return <ExperienceView version={version} searchParams={searchParams} />;
}
