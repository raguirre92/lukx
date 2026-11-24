"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { spaceLabelsFor } from "@/data/segments";

type ProjectSlide = {
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function ProjectsCarousel({ projects }: { projects: ProjectSlide[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section id="proyectos" className="bg-lukx-charcoal py-10 text-white md:py-14">
      <div className="site-container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-[1.6rem] leading-none text-white/55 md:text-[2rem]">
              Algunos de
            </p>
            <h2 className="font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-none">
              Nuestros Proyectos
            </h2>
          </div>
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
        </div>

        <div
          ref={scroller}
          className="mt-8 flex gap-4 overflow-x-auto pb-2 md:gap-5"
          style={{ scrollbarWidth: "none" }}
        >
          {projects.map((project) => {
            const labels = spaceLabelsFor(project.slug, project.category);
            return (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group relative w-[260px] shrink-0 overflow-hidden md:w-[320px]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
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
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
