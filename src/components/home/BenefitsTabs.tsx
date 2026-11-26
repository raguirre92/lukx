"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { benefitTabs } from "@/data/site";

export default function BenefitsTabs() {
  const [active, setActive] = useState(benefitTabs[0].id);
  const tab = benefitTabs.find((t) => t.id === active) ?? benefitTabs[0];
  const video = "video" in tab ? (tab.video as string | undefined) : undefined;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="site-container">
        <h2 className="font-display text-center text-[clamp(2.4rem,4vw,3.5rem)] leading-none text-lukx-charcoal">
          Conoce los beneficios
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-1 border-b border-black/10 md:mt-10">
          {benefitTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] transition md:px-5 md:text-xs ${
                active === t.id
                  ? "border-b-2 border-lukx-green text-lukx-green"
                  : "border-b-2 border-transparent text-lukx-muted hover:text-lukx-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
          <div className="relative aspect-[4/3] overflow-hidden bg-lukx-charcoal">
            {video ? (
              <video
                key={video}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={tab.image}
              >
                <source src={video} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={tab.image}
                alt={tab.label}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            )}
          </div>
          <div>
            <h3 className="font-display text-[2.2rem] leading-none text-lukx-charcoal md:text-[2.8rem]">
              {tab.label}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-lukx-muted md:text-[15px]">{tab.body}</p>
            {"bullets" in tab && tab.bullets ? (
              <ul className="mt-5 space-y-2.5 text-sm text-lukx-charcoal">
                {tab.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lukx-green" />
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href="/contacto" className="btn-green mt-8">
              Cotizar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
