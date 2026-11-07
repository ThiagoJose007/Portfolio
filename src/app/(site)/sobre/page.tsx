import type { Metadata } from "next";
import { PageIntro } from "@/components/site/sections/page-intro";
import { AboutSection } from "@/components/site/sections/about-section";
import { SkillsSection } from "@/components/site/sections/skills-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Sobre mim" };

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Sobre mim"
        title="Design e código, *lado a lado*."
        text="Um pouco sobre como eu penso, trabalho e quais ferramentas uso para tirar ideias do papel." // TODO
        scene={{ shape: 3, x: 0.45, scale: 0.9 }}
      />
      <AboutSection index="01" />
      <SkillsSection index="02" />
      <ContactSection index="03" />
    </>
  );
}
