import type { Metadata } from "next";
import SpaceQuote from "@/components/agendar/SpaceQuote";
import { brandedPage } from "@/lib/seo";
import { generalLanding } from "@/content/space-landings";

const landing = generalLanding("agendar");

export const metadata: Metadata = {
  ...brandedPage({
    title: landing.pageTitle,
    description: landing.meta,
    path: "/agendar/asesoria",
    absolute: true,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SpaceQuote pagePath="/agendar/asesoria" />;
}
