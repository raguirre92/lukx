import Image from "next/image";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { scrapedCoolers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Coolers",
  description:
    "¡Refresca tus espacios con Evercooler! Enfriadores móviles para entornos industriales, comerciales y gastronómicos.",
};

export default function CoolersPage() {
  const heroImage =
    scrapedCoolers.hero.backgroundImage || "/images/2025-09-SM-COOLER-25-29.png";
  const intro =
    scrapedCoolers.headings.find((h) => h.includes("Evercooler ofrecemos")) ||
    "En Evercooler ofrecemos una línea completa de enfriadores móviles de aire diseñados para resolver las necesidades de climatización en entornos industriales, comerciales y gastronómicos. Contamos con más de 15 años de experiencia.";
  const products = scrapedCoolers.productsSection.products;

  return (
    <>
      <PageHero
        title={scrapedCoolers.hero.title}
        subtitle={scrapedCoolers.hero.subtitle}
        image={heroImage}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div data-stagger className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              title={scrapedCoolers.intro.titleLines.join(" ")}
            />
            <p className="mt-6 text-base leading-relaxed text-lukx-muted md:text-lg">
              {intro}
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden bg-lukx-light">
            <Image
              src={heroImage}
              alt="Cooler Evercooler"
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-lukx-light">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <SectionHeading title={scrapedCoolers.productsSection.title} align="center" />
          <div data-stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((item) => (
              <article key={item.name} className="bg-white p-5 md:p-6">
                <div className="relative mb-4 aspect-square overflow-hidden bg-lukx-light">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-display text-3xl text-lukx-charcoal">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lukx-muted">
                  {item.description}
                </p>
                {item.images.length > 1 ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {item.images.slice(1, 4).map((src) => (
                      <div key={src} className="relative aspect-square bg-lukx-light">
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        title="¿Necesitas refrescar un espacio?"
        subtitle="Te ayudamos a elegir el cooler ideal según metros cuadrados y condiciones de uso."
      />
    </>
  );
}
