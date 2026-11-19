import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/organization";
import { isProductionDeploy } from "@/sanity/env";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeploy()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
