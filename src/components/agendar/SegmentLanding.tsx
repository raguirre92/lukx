import ResidencialSpaceQuote from "@/components/agendar/ResidencialSpaceQuote";
import { comercialQuote, industrialQuote } from "@/content/sector-quotes";
import { projectsForSegment } from "@/data/segments";
import type { SpaceId } from "@/data/site";
import { findPag } from "@/lib/agendar-metadata";
import { getPortfolioProjects } from "@/lib/cms";

// Both the site and ad landing use this source for content and project selection.
export default async function SegmentLanding({ segment, pagePath }: { segment: SpaceId; pagePath: string }) {
  const projects = projectsForSegment(await getPortfolioProjects(), segment);
  const pag = findPag(segment === "residencial" ? "/lp/residencial" : `/agendar/${segment}`);
  const content = segment === "comercial" ? comercialQuote : segment === "industrial" ? industrialQuote : undefined;
  return <ResidencialSpaceQuote pag={pag} pagePath={pagePath} content={content} projects={projects} />;
}
