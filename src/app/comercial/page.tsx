import SegmentLanding from "@/components/agendar/SegmentLanding";
import { segmentPages } from "@/data/segments";
import { brandedPage } from "@/lib/seo";

const page = segmentPages.comercial;

export const metadata = brandedPage({
  title: page.title,
  description: page.description,
  path: page.path,
});

export const revalidate = 300;

export default function Page() {
  return <SegmentLanding segment="comercial" pagePath="/comercial" />;
}
