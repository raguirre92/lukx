import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const route = findPag("/agendar/residencial");
const copy = findPag("/lp/residencial");

export const metadata = agendarMetadata(route);

export default function Page() {
  return <ResidencialSpaceQuote pag={copy} pagePath="/agendar/residencial" />;
}
