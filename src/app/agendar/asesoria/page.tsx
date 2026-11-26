import type { Metadata } from "next";
import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { asesoriaQuote } from "@/content/sector-quotes";
import { brandedPage } from "@/lib/seo";

export const metadata: Metadata = {
  ...brandedPage({
    title: "Energía solar y respaldo para casas, negocios e industrias | Lukx",
    description: asesoriaQuote.sub,
    path: "/agendar/asesoria",
    absolute: true,
  }),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ResidencialSpaceQuote pagePath="/agendar/asesoria" content={asesoriaQuote} />;
}
