import { getDefaultVersion, HomeView, type PageProps } from "@/components/site/views";

export default async function HomePage({ searchParams }: PageProps) {
  return <HomeView version={await getDefaultVersion()} searchParams={searchParams} />;
}
