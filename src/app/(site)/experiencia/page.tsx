import type { Metadata } from "next";
import { ExperienceView, getDefaultVersion, type PageProps } from "@/components/site/views";

export const metadata: Metadata = { title: "Experiência" };

export default async function ExperiencePage({ searchParams }: PageProps) {
  return <ExperienceView version={await getDefaultVersion()} searchParams={searchParams} />;
}
