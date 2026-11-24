import Image from "next/image";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import estaciones from "../../../content/estaciones-de-carga.json";
import { brandedPage } from "@/lib/seo";

export const metadata: Metadata = brandedPage({
  title: "Estaciones de carga",
  description: estaciones.hero.subtitle,
  path: "/estaciones-de-carga",
});

export default function EstacionesDeCargaPage() {
  return (
    <>
      <PageHero
        title={estaciones.hero.title}
        subtitle={estaciones.hero.subtitle}
        image={estaciones.hero.backgroundImage}
      />

      <section className="site-container py-14 md:py-16">
        <SectionHeading title={estaciones.mission.titleLines.join(" ")} />
        <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
          {estaciones.mission.body}
        </p>
      </section>

      <section className="bg-lukx-light py-14 md:py-16">
        <div className="site-container">
          <SectionHeading title={estaciones.industries.title} align="center" />
          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-2">
            {estaciones.industries.items.map((item) => (
              <article key={item.title} className="group relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-0 p-6 font-display text-3xl text-white md:text-4xl">
                  {item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container grid items-center gap-10 py-14 md:grid-cols-2 md:py-16">
        <div>
          <SectionHeading title={estaciones.product.titleLines.join(" ")} />
          <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
            {estaciones.product.body}
          </p>
          <ul className="mt-6 space-y-2">
            {estaciones.benefits.items.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-lukx-charcoal">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lukx-green" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-lukx-light">
          <Image
            src={estaciones.product.diagramImage}
            alt="Estaciones de carga"
            fill
            className="object-contain p-4"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      </section>

      <ContactCta title="Prepara tu negocio para la movilidad eléctrica" primaryHref="/agendar?solucion=estaciones-de-carga" />
    </>
  );
}
