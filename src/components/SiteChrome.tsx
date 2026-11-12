"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionProvider from "@/components/motion/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/data/site";

function LeadChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionProvider />
      <header className="fixed inset-x-0 top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-[72px] md:px-10">
          <Link href="/" className="shrink-0" aria-label="Lukx inicio">
            <Image
              src={site.logos.horizontalWhite}
              alt="Lukx"
              width={130}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#f5f5f5] transition-colors hover:text-[#19b600]"
          >
            WhatsApp
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <WhatsAppButton />
    </>
  );
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLeadPortal = pathname === "/agendar" || pathname.startsWith("/agendar/");

  if (isLeadPortal) {
    return <LeadChrome>{children}</LeadChrome>;
  }

  return (
    <>
      <MotionProvider />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
