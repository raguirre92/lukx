import LpResidencialQuote from "@/components/agendar/LpResidencialQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const pag = findPag("/lp/residencial");

export const metadata = agendarMetadata(pag);

export default function Page() {
  return <LpResidencialQuote pag={pag} />;
}
