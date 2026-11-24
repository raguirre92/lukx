import SpaceQuote from "@/components/agendar/SpaceQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";
import { industrialLanding } from "@/content/space-landings";

const route = findPag("/agendar/industrial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: industrialLanding.pageTitle },
  description: industrialLanding.meta,
};

export default function Page() {
  return <SpaceQuote pagePath="/agendar/industrial" />;
}
