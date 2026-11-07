import type { Metadata } from "next";
import { PageIntro } from "@/components/site/sections/page-intro";
import { CareerSection } from "@/components/site/sections/career-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Carreira" };

export default function CareerPage() {
  return (
    <>
      <PageIntro
        eyebrow="Carreira"
        title="Uma trajetória em *camadas*."
        text="Da formação aos produtos que construo hoje — cada capítulo acrescentou uma camada ao meu jeito de trabalhar." // TODO
        scene={{ shape: 1, x: 0.4, scale: 0.95 }}
      />
      <CareerSection index="01" />
      <ContactSection index="02" />
    </>
  );
}
