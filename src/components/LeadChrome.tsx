"use client";

import Image from "next/image";
import Link from "next/link";
import MotionProvider from "@/components/motion/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ASESORIA_PHONE_DISPLAY, ASESORIA_PHONE_TEL } from "@/lib/agendar-config";
import { site } from "@/data/site";

/**
 * Header mínimo para landings de anuncios (solo logo y WhatsApp).
 * Las páginas orgánicas de /agendar usan el header y el footer del sitio.
 */
export default function LeadChrome({
  children,
  ads = false,
  category,
}: {
  children: React.ReactNode;
  ads?: boolean;
  category?: string;
}) {
  const logo = (
    <Image
      src={site.logos.horizontalWhite}
      alt="Lukx"
      width={130}
      height={38}
      className="h-8 w-auto"
      priority
    />
  );
  return (
    <>
      <MotionProvider />
      <header className="fixed inset-x-0 top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="site-container flex h-16 items-center justify-between md:h-[72px]">
          {ads ? logo : (
            <Link href="/" className="shrink-0" aria-label="Lukx inicio">
              {logo}
            </Link>
          )}
          {category ? (
            <span className="text-sm text-[#f5f5f5]">{category}</span>
          ) : ads ? (
            <a
              href={`tel:${ASESORIA_PHONE_TEL}`}
              data-track-pagina="ads"
              className="text-sm text-[#f5f5f5]"
            >
              {ASESORIA_PHONE_DISPLAY}
            </a>
          ) : (
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#f5f5f5] transition-colors hover:text-[#19b600]"
            >
              WhatsApp
            </a>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {ads ? null : <WhatsAppButton />}
    </>
  );
}
