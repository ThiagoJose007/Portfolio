import type { Metadata } from "next";
import { ExperienceView, getDefaultVersion, pageTitle, type PageProps } from "@/components/site/views";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await pageTitle("experience") };
}

export default async function ExperiencePage({ searchParams }: PageProps) {
  return <ExperienceView version={await getDefaultVersion()} searchParams={searchParams} />;
}
