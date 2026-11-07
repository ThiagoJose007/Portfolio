import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/load";
import { PageIntro } from "@/components/site/sections/page-intro";
import { AboutSection } from "@/components/site/sections/about-section";
import { SkillsSection } from "@/components/site/sections/skills-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Sobre mim" };

export default async function AboutPage() {
  const { texts } = await getSiteContent();
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
      <ContactSection index="03" />
    </>
  );
}
