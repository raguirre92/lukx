import fs from "fs";

const content = `import Image from "next/image";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { portfolioProjects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Tenemos m\u00e1s de 15 a\u00f1os de experiencia en el mercado, buscando brindar soluciones que minimicen el gasto energ\u00e9tico y solucionen las necesidades de iluminaci\u00f3n.",
};

const values = [
  {
    title: "Eficiencia y ahorro",
    body: "Dise\u00f1amos sistemas que optimizan tu consumo el\u00e9ctrico y generan ahorros significativos a corto y largo plazo.",
  },
  {
    title: "Tecnolog\u00eda a tu medida",
    body: "Adaptamos cada soluci\u00f3n a las necesidades espec\u00edficas de tu hogar, negocio o proyecto arquitect\u00f3nico.",
  },
  {
    title: "Innovaci\u00f3n constante",
    body: "Nos mantenemos a la vanguardia en tecnolog\u00eda energ\u00e9tica para ofrecerte productos y servicios de \u00faltima generaci\u00f3n.",
  },
  {
    title: "Calidad y respaldo",
    body: "Contamos con un equipo altamente capacitado y marcas l\u00edderes que garantizan un funcionamiento confiable y duradero.",
  },
  {
    title: "Compromiso con el futuro",
    body: "Apostamos por la energ\u00eda limpia como un camino hacia un entorno m\u00e1s sustentable.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        title="Nosotros"
        subtitle="Tenemos m\u00e1s de 15 a\u00f1os de experiencia en el mercado, buscando brindar soluciones que minimicen el gasto energ\u00e9tico y solucionen las necesidades de iluminaci\u00f3n."
        image="/images/2025-07-9-1.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading title="Con m\u00e1s de 15 a\u00f1os de experiencia en soluciones solares" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-lukx-muted md:text-lg">
              <p>
                En Lukx convertimos la energ\u00eda solar en beneficios tangibles: ahorros inmediatos y
                un estilo de vida m\u00e1s sostenible para hogares, negocios e industrias. Somos
                especialistas en la venta e instalaci\u00f3n de paneles solares de alto rendimiento,
                dise\u00f1ando soluciones a la medida para reducir tu gasto el\u00e9ctrico y cuidar el
                planeta.
              </p>
              <p>
                Nuestro compromiso es ofrecer tecnolog\u00eda de vanguardia, calidad y un servicio
                cercano, ayud\u00e1ndote a alcanzar la independencia energ\u00e9tica con instalaciones
                seguras, eficientes y con el mejor retorno de inversi\u00f3n.
              </p>
              <p>
                Ya sea que quieras bajar tu recibo de luz, hacer tu empresa m\u00e1s sustentable o
                impulsar un proyecto con energ\u00eda renovable, en Lukx te acompa\u00f1amos de principio a
                fin para que aproveches al m\u00e1ximo el poder del sol.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-lukx-light">
            <Image
              src="/images/2025-07-man-worker-firld-by-solar-panels.jpg"
              alt="Instalaci\u00f3n de paneles solares Lukx"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-lukx-light py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading
            title="Por qu\u00e9 elegir Lukx"
            subtitle="En LUKX te ayudamos a tomar decisiones inteligentes en energ\u00eda."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <article key={v.title} className="bg-white p-6 md:p-8">
                <h3 className="font-display text-3xl text-lukx-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-lukx-muted md:text-base">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <SectionHeading title="Casos de \u00e9xito" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioProjects.slice(0, 3).map((item) => (
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
`;

fs.writeFileSync("src/app/nosotros/page.tsx", content, "utf8");
console.log("ok", Buffer.byteLength(content, "utf8"));
