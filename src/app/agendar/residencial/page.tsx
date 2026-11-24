import SpaceQuote from "@/components/agendar/SpaceQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";
import { residencialLanding } from "@/content/space-landings";

const route = findPag("/agendar/residencial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: residencialLanding.pageTitle },
  description: residencialLanding.meta,
};

export default function Page() {
  return <SpaceQuote pagePath="/agendar/residencial" />;
}
