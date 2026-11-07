import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toShowcaseProject } from "@/lib/projects";
import { Hero } from "@/components/site/sections/hero";
import { AboutSection } from "@/components/site/sections/about-section";
import { SkillsSection } from "@/components/site/sections/skills-section";
import { CareerSection } from "@/components/site/sections/career-section";
import { ProjectsShowcase } from "@/components/site/projects/projects-showcase";
import { TestimonialsSection } from "@/components/site/sections/testimonials-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const dynamic = "force-dynamic";

// Links de candidatura não devem aparecer em buscadores.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ApplicationPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const application = await prisma.application.findUnique({
    where: { slug },
    include: {
      projects: {
        include: { project: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const isExpired =
    !!application?.expiresAt && application.expiresAt.getTime() < Date.now();

  if (!application || isExpired) {
    notFound();
  }

  // Só os projetos vinculados a esta candidatura (via application_projects).
  const projects = application.projects.map(({ project, customDescription, highlighted }) =>
    toShowcaseProject(project, { description: customDescription, highlighted }),
  );

  return (
    <>
      <Hero
        eyebrow={`Para ${application.companyName} — ${application.roleTitle}`}
        title={`Olá, *${application.companyName}*.`}
        intro={application.introText}
        cta={application.ctaText}
      />
      <AboutSection index="01" />
      <ProjectsShowcase
        index="02"
        title={`Projetos para *${application.companyName}*`}
        projects={projects}
      />
      <SkillsSection index="03" />
      <CareerSection index="04" />
      <TestimonialsSection index="05" />
      <ContactSection index="06" afterLight />
    </>
  );
}
