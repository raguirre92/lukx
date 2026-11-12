"use client";

import Image from "next/image";
import BookingScheduler from "@/components/BookingScheduler";
import { leadAllies, leadHomeBenefits, leadReviews } from "@/data/leadPortal";
import { site } from "@/data/site";

const HOME_IMAGE = "/images/2025-07-residencial-2.jpg";
const SOLAR_IMAGE = "/images/2025-12-Paneles-solares-carrusel-1-1.jpg";

export default function LeadPortal() {
  return (
    <>
      {/* Savio-style booking: copy left, native scheduler right */}
      <section
        id="calendario"
        className="scroll-mt-16 bg-lukx-light pt-24 md:scroll-mt-[72px] md:pt-28"
      >
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-14 md:grid-cols-2 md:items-start md:gap-12 md:px-10 md:pb-20 lg:gap-16 lg:px-14">
          <div className="lead-hero-copy md:sticky md:top-28 md:self-start">
            <p className="font-display text-[clamp(3rem,7vw,4.5rem)] leading-[0.88] text-lukx-charcoal">
              LUKX
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-[0.95] tracking-wide text-lukx-charcoal">
              AGENDA TU ASESORÍA
            </h1>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-lukx-muted md:text-[15px]">
              Videollamada para revisar tu recibo de CFE y diseñar paneles solares
              a la medida de tu casa.
            </p>
            <ul className="mt-8 space-y-3 border-t border-black/10 pt-6 text-sm text-lukx-charcoal">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                Diagnóstico de consumo residencial
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                Estimación de ahorro y tamaño de sistema
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                Siguiente paso claro: visita o propuesta
              </li>
            </ul>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex text-[12px] font-semibold uppercase tracking-[0.12em] text-lukx-green-btn transition-colors hover:text-lukx-green"
            >
              Prefiero WhatsApp
            </a>
          </div>

          <div>
            <BookingScheduler />
          </div>
        </div>
      </section>

      {/* Paneles solares para casa */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="relative min-h-[320px] md:min-h-[520px]">
            <Image
              src={HOME_IMAGE}
              alt="Casa con solución energética residencial Lukx"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-14 md:px-12 md:py-20 lg:px-16">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-none text-lukx-charcoal">
              PANELES SOLARES PARA TU CASA
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-lukx-muted md:text-base">
              Menos dependencia de la tarifa eléctrica, más control sobre tu
              consumo. Pensado para hogares en Monterrey y área metropolitana.
            </p>
            <div className="mt-10 space-y-8">
              {leadHomeBenefits.map((item) => (
                <div key={item.title} className="border-t border-black/10 pt-6">
                  <h3 className="text-base font-semibold text-lukx-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-lukx-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="#calendario"
              className="btn-green mt-10 w-fit active:scale-[0.98]"
            >
              Agendar asesoría
            </a>
          </div>
        </div>
      </section>

      {/* Visual break */}
      <section className="relative min-h-[40vh] overflow-hidden bg-lukx-black md:min-h-[48vh]">
        <Image
          src={SOLAR_IMAGE}
          alt=""
          fill
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[40vh] items-end px-5 py-12 md:min-h-[48vh] md:px-12 md:py-16 lg:px-16">
          <p className="max-w-xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] text-white">
            Energía limpia en tu techo. Ahorro que se nota en el recibo.
          </p>
        </div>
      </section>

      {/* Aliados */}
      <section className="bg-lukx-charcoal section-pad">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-white">
            ALIADOS QUE RESPALDAN
          </h2>
          <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-white/70 md:text-base">
            Trabajamos con marcas y equipos de confianza para proyectos
            residenciales sólidos y de larga vida útil.
          </p>
          <div className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4">
            {leadAllies.map((ally) => (
              <div
                key={ally.logo}
                className="relative flex h-14 items-center justify-center opacity-80 transition hover:opacity-100"
              >
                <Image
                  src={ally.logo}
                  alt={ally.name}
                  width={140}
                  height={56}
                  className="max-h-12 w-auto object-contain brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseñas — max 3, no cards clutter */}
      <section className="bg-white section-pad">
        <div className="mx-auto max-w-[900px] px-5 md:px-8">
          <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-lukx-charcoal">
            LO QUE DICEN NUESTROS CLIENTES
          </h2>
          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            {leadReviews.map((review) => (
              <blockquote key={review.name} className="py-8 md:py-10">
                <p className="max-w-[54ch] text-base leading-relaxed text-lukx-charcoal md:text-lg">
                  “{review.quote}”
                </p>
                <footer className="mt-4 text-sm text-lukx-muted">
                  <span className="font-semibold text-lukx-charcoal">
                    {review.name}
                  </span>
                  {" · "}
                  {review.place}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Close CTA */}
      <section className="bg-lukx-black">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-5 py-14 md:flex-row md:items-center md:px-10 md:py-16 lg:px-14">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-white">
              ¿LISTO PARA EMPEZAR?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
              Agenda tu videollamada y revisamos juntos si los paneles solares
              convienen para tu casa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#calendario" className="btn-green active:scale-[0.98]">
              Ver horarios
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline active:scale-[0.98]"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <p className="pb-8 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Lukx ·{" "}
          <a
            href={site.privacyPdf}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white/60"
          >
            Aviso de Privacidad
          </a>
        </p>
      </section>
    </>
  );
}
