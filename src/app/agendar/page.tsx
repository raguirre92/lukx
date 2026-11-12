import type { Metadata } from "next";
import LeadPortal from "@/components/LeadPortal";

export const metadata: Metadata = {
  title: "Agenda tu asesoría | Paneles solares para casa",
  description:
    "Agenda una videollamada con Lukx y diseña paneles solares para tu casa. Revisa tu recibo de CFE, aliados de confianza y reseñas de clientes en Monterrey.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AgendarPage() {
  return <LeadPortal />;
}
