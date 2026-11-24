"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HeroScrim from "@/components/HeroScrim";
import { heroSlides, navSolutions } from "@/data/site";

const labels = ["Paneles solares", "Estaciones de carga", "Iluminación", "Respaldo en baterías", "Proyectos Lukx"];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000);
    const onVis = () => document.hidden && setPaused(true);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [paused]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line > span", { yPercent: 115, duration: 1.2, stagger: 0.12, delay: 0.15 })
        .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, "-=0.7")
        .from(".hero-index li", { x: 24, autoAlpha: 0, duration: 0.7, stagger: 0.06 }, "-=0.8");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Lukx — soluciones energéticas e iluminación"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-lukx-black"
    >
      {heroSlides.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden="true"
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            className={`object-cover object-center ${i === index ? "kenburns" : ""}`}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-[2]">
        <HeroScrim />
      </div>

      <div className="site-container relative z-[3] flex h-full items-end gap-10 pb-16 md:pb-20">
        <div className="flex-1">
          <h1 className="font-display text-[clamp(3.4rem,9vw,8.2rem)] leading-[1.02] text-white">
            <span className="hero-line block overflow-hidden"><span className="block">Energía e</span></span>
            <span className="hero-line block overflow-hidden">
              <span className="block">
                <span className="text-lukx-green">iluminación</span>
              </span>
            </span>
            <span className="hero-line block overflow-hidden"><span className="block">a tu medida.</span></span>
          </h1>
          <p className="hero-fade mt-6 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-base">
            Diseñamos e instalamos la solución que tu casa, comercio o industria sí necesita.
            Agenda una asesoría y te decimos qué conviene para tu proyecto.
          </p>
          <div className="hero-fade mt-8">
            <Link href="/agendar" className="btn-green btn-lg">
              Agendar asesoría <Icon icon="solar:arrow-right-linear" className="arrow" width={16} aria-hidden />
            </Link>
          </div>
        </div>

        <nav aria-label="Soluciones" className="hidden w-[300px] shrink-0 -mb-10 md:-mb-14 lg:block">
          <ol className="hero-index border-t border-white/20">
            {navSolutions.map((s, i) => (
              <li key={s.href} className="border-b border-white/20">
                <Link
                  href={s.href}
                  className="group flex items-center justify-between py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-white focus-visible:text-white"
                >
                  <span>
                    <span className="mr-3 font-display text-base tracking-normal text-lukx-green">0{i + 1}</span>
                    {s.label}
                  </span>
                  <Icon icon="solar:arrow-right-up-linear" width={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="site-container absolute inset-x-0 bottom-0 z-[4] flex items-center gap-4 pb-6">
        <div className="flex flex-1 gap-1.5" role="group" aria-label="Fotografías del carrusel">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver foto ${i + 1}: ${labels[i] ?? ""}`}
              aria-current={i === index}
              onClick={() => { setIndex(i); setPaused(true); }}
              className="group relative h-6 flex-1 max-w-16"
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/25 transition group-hover:bg-white/50" />
              {i === index ? (
                <span key={`${index}-${paused}`} className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-lukx-green ${paused ? "" : "hero-progress"}`} />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
