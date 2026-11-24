import Image from "next/image";
import Link from "next/link";
import ContactCta from "@/components/ContactCta";
import FaqAccordion from "@/components/FaqAccordion";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { segmentPages, type SegmentPage } from "@/data/segments";
import { agendarHref, type SpaceId } from "@/data/site";

type ProjectSlide = {
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function SegmentLanding({
  segment,
  projects,
}: {
  segment: SpaceId;
  projects: ProjectSlide[];
}) {
  const page: SegmentPage = segmentPages[segment];
  const agendar = agendarHref({ segmento: segment });

  return (
    <>
      <PageHero
        title={page.h1}
        subtitle={page.subtitle}
        image={page.image}
        ctaHref={agendar}
        ctaLabel="Agendar asesoría"
      />

      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-lukx-charcoal">
            Proyectos para este espacio
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-lukx-muted md:text-base">
            Diseñamos e instalamos cada uno. Elige el que quieres conocer.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.solutions.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative aspect-[3/4] overflow-hidden bg-lukx-charcoal"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-[1.7rem] leading-none text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">{item.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {projects.length ? (
        <section className="bg-lukx-light py-16 md:py-24">
          <div className="site-container">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-lukx-charcoal">
              Proyectos de este tipo
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  title={project.title}
                  slug={project.slug}
                  image={project.image}
                  category={project.category}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-lukx-charcoal">
            Preguntas frecuentes
          </h2>
          <div className="mt-8">
            <FaqAccordion items={page.faqs} />
          </div>
        </div>
      </section>

      <ContactCta
        title="Agenda tu asesoría"
        subtitle="Cuéntanos qué quieres resolver y revisamos contigo el siguiente paso."
        primaryHref={agendar}
        primaryLabel="Agendar asesoría"
      />
    </>
  );
}
