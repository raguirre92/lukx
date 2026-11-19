import type { Metadata } from "next";
import { Suspense } from "react";
import LeadPortal from "@/components/LeadPortal";
import { brandedPage } from "@/lib/seo";

export const metadata: Metadata = {
  ...brandedPage({
    title: "Agenda tu asesoría",
    description:
      "Agenda una videollamada con Lukx. Revisamos tu casa, comercio o industria y te proponemos la solución de energía o iluminación que conviene.",
    path: "/agendar",
  }),
  robots: {
    index: true,
    follow: true,
  },
};

export default function AgendarPage() {
  return (
    <Suspense>
      <LeadPortal />
    </Suspense>
  );
}
