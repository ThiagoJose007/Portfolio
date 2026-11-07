import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/load";
import { PageIntro } from "@/components/site/sections/page-intro";
import { CareerSection } from "@/components/site/sections/career-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Carreira" };

export default async function CareerPage() {
  const { texts } = await getSiteContent();
  return (
    <>
      <PageIntro
        eyebrow="Carreira"
        title={texts["page.carreira.title"]}
        text={texts["page.carreira.text"]}
        scene={{ shape: 1, x: 0.4, scale: 0.95 }}
      />
      <CareerSection index="01" />
      <ContactSection index="02" />
    </>
  );
}
