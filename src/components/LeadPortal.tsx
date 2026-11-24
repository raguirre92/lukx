"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BookingScheduler from "@/components/BookingScheduler";
import HeroScrim from "@/components/HeroScrim";
import { bookingPages, type BookingPageId } from "@/lib/booking-pages";
import { site } from "@/data/site";

export default function LeadPortal({ page }: { page: BookingPageId }) {
  const searchParams = useSearchParams();
  const copy = bookingPages[page];
  const requestedNeed = page === "general" ? searchParams.get("solucion") ?? "" : "";
  const initialNeed = copy.needs.some((item) => item.value === requestedNeed) ? requestedNeed : "";

  return (
    <>
      <section
        id="calendario"
        className="scroll-mt-16 bg-lukx-light pt-24 md:scroll-mt-[72px] md:pt-28"
      >
        <div className="site-container grid gap-10 pb-14 md:grid-cols-2 md:items-start md:gap-12 md:pb-20 lg:gap-16">
          <div className="lead-hero-copy md:sticky md:top-28 md:self-start">
            <p className="font-display text-[clamp(3rem,7vw,4.5rem)] leading-[0.88] text-lukx-charcoal">
              LUKX
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.1rem)] leading-[0.95] tracking-wide text-lukx-charcoal">
              {copy.h1}
            </h1>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-lukx-muted md:text-[15px]">
              {copy.subtitle}
            </p>
            <ul className="mt-8 space-y-3 border-t border-black/10 pt-6 text-sm text-lukx-charcoal">
              {copy.bullets.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                  {item}
                </li>
              ))}
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
            <BookingScheduler page={copy} initialNeed={initialNeed} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="site-frame grid md:grid-cols-2">
          <div className="relative min-h-[320px] md:min-h-[520px]">
            <Image
              src={copy.storyImage}
              alt={copy.storyImageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="site-gutter flex flex-col justify-center py-14 md:py-20">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.5rem)] leading-none text-lukx-charcoal">
              {copy.storyTitle}
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-lukx-muted md:text-base">
              {copy.storyBody}
            </p>
            <a href="#calendario" className="btn-green mt-10 w-fit active:scale-[0.98]">
              Agendar asesoría
            </a>
          </div>
        </div>
      </section>

      <section className="relative min-h-[40vh] overflow-hidden bg-lukx-black md:min-h-[48vh]">
        <Image
          src={copy.storyImage}
          alt=""
          fill
          className="object-cover object-center opacity-80"
          sizes="100vw"
        />
        <HeroScrim />
        <div className="site-container relative z-10 flex min-h-[40vh] items-end py-12 md:min-h-[48vh] md:py-16">
          <p className="max-w-xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05] text-white">
            {copy.bannerLine}
          </p>
        </div>
      </section>

      <section className="bg-lukx-black">
        <div className="site-container flex flex-col items-start justify-between gap-8 py-14 md:flex-row md:items-center md:py-16">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-white">
              ¿Listo para empezar?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">{copy.closeBody}</p>
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
      </section>
    </>
  );
}
