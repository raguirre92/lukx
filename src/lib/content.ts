import homeJson from "../../content/home.json";
import portfolioJson from "../../content/portfolio.json";
import siteJson from "../../content/site.json";

export const scrapedSite = siteJson;
export const scrapedHome = homeJson;
export const scrapedPortfolio = portfolioJson as Array<{
  slug: string;
  title: string;
  featuredImage?: string;
  gallery?: string[];
  images?: string[];
  contentText?: string;
}>;
