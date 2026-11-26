import SegmentLanding from "@/components/agendar/SegmentLanding";
import { comercialQuote } from "@/content/sector-quotes";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/lp/comercial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: "Paneles solares y respaldo para tu negocio en Monterrey | Lukx" },
  description: comercialQuote.sub,
};

export const revalidate = 300;

export default function Page() {
  return <SegmentLanding segment="comercial" pagePath="/lp/comercial" />;
}
