import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { comercialQuote } from "@/content/sector-quotes";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/lp/comercial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: "Paneles solares y respaldo para tu negocio en Monterrey | Lukx" },
  description: comercialQuote.sub,
};

export default function Page() {
  return <ResidencialSpaceQuote pag={route} pagePath="/lp/comercial" content={comercialQuote} />;
}
