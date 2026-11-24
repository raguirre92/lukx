"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { spaceLabelsFor } from "@/data/segments";

export type ProjectSlide = {
  imageAlt?: string;
  gallery?: string[];
  galleryAlts?: string[];
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function ProjectsCarousel({
  projects,
  tone = "dark",
  onProjectSelect,
}: {
  projects: ProjectSlide[];
  tone?: "dark" | "light";
  onProjectSelect?: (project: ProjectSlide) => void;
}) {
  const light = tone === "light";
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section
      id="proyectos"
      className={
        light
          ? "bg-white pt-12 pb-6 text-lukx-charcoal md:pt-16 md:pb-8"
          : "bg-lukx-charcoal py-10 text-white md:py-14"
      }
    >
      <div className="site-container">
        <div
          className={
            light
              ? "flex items-end justify-between gap-4 border-b border-black/15 pb-6"
              : "flex items-end justify-between gap-4"
          }
        >
          <div>
            {light ? null : (
              <p className="font-display text-[1.6rem] leading-none text-white/55 md:text-[2rem]">
                Algunos de
              </p>
            )}
            <h2
              data-no-split={light || undefined}
              className={
                light
                  ? "font-display text-4xl leading-none md:text-5xl"
                  : "font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-none"
              }
            >
              Nuestros proyectos
            </h2>
          </div>
          {light ? null : (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => scroll(-1)}
              className="grid h-11 w-11 place-items-center border border-white/40 text-xl transition hover:bg-white hover:text-lukx-charcoal"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => scroll(1)}
              className="grid h-11 w-11 place-items-center border border-white/40 text-xl transition hover:bg-white hover:text-lukx-charcoal"
            >
              ›
            </button>
          </div>
          )}
        </div>

        <div
          ref={scroller}
          className={
            light
              ? `mt-8 grid gap-4 sm:grid-cols-2${projects.length > 2 ? " lg:grid-cols-3" : ""}`
              : "mt-8 flex gap-4 overflow-x-auto pb-2 md:gap-5"
          }
          style={light ? undefined : { scrollbarWidth: "none" }}
        >
          {projects.map((project) => {
            const labels = spaceLabelsFor(project.slug, project.category);
            const className = light
              ? "group relative block overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-lukx-green"
              : "group relative block w-[260px] shrink-0 overflow-hidden text-left md:w-[320px]";
            const card = (<>
              <div className={light ? "relative aspect-[4/3]" : "relative aspect-[4/5]"}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes={light ? "(max-width: 639px) 100vw, 50vw" : "320px"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-display text-[1.9rem] leading-none">{project.title}</h3>
                {labels.length ? (
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-green">
                    {labels.join(" · ")}
                  </p>
                ) : null}
                <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-lukx-green decoration-2 underline-offset-4">
                  Ver más
                </span>
              </div>
            </>);
            return onProjectSelect ? (
              <button key={project.slug} type="button" aria-haspopup="dialog" aria-label={`Ver imágenes de ${project.title}`} onClick={() => onProjectSelect(project)} className={`${className} cursor-pointer`}>{card}</button>
            ) : (
              <Link key={project.slug} href={`/portfolio/${project.slug}`} className={className}>{card}</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
