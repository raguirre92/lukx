import AgendarScreen from "@/components/agendar/AgendarScreen";
import JsonLd from "@/components/JsonLd";
import { findPag, agendarMetadata } from "@/lib/agendar-metadata";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/organization";

const pag = findPag("/agendar");

export const metadata = agendarMetadata(pag);

export default function AgendarPage() {
  const canonical = `${SITE_URL}/agendar`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: pag.h1,
              description: pag.meta,
              url: canonical,
              provider: { "@id": ORGANIZATION_ID },
              areaServed: ["Monterrey", "Saltillo", "Ramos Arizpe"],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Agenda tu asesoría", item: canonical },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: pag.faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }}
      />
      <AgendarScreen pag={pag} />
    </>
  );
}
