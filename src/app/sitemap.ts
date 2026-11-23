import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/cms";
import { SITE_URL } from "@/lib/organization";
import { isProductionDeploy } from "@/sanity/env";

const STATIC_PATHS = [
  "/",
  "/blog",
  "/contacto",
  "/nosotros",
  "/faqs",
  "/paneles-solares",
  "/iluminacion",
  "/estaciones-de-carga",
  "/sistemas-de-respaldo-de-energia-en-baterias",
  "/agendar",
  "/agendar/residencial",
  "/agendar/comercial",
  "/agendar/industrial",
  "/residencial",
  "/comercial",
  "/industrial",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProductionDeploy()) return [];
  const { posts, projects } = await getSitemapEntries();
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated ? new Date(post.updated) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: project.updated ? new Date(project.updated) : now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
