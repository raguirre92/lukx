import SegmentLanding from "@/components/agendar/SegmentLanding";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const pag = findPag("/lp/residencial");

export const metadata = agendarMetadata(pag);

export const revalidate = 300;

export default function Page() {
  return <SegmentLanding segment="residencial" pagePath="/lp/residencial" />;
}
