import Image from "next/image";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { getPortfolioProjects } from "@/lib/cms";
import { brandedPage } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = brandedPage({
  title: "Nosotros",
  description:
    "Tenemos más de 15 años de experiencia en el mercado, buscando brindar soluciones que minimicen el gasto energético y solucionen las necesidades de iluminación.",
  path: "/nosotros",
});

const values = [
  {
    title: "Eficiencia y ahorro",
    body: "Diseñamos sistemas que optimizan tu consumo eléctrico y generan ahorros significativos a corto y largo plazo.",
  },
  {
    title: "Tecnología a tu medida",
    body: "Adaptamos cada solución a las necesidades específicas de tu hogar, negocio o proyecto arquitectónico.",
  },
  {
    title: "Innovación constante",
    body: "Nos mantenemos a la vanguardia en tecnología energética para ofrecerte productos y servicios de última generación.",
  },
  {
    title: "Calidad y respaldo",
    body: "Contamos con un equipo altamente capacitado y marcas líderes que garantizan un funcionamiento confiable y duradero.",
  },
  {
    title: "Compromiso con el futuro",
    body: "Apostamos por la energía limpia como un camino hacia un entorno más sustentable.",
  },
];

export default async function NosotrosPage() {
  const projects = await getPortfolioProjects();

  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle="Tenemos más de 15 años de experiencia en el mercado, buscando brindar soluciones que minimicen el gasto energético y solucionen las necesidades de iluminación."
        image="/images/2025-07-9-1.jpg"
      />

      <section className="site-container py-16 md:py-24">
        <div data-stagger className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title="Con más de 15 años de experiencia en soluciones solares" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-lukx-muted md:text-lg">
              <p>
                En Lukx convertimos la energía solar en beneficios tangibles: ahorros inmediatos y
                un estilo de vida más sostenible para hogares, negocios e industrias. Somos
                especialistas en la venta e instalación de paneles solares de alto rendimiento,
                diseñando soluciones a la medida para reducir tu gasto eléctrico y cuidar el
                planeta.
              </p>
              <p>
                Nuestro compromiso es ofrecer tecnología de vanguardia, calidad y un servicio
                cercano, ayudándote a alcanzar la independencia energética con instalaciones
                seguras, eficientes y con el mejor retorno de inversión.
              </p>
              <p>
                Ya sea que quieras bajar tu recibo de luz, hacer tu empresa más sustentable o
                impulsar un proyecto con energía renovable, en Lukx te acompañamos de principio a
                fin para que aproveches al máximo el poder del sol.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-lukx-light">
            <Image
              src="/images/2025-07-man-worker-firld-by-solar-panels.jpg"
              alt="Instalación de paneles solares Lukx"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-lukx-light py-16 md:py-24">
        <div className="site-container">
          <SectionHeading
            title="Por qué elegir Lukx"
            subtitle="En LUKX te ayudamos a tomar decisiones inteligentes en energía."
            align="center"
          />
          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <article key={v.title} className="bg-white p-6 md:p-8">
                <h3 className="font-display text-3xl text-lukx-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lukx-muted md:text-base">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <SectionHeading title="Casos de éxito" />
        <div data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((item) => (
            <ProjectCard
              key={item.slug}
              title={item.title}
              slug={item.slug}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
