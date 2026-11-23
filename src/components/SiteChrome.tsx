"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadChrome from "@/components/LeadChrome";
import MotionProvider from "@/components/motion/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return children;
  if (pathname.startsWith("/lp/") || pathname === "/lp") return <LeadChrome ads>{children}</LeadChrome>;

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
