import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toShowcaseProject } from "@/lib/projects";
import { getSiteContent } from "@/lib/content/load";
import { PageIntro } from "@/components/site/sections/page-intro";
import { ProjectsShowcase } from "@/components/site/projects/projects-showcase";
import { ProjectsIndex } from "@/components/site/projects/projects-index";
import { ContactSection } from "@/components/site/sections/contact-section";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos" };

export default async function ProjectsPage() {
  const { texts } = await getSiteContent();
  const projects = (
    await prisma.project.findMany({
      where: { visible: true },
      orderBy: { createdAt: "desc" },
    })
  ).map((project) => toShowcaseProject(project));

  return (
    <>
      <PageIntro
        eyebrow="Projetos"
        title={texts["page.projetos.title"]}
        text={texts["page.projetos.text"]}
        scene={{ shape: 2, x: 0.45, scale: 0.85 }}
      />
      <ProjectsShowcase index="01" projects={projects} />
      <ProjectsIndex projects={projects} />
      <ContactSection index="02" />
    </>
  );
}
