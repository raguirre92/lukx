"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionProvider from "@/components/motion/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return children;

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
