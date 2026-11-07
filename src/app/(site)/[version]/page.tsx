import type { Metadata } from "next";
import { HomeView, versionFromSlug, versionMetadata, type PageProps } from "@/components/site/views";

type Props = PageProps & { params: Promise<{ version: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return versionMetadata(await versionFromSlug((await params).version));
}

export default async function VersionHomePage({ params, searchParams }: Props) {
  const version = await versionFromSlug((await params).version);
  return <HomeView version={version} searchParams={searchParams} />;
}
