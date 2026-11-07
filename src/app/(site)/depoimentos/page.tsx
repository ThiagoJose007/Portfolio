import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/load";
import { PageIntro } from "@/components/site/sections/page-intro";
import {
  TestimonialCard,
  TestimonialsSection,
} from "@/components/site/sections/testimonials-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Depoimentos" };

export default async function TestimonialsPage() {
  const { texts, testimonials } = await getSiteContent();
  return (
    <>
      <PageIntro
        eyebrow="Depoimentos"
        title={texts["page.depoimentos.title"]}
        text={texts["page.depoimentos.text"]}
        scene={{ shape: 0, x: 0.45, scale: 0.8, noise: 0.6 }}
      />
      <TestimonialsSection index="01" />
      <section className="bg-paper px-5 pb-[16vh] text-ink md:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 [&_figure]:w-full">
          {testimonials.items.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </section>
      <ContactSection index="02" afterLight />
    </>
  );
}
