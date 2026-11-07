import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSiteContent } from "@/lib/content/load";
import { getDefaultVersion, getVersionBySlug, trackVisit, type SiteVersion } from "@/lib/versions";
import { Hero } from "./sections/hero";
import { PageIntro } from "./sections/page-intro";
import { AboutSection } from "./sections/about-section";
import { SkillsSection } from "./sections/skills-section";
import { CareerSection } from "./sections/career-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { ContactSection } from "./sections/contact-section";
import { NextSteps } from "./sections/next-steps";
import { ProjectsGrid } from "./projects/projects-grid";
import { ProjectCase } from "./projects/project-case";

// Páginas do site, compartilhadas pela versão geral ("/…") e pelas versões
// de candidatura ("/<slug>/…"). Os arquivos em app/(site) só escolhem a versão.

export type PageProps = { searchParams: Promise<{ preview?: string }> };

const isPreview = async (searchParams: PageProps["searchParams"]) => (await searchParams).preview === "1";

// Resolve a versão de uma candidatura. O slug da versão geral redireciona
// para o endereço sem slug; slug inexistente, arquivado ou expirado → 404.
export async function versionFromSlug(slug: string, rest = "") {
  const lookup = await getVersionBySlug(slug);
  if (lookup.status === "default") redirect(rest || "/");
  if (lookup.status === "missing") notFound();
  return lookup.version;
}

export { getDefaultVersion };

export async function versionMetadata(version: SiteVersion, title?: string): Promise<Metadata> {
  if (version.isDefault) return title ? { title } : {};
  // Versões de candidatura são privadas: fora dos buscadores.
  return {
    title: title ? `${title} · ${version.companyName}` : `Para ${version.companyName}`,
    robots: { index: false, follow: false },
  };
}

export async function HomeView({ version, searchParams }: { version: SiteVersion } & PageProps) {
  await trackVisit(version, await isPreview(searchParams));
  return (
    <>
      <Hero {...version.hero} />
      <ProjectsGrid
        index="01"
        projects={version.projects}
        title={version.companyName ? `Projetos para *${version.companyName}*` : undefined}
      />
      <NextSteps />
      <ContactSection index="02" />
    </>
  );
}

export async function AboutView({ version, searchParams }: { version: SiteVersion } & PageProps) {
  await trackVisit(version, await isPreview(searchParams));
  const { texts, testimonials } = await getSiteContent();
  const hasTestimonials = testimonials.items.length > 0;
  return (
    <>
      <PageIntro
        eyebrow="Sobre mim"
        title={texts["page.sobre.title"]}
        text={texts["page.sobre.text"]}
        scene={{ shape: 3, x: 0.45, scale: 0.9 }}
      />
      <AboutSection index="01" />
      <SkillsSection index="02" />
      {hasTestimonials && <TestimonialsSection index="03" />}
      <ContactSection index={hasTestimonials ? "04" : "03"} afterLight={hasTestimonials} />
    </>
  );
}

export async function ExperienceView({ version, searchParams }: { version: SiteVersion } & PageProps) {
  await trackVisit(version, await isPreview(searchParams));
  const { texts } = await getSiteContent();
  return (
    <>
      <PageIntro
        eyebrow="Experiência"
        title={texts["page.carreira.title"]}
        text={texts["page.carreira.text"]}
        scene={{ shape: 1, x: 0.4, scale: 0.95 }}
      />
      <CareerSection index="01" chapters={version.chapters} />
      <ContactSection index="02" />
    </>
  );
}

export function findProject(version: SiteVersion, slug: string) {
  const index = version.projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();
  return { project: version.projects[index], index };
}

export async function ProjectView({
  version,
  slug,
  searchParams,
}: { version: SiteVersion; slug: string } & PageProps) {
  const { project, index } = findProject(version, slug);
  await trackVisit(version, await isPreview(searchParams));
  const next = version.projects.length > 1 ? version.projects[(index + 1) % version.projects.length] : null;
  return (
    <>
      <ProjectCase project={project} position={index + 1} total={version.projects.length} next={next} />
      <ContactSection />
    </>
  );
}
