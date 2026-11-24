import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { industrialQuote } from "@/content/sector-quotes";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/agendar/industrial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: "Energía solar y respaldo para naves y plantas industriales | Lukx" },
  description: industrialQuote.sub,
};

export default function Page() {
  return <ResidencialSpaceQuote pag={route} pagePath="/agendar/industrial" content={industrialQuote} />;
}
