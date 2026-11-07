import type { Metadata } from "next";
import { AboutView, getDefaultVersion, type PageProps } from "@/components/site/views";

export const metadata: Metadata = { title: "Sobre mim" };

export default async function AboutPage({ searchParams }: PageProps) {
  return <AboutView version={await getDefaultVersion()} searchParams={searchParams} />;
}
