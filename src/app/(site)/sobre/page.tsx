import type { Metadata } from "next";
import { AboutView, getDefaultVersion, pageTitle, type PageProps } from "@/components/site/views";

export async function generateMetadata(): Promise<Metadata> {
  return { title: await pageTitle("about") };
}

export default async function AboutPage({ searchParams }: PageProps) {
  return <AboutView version={await getDefaultVersion()} searchParams={searchParams} />;
}
