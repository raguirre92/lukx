import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { asesoriaQuote } from "@/content/sector-quotes";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/lp/asesoria");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: "Energía solar y respaldo para casas, negocios e industrias | Lukx" },
  description: asesoriaQuote.sub,
};

export default function Page() {
  return <ResidencialSpaceQuote pag={route} pagePath="/lp/asesoria" content={asesoriaQuote} />;
}
