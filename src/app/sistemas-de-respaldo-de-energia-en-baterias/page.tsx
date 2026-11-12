import Image from "next/image";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import FaqAccordion from "@/components/FaqAccordion";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { faqs } from "@/data/faqs";
import respaldo from "../../../content/sistemas-de-respaldo-de-energia-en-baterias.json";

export const metadata: Metadata = {
  title: "Sistemas de respaldo de energía en baterías",
  description: respaldo.hero.subtitle,
};

export default function SistemasRespaldoPage() {
  const bessFaqs = faqs.filter((f) =>
    /BESS|bater|generador|respaldo|capacidad|ruido|monitorear|infraestructura|factura/i.test(
      f.question,
    ),
  );

  return (
    <>
      <PageHero
        title={respaldo.hero.title}
        subtitle={respaldo.hero.subtitle}
        image={respaldo.hero.backgroundImage}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <SectionHeading title={respaldo.whatWeDo.title} />
        <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
          {respaldo.headings[3]}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-lukx-muted md:text-base">
          {respaldo.headings[6]}
        </p>
      </section>

      <section className="bg-lukx-light py-14 md:py-16">
        <div data-stagger className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 md:px-8">
          {[respaldo.systems.bess, respaldo.systems.generators].map((system) => (
            <article key={system.label} className="bg-white p-6 md:p-8">
              <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-lukx-light">
                <Image
                  src={system.image}
                  alt={system.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lukx-green">
                {system.label}
              </p>
              <h3 className="mt-2 font-display text-3xl text-lukx-charcoal">{system.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-lukx-muted">{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <SectionHeading title={respaldo.whyLukx.title} />
        <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
          {respaldo.whyLukx.intro}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14 md:px-8 md:pb-16">
        <h2 className="mb-6 font-display text-4xl text-lukx-charcoal">Preguntas frecuentes</h2>
        <FaqAccordion items={bessFaqs} />
      </section>

      <ContactCta title={respaldo.cta.title} subtitle={respaldo.cta.body} />
    </>
  );
}
