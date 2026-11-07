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

export default async function Home() {
  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Hero />
      <AboutSection index="01" />
      <SkillsSection index="02" />
      <CareerSection index="03" />
      <ProjectsShowcase index="04" projects={projects.map((project) => toShowcaseProject(project))} />
      <TestimonialsSection index="05" />
      <ContactSection index="06" afterLight />
    </>
  );
}
