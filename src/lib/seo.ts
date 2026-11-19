import type { Metadata } from "next";
import { isProductionDeploy } from "@/sanity/env";
import { SITE_URL } from "@/lib/organization";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "/" : normalized.replace(/\/+$/, "")}`;
}

export function postCanonical(slug: string, override?: string) {
  const self = `${SITE_URL}/blog/${slug.toLowerCase()}`;
  if (!override) return self;
  try {
    const url = new URL(override);
    if (url.protocol !== "https:" || url.host !== "lukx.com.mx") return self;
    if (url.pathname !== "/" && url.pathname.endsWith("/")) return self;
    return `${url.origin}${url.pathname}`;
  } catch {
    return self;
  }
}

export function formatContentDate(value?: string) {
  if (!value) return "";
  const day = value.slice(0, 10);
  const [year, month, date] = day.split("-").map(Number);
  if (!year || !month || !date) return value;
  return new Date(Date.UTC(year, month - 1, date, 12)).toLocaleDateString("es-MX", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const SITE_DESCRIPTION =
  "Lukx: soluciones energéticas e iluminación en Monterrey. Paneles solares, LED, estaciones de carga, coolers y sistemas de respaldo.";

export function stripBrand(title: string) {
  return title.replace(/\s+[–\-|]\s+Lukx\s*$/i, "").trim();
}

export function projectDescription(project: {
  title: string;
  summary?: string;
  category?: string;
  location?: string;
  seoDescription?: string;
}) {
  const meta = project.seoDescription?.trim();
  if (meta) return meta;
  const excerpt = project.summary?.trim();
  if (excerpt && excerpt !== project.title.trim()) return excerpt;
  const category = project.category?.trim();
  const location = project.location?.trim();
  if (category && category.toLowerCase() !== "proyecto") {
    return location
      ? `Proyecto ${project.title} de Lukx en ${location}: ${category}.`
      : `Proyecto ${project.title} de Lukx: ${category}.`;
  }
  return SITE_DESCRIPTION;
}

export function pageMetadata({
  title,
  description,
  canonical,
  image,
  absoluteTitle = false,
  noindex = false,
  nofollow = false,
  type = "website",
}: {
  title: string;
  description?: string;
  canonical: string;
  image?: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
  nofollow?: boolean;
  type?: "website" | "article";
}): Metadata {
  const indexingOff = !isProductionDeploy() || noindex;
  const robots = {
    index: !indexingOff,
    follow: isProductionDeploy() ? !nofollow : false,
  };
  const images = image ? [{ url: image.startsWith("http") ? image : absoluteUrl(image), width: 1200, height: 630 }] : undefined;
  const documentTitle = absoluteTitle ? title.trim() : stripBrand(title);
  return {
    title: absoluteTitle ? { absolute: documentTitle } : documentTitle,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: documentTitle,
      description,
      url: canonical,
      siteName: "Lukx",
      locale: "es_MX",
      type,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: documentTitle,
      description,
      images: images?.map((item) => item.url),
    },
  };
}
