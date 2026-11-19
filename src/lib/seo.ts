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

export function stripBrand(title: string) {
  return title.replace(/\s+[–\-|]\s+Lukx\s*$/i, "").trim();
}

export function pageMetadata({
  title,
  description,
  canonical,
  image,
  noindex = false,
  nofollow = false,
  type = "website",
}: {
  title: string;
  description?: string;
  canonical: string;
  image?: string;
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
  return {
    title: stripBrand(title),
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: stripBrand(title),
      description,
      url: canonical,
      siteName: "Lukx",
      locale: "es_MX",
      type,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: stripBrand(title),
      description,
      images: images?.map((item) => item.url),
    },
  };
}
