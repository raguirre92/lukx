import SpaceQuote from "@/components/agendar/SpaceQuote";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";
import { comercialLanding } from "@/content/space-landings";

const route = findPag("/agendar/comercial");

export const metadata = {
  ...agendarMetadata(route),
  title: { absolute: comercialLanding.pageTitle },
  description: comercialLanding.meta,
};

export default function Page() {
  return <SpaceQuote pagePath="/agendar/comercial" />;
}
