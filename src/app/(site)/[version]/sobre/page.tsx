import type { Metadata } from "next";
import { AboutView, versionFromSlug, versionMetadata, pageTitle, type PageProps } from "@/components/site/views";

type Props = PageProps & { params: Promise<{ version: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return versionMetadata(await versionFromSlug((await params).version, "/sobre"), await pageTitle("about"));
}

export default async function VersionAboutPage({ params, searchParams }: Props) {
  const version = await versionFromSlug((await params).version, "/sobre");
  return <AboutView version={version} searchParams={searchParams} />;
}
