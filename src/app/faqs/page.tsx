import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import FaqAccordion from "@/components/FaqAccordion";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { faqs } from "@/data/faqs";
import { brandedPage } from "@/lib/seo";

export const metadata: Metadata = brandedPage({
  title: "FAQs",
  description:
    "Preguntas frecuentes sobre paneles solares, sistemas BESS, generadores y soluciones energéticas Lukx.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <PageHero
        title="FAQs"
        subtitle="Respuestas claras sobre paneles solares, respaldo energético y más."
        image="/images/2025-07-alternative-energy-ecological-concept.jpg"
      />

      <section className="site-container py-16 md:py-24">
        <SectionHeading
          title="Preguntas frecuentes"
          subtitle="Si no encuentras lo que buscas, contáctanos y te orientamos."
        />
        <div className="mt-10">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <ContactCta
        title="¿Tienes otra pregunta?"
        subtitle="Escríbenos o llámanos. Estamos listos para ayudarte con tu proyecto."
      />
    </>
  );
}
