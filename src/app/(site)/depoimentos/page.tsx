import type { Metadata } from "next";
import { testimonials } from "@/content/site";
import { PageIntro } from "@/components/site/sections/page-intro";
import {
  TestimonialCard,
  TestimonialsSection,
} from "@/components/site/sections/testimonials-section";
import { ContactSection } from "@/components/site/sections/contact-section";

export const metadata: Metadata = { title: "Depoimentos" };

export default function TestimonialsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Depoimentos"
        title="Quem já trabalhou *comigo*."
        text="Colegas, líderes e clientes contando como foi construir junto."
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
