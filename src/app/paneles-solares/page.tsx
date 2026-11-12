import type { Metadata } from "next";
import Link from "next/link";
import ContactCta from "@/components/ContactCta";
import FaqAccordion from "@/components/FaqAccordion";
import PageHero from "@/components/PageHero";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import SectionHeading from "@/components/SectionHeading";
import paneles from "../../../content/paneles-solares.json";
import { getPortfolioProjects } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Paneles solares",
  description: paneles.hero.subtitle,
};

const benefits = [
  {
    title: "1. Ahorro en electricidad",
    body: "Reduce tu recibo eléctrico desde el primer día.",
  },
  {
    title: "2. Independencia energética",
    body: "Menos dependencia de la red eléctrica y protección ante aumentos de tarifas.",
  },
  {
    title: "3. Retorno de inversión",
    body: "Recuperas la inversión en unos años gracias al ahorro constante.",
  },
  {
    title: "4. Cuidado del medio ambiente",
    body: "Energía limpia que disminuye emisiones de CO₂ y protege el planeta.",
  },
  {
    title: "5. Aumento del valor de la propiedad",
    body: "Hogares y empresas con energía solar tienen mayor plusvalía.",
  },
  {
    title: "6. Bajo mantenimiento",
    body: "Sistemas duraderos con mínimo mantenimiento durante muchos años.",
  },
  {
    title: "7. Innovación y reputación",
    body: "Para empresas e industrias, demuestra compromiso con sostenibilidad y modernidad.",
  },
];

const process = [
  "Valuación del sitio: Analizamos orientación, sombra, consumo eléctrico y espacio disponible.",
  "Diseño del sistema: Diseñamos una solución a medida para maximizar la eficiencia.",
  "Cotización y aprobación: Presentamos el presupuesto y coordinamos la instalación.",
  "Instalación: Colocamos paneles, estructuras y cableado de manera segura.",
  "Conexión y puesta en marcha: Conectamos el sistema y realizamos pruebas.",
  "Monitoreo y mantenimiento: Herramientas de monitoreo y servicios de mantenimiento.",
];

export default async function PanelesSolaresPage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <PageHero
        title={paneles.hero.title}
        subtitle={paneles.hero.subtitle}
        image={paneles.hero.backgroundImage}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <SectionHeading title="Soluciones personalizadas de energía solar" />
        <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
          {paneles.headings[4]}
        </p>
      </section>

      <section className="bg-lukx-light py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading title="Beneficios" align="center" />
          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-2">
            {benefits.map((b) => (
              <article key={b.title} className="bg-white p-6">
                <h3 className="font-display text-2xl text-lukx-charcoal">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lukx-muted">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <h2 className="font-display text-4xl text-lukx-charcoal">Este es el proceso:</h2>
        <ol className="mt-6 space-y-4">
          {process.map((step, i) => (
            <li key={step} className="flex gap-4 text-sm leading-relaxed text-lukx-muted">
              <span className="font-display text-2xl text-lukx-green">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <Link href="/contacto" className="btn-green mt-8">
          Solicitar asesoría
        </Link>
      </section>

      <ProjectsCarousel projects={projects} />

      <section className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-16">
        <h2 className="mb-6 font-display text-4xl text-lukx-charcoal">Preguntas frecuentes</h2>
        <FaqAccordion items={paneles.faqs} />
      </section>

      <ContactCta />
    </>
  );
}
