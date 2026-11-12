import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { getPortfolioProject, getPortfolioProjects } from "@/lib/wordpress";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPortfolioProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) return { title: "Portafolio" };
  return {
    title: `${project.title}`,
    description: project.summary,
  };
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) notFound();

  const projects = await getPortfolioProjects();
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.summary}
        image={project.image}
        ctaLabel="Contactanos"
        ctaHref="/contacto"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lukx-green">
              {project.category}
            </p>
            <SectionHeading title={`Proyecto ${project.title}`} />
            <div className="mt-6 space-y-4">
              {project.description.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-lukx-muted md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {project.services.length > 0 ? (
              <div className="mt-8">
                <h3 className="font-display text-3xl text-lukx-charcoal">Servicios</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.services.map((service) => (
                    <li
                      key={service}
                      className="border border-lukx-charcoal/15 px-4 py-2 text-sm text-lukx-charcoal"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Link
              href="/contacto"
              className="btn-green mt-10 inline-flex"
            >
              Quiero un proyecto similar
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-lukx-light lg:aspect-auto lg:min-h-[520px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {project.gallery.length > 1 ? (
          <div className="mt-14">
            <h3 className="font-display text-3xl text-lukx-charcoal md:text-4xl">Galería</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {project.gallery.map((src) => (
                <div key={src} className="relative aspect-[3/2] overflow-hidden bg-lukx-light">
                  <Image
                    src={src}
                    alt={`${project.title} — galería`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {related.length > 0 ? (
        <section className="bg-lukx-light">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
            <SectionHeading title="Más casos de éxito" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <ProjectCard
                  key={item.slug}
                  title={item.title}
                  slug={item.slug}
                  image={item.image}
                  category={item.category}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCta />
    </>
  );
}
