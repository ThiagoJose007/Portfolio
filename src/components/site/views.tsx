import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSiteContent } from "@/lib/content/load";
import { getDefaultVersion, getVersionBySlug, trackVisit, type SiteVersion } from "@/lib/versions";
import { Hero } from "./sections/hero";
import { PageIntro } from "./sections/page-intro";
import { AboutSection } from "./sections/about-section";
import { AboutHero } from "./sections/about-hero";
import { ExperienceList } from "./sections/experience-list";
import {
  AwardsSection,
  BeyondSection,
  EducationSection,
  FreelanceSection,
  ProcessSection,
  SkillsGrid,
} from "./sections/content-sections";
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

// Sobre mim: resumo em 30s → quem sou → como trabalho → ferramentas →
// além do trabalho → freelancer → depoimentos → contato.
export async function AboutView({ version, searchParams }: { version: SiteVersion } & PageProps) {
  await trackVisit(version, await isPreview(searchParams));
  const { testimonials, process } = await getSiteContent();
  const hasTestimonials = testimonials.items.length > 0;
  return (
    <>
      <AboutHero />
      <AboutSection index="01" />
      <ProcessSection index="02" steps={process} />
      <SkillsGrid index="03" />
      <BeyondSection index="04" />
      <FreelanceSection />
      {hasTestimonials && <TestimonialsSection />}
      <ContactSection afterLight={hasTestimonials} />
    </>
  );
}

// Experiência: trajetória (escolhida por versão) → formação → prêmios → contato.
export async function ExperienceView({ version, searchParams }: { version: SiteVersion } & PageProps) {
  await trackVisit(version, await isPreview(searchParams));
  const { texts, education, awards } = await getSiteContent();
  return (
    <>
      <PageIntro
        eyebrow="Experiência"
        title={texts["page.carreira.title"]}
        text={texts["page.carreira.text"]}
        scene={{ shape: 1, x: 0.4, scale: 0.95 }}
      />
      <ExperienceList index="01" experiences={version.experiences} />
      <EducationSection index="02" items={education} />
      <AwardsSection index="03" items={awards} />
      <ContactSection />
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
