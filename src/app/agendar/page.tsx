import type { Metadata } from "next";
import { Suspense } from "react";
import LeadPortal from "@/components/LeadPortal";

export const metadata: Metadata = {
  title: "Agenda tu asesoría | Lukx",
  description:
    "Agenda una videollamada con Lukx. Revisamos tu casa, comercio o industria y te proponemos la solución de energía o iluminación que conviene.",
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
