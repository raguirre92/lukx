import type { Metadata } from "next";
import { Suspense } from "react";
import LeadPortal from "@/components/LeadPortal";
import { bookingPages } from "@/lib/booking-pages";
import { brandedPage } from "@/lib/seo";

const page = bookingPages.comercial;

export const metadata: Metadata = {
  ...brandedPage({
    title: page.title,
    description: page.description,
    path: page.path,
  }),
  robots: { index: true, follow: true },
};

export default function AgendarComercialPage() {
  return (
    <Suspense>
      <LeadPortal page="comercial" />
    </Suspense>
  );
}
