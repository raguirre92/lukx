import AgendarScreen from "@/components/agendar/AgendarScreen";
import { agendarMetadata, findPag } from "@/lib/agendar-metadata";

const pag = findPag("/lp/asesoria");

export const metadata = agendarMetadata(pag);

export default function Page() {
  return <AgendarScreen pag={pag} />;
}
