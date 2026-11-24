import LpResidencialQuote from "@/components/agendar/LpResidencialQuote";
import { residencialLanding } from "@/content/space-landings";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const pag = findPag("/lp/residencial");

export const metadata = {
  ...agendarMetadata(pag),
  title: { absolute: residencialLanding.pageTitle },
  description: residencialLanding.meta,
};

export default function Page() {
  return <LpResidencialQuote />;
}
