import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import SectionHeading from "@/components/SectionHeading";
import iluminacion from "../../../content/iluminacion.json";
import { getPortfolioProjects } from "@/lib/cms";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Iluminación",
  description: iluminacion.hero.tagline,
};

const services = [
  {
    title: "Asesoría técnica especializada",
    body: "Para seleccionar las luminarias adecuadas según el tipo de industria, altura, actividad y requerimientos específicos.",
  },
  {
    title: "Diseño de iluminación profesional",
    body: "Con simulaciones y cálculos fotométricos para garantizar uniformidad, niveles adecuados de luz y eficiencia operativa.",
  },
  {
    title: "Venta y distribución de luminarias LED",
    body: "Robustas, duraderas y con alta eficiencia energética.",
  },
  {
    title: "Reducción de costos de energía y mantenimiento",
    body: "Gracias a tecnología LED de última generación.",
  },
];

const designPoints = [
  "Análisis del entorno y la arquitectura: Estudiamos el espacio, los materiales y el uso previsto para entender cómo la luz puede realzar cada elemento.",
  "Selección adecuada de luminarias: Elegimos luminarias según sus características técnicas, estéticas y eficiencia energética.",
  "Simulación y visualización: Utilizamos herramientas digitales para mostrar cómo se verá la iluminación antes de instalarla.",
  "Equilibrio entre luz natural y artificial: Diseñamos esquemas que aprovechan la luz natural y la complementan con luz artificial de forma armónica.",
  "Cumplimiento de normativas: Nos aseguramos de que el proyecto cumpla con las regulaciones de iluminación y seguridad vigentes.",
];

export default async function IluminacionPage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <PageHero
        title={iluminacion.hero.title}
        subtitle={`${iluminacion.hero.subtitle}. ${iluminacion.hero.tagline}`}
        image={iluminacion.hero.backgroundImage}
      />

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <SectionHeading title="En Lukx transformamos espacios a través de la luz." />
        <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-base">
          {iluminacion.headings[5]}
        </p>
      </section>

      <section className="bg-lukx-light py-14 md:py-16">
        <div data-stagger className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-2 md:px-8">
          {services.map((s) => (
            <article key={s.title} className="bg-white p-6">
              <h3 className="font-display text-2xl text-lukx-charcoal">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-lukx-muted">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 md:px-8 md:py-16">
        <SectionHeading title="Diseño de iluminación" />
        <p className="mt-4 text-sm leading-relaxed text-lukx-muted md:text-base">
          El diseño de iluminación es un servicio especializado que busca potenciar la estética,
          funcionalidad y atmósfera de un espacio mediante el uso estratégico de la luz.
        </p>
        <h3 className="mt-8 font-display text-3xl text-lukx-charcoal">
          En Lukx desarrollamos proyectos personalizados que integran:
        </h3>
        <ul className="mt-5 space-y-3">
          {designPoints.map((p) => (
            <li key={p} className="flex gap-3 text-sm leading-relaxed text-lukx-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lukx-green" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <ProjectsCarousel projects={projects} />
      <ContactCta title="Ilumina tu próximo proyecto con Lukx" />
    </>
  );
}
