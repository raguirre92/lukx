import SpaceQuote from "@/components/agendar/SpaceQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";
import { generalLanding } from "@/content/space-landings";

const route = findPag("/lp/asesoria");
const landing = generalLanding("lp");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: landing.pageTitle },
  description: landing.meta,
};

export default function Page() {
  return <SpaceQuote pagePath="/lp/asesoria" />;
}
