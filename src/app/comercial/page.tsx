import SegmentLanding from "@/components/SegmentLanding";
import { projectsForSegment, segmentPages } from "@/data/segments";
import { getPortfolioProjects } from "@/lib/cms";
import { brandedPage } from "@/lib/seo";

const page = segmentPages.comercial;

export const metadata = brandedPage({
  title: page.title,
  description: page.description,
  path: page.path,
});

export const revalidate = 300;

export default async function ComercialPage() {
  const projects = projectsForSegment(await getPortfolioProjects(), "comercial");
  return <SegmentLanding segment="comercial" projects={projects} />;
}
