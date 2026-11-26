import SegmentLanding from "@/components/agendar/SegmentLanding";
import { industrialQuote } from "@/content/sector-quotes";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/lp/industrial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: "Energía solar y respaldo para naves y plantas industriales | Lukx" },
  description: industrialQuote.sub,
};

export const revalidate = 300;

export default function Page() {
  return <SegmentLanding segment="industrial" pagePath="/lp/industrial" />;
}
