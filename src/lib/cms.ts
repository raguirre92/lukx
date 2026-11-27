import { blogPostsFull, type BlogPost, type BlogSection } from "@/data/blog";
import { portfolioProjects as localProjects, type PortfolioProject } from "@/data/portfolio";
import { sanityFetch, sanityFetchPublished } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  POSTS_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECTS_QUERY,
  CATEGORY_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_POSTS_QUERY,
  SITEMAP_PROJECTS_QUERY,
} from "@/sanity/lib/queries";

const PROJECT_ORDER = [
  "grand-park",
  "bodegas-gp",
  "colegio-excelsior",
  "ifpp",
  "noho",
  "parroquia-goretti",
  "rinconada-patos",
];

type SanityImage = {
  alt?: string | null;
  hotspot?: unknown;
  crop?: unknown;
  asset?: { _id?: string | null } | null;
};

type SanityPostCard = {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  categoryTitle?: string | null;
  categorySlug?: string | null;
  mainImage?: SanityImage | null;
  seoNoindex?: boolean | null;
};

type SanityPost = SanityPostCard & {
  _updatedAt?: string | null;
  relatedServiceUrl?: string | null;
  body?: unknown[] | null;
  authorName?: string | null;
  authorUrl?: string | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    noindex?: boolean | null;
    nofollow?: boolean | null;
    canonical?: string | null;
    ogImage?: SanityImage | null;
  } | null;
};

type SanityProject = {
  slug: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  location?: string | null;
  services?: string[] | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    noindex?: boolean | null;
    nofollow?: boolean | null;
  } | null;
  body?: unknown[] | null;
  mainImage?: SanityImage | null;
  gallery?: SanityImage[] | null;
};

function categorySlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function block(style: string, text: string, key: string, listItem?: "bullet") {
  return {
    _type: "block",
    _key: key,
    style,
    listItem,
    level: listItem ? 1 : undefined,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
  };
}

export function sectionsToBody(sections: BlogSection[]) {
  const blocks: unknown[] = [];
  sections.forEach((section, index) => {
    if (section.heading) blocks.push(block("h2", section.heading, `h-${index}`));
    section.paragraphs?.forEach((paragraph, paragraphIndex) => {
      blocks.push(block("normal", paragraph, `p-${index}-${paragraphIndex}`));
    });
    section.bullets?.forEach((bullet, bulletIndex) => {
      blocks.push(block("normal", bullet, `b-${index}-${bulletIndex}`, "bullet"));
    });
  });
  return blocks;
}

function localPost(post: BlogPost): BlogPost {
  return {
    ...post,
    categorySlug: post.category ? categorySlug(post.category) : undefined,
    imageAlt: post.imageAlt || post.title,
    body: post.body ?? sectionsToBody(post.sections),
  };
}

function picture(image: SanityImage | null | undefined, fallback: string, fallbackAlt: string) {
  return {
    src: imageUrl(image) || fallback,
    alt: image?.alt?.trim() || fallbackAlt,
  };
}

function mapPostCard(post: SanityPostCard): BlogPost {
  const image = picture(post.mainImage, "/images/luz-1.jpg", post.title);
  return {
    slug: post.slug,
    title: post.title,
    date: post.publishedAt || "",
    updatedAt: post.updatedAt || undefined,
    image: image.src,
    imageAlt: image.alt,
    excerpt: post.excerpt?.trim() || post.title,
    category: post.categoryTitle || undefined,
    categorySlug: post.categorySlug || undefined,
    sections: [],
    noindex: Boolean(post.seoNoindex),
  };
}

function mapPost(post: SanityPost): BlogPost {
  const card = mapPostCard(post);
  const og = post.seo?.ogImage ? imageUrl(post.seo.ogImage, 1200) : null;
  return {
    ...card,
    body: post.body ?? [],
    systemUpdatedAt: post._updatedAt || undefined,
    relatedServiceUrl: post.relatedServiceUrl || undefined,
    authorName: post.authorName || undefined,
    authorUrl: post.authorUrl || undefined,
    seoTitle: post.seo?.metaTitle || undefined,
    seoDescription: post.seo?.metaDescription || undefined,
    noindex: Boolean(post.seo?.noindex),
    nofollow: Boolean(post.seo?.nofollow),
    canonical: post.seo?.canonical || undefined,
    ogImage: og || undefined,
  };
}

function plainBlocks(body: unknown[] | null | undefined) {
  return (body ?? [])
    .flatMap((blockValue) => {
      if (!blockValue || typeof blockValue !== "object") return [];
      const children = (blockValue as { children?: Array<{ text?: string }> }).children;
      return (children ?? []).map((child) => child.text || "");
    })
    .map((text) => text.trim())
    .filter(Boolean);
}

function mapProject(project: SanityProject): PortfolioProject {
  const image = picture(project.mainImage, "/images/2025-09-3.jpg", project.title);
  const gallery = (project.gallery ?? [])
    .map((item) => picture(item, "", project.title))
    .filter((item) => item.src);
  const paragraphs = plainBlocks(project.body);
  return {
    slug: project.slug,
    title: project.title,
    image: image.src,
    imageAlt: image.alt,
    gallery: gallery.map((item) => item.src),
    galleryAlts: gallery.map((item) => item.alt),
    category: project.category?.trim() || "Proyecto",
    location: project.location?.trim() || undefined,
    summary: project.summary?.trim() || paragraphs[0] || project.title,
    description: paragraphs,
    services: (project.services ?? []).filter(Boolean),
    body: project.body ?? [],
    noindex: Boolean(project.seo?.noindex),
    seoTitle: project.seo?.metaTitle?.trim() || undefined,
    seoDescription: project.seo?.metaDescription?.trim() || undefined,
  };
}

function sortProjects(projects: PortfolioProject[]) {
  return [...projects].sort((a, b) => {
    const aIndex = PROJECT_ORDER.indexOf(a.slug);
    const bIndex = PROJECT_ORDER.indexOf(b.slug);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await sanityFetch<SanityPostCard[]>({
    query: POSTS_QUERY,
    tags: ["post", "category", "author"],
  });
  if (!posts?.length) return blogPostsFull.map(localPost);
  return posts.map(mapPostCard);
}

export async function getBlogPost(slug: string) {
  const posts = await sanityFetch<SanityPostCard[]>({
    query: POSTS_QUERY,
    tags: ["post"],
  });
  if (!posts?.length) {
    return blogPostsFull.map(localPost).find((post) => post.slug === slug);
  }
  const post = await sanityFetch<SanityPost | null>({
    query: POST_QUERY,
    params: { slug },
    tags: ["post", `post:${slug}`, "category", "author"],
  });
  return post ? mapPost(post) : undefined;
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const projects = await sanityFetch<SanityProject[]>({
    query: PROJECTS_QUERY,
    tags: ["project"],
  });
  if (!projects?.length) return localProjects;
  return sortProjects(projects.map(mapProject));
}

export async function getPortfolioProject(slug: string) {
  const project = await sanityFetchPublished<SanityProject | null>(PROJECT_QUERY, { slug });
  if (project?.slug) return mapProject(project);
  const projects = await getPortfolioProjects();
  return projects.find((item) => item.slug === slug);
}

export async function getPublishedCategorySlugs() {
  const posts = await sanityFetchPublished<SanityPostCard[]>(POSTS_QUERY);
  const source = posts?.length ? posts.map(mapPostCard) : blogPostsFull.map(localPost);
  return [...new Set(source.map((post) => post.categorySlug).filter((slug): slug is string => Boolean(slug)))];
}

/** Mínimo de artículos para que una categoría deje de ser noindex (además de tener introducción propia). */
export const CATEGORY_INDEX_MIN_POSTS = 5;

type SanityCategory = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  postCount?: number | null;
};

export async function getBlogCategory(slug: string) {
  const category = await sanityFetch<SanityCategory | null>({
    query: CATEGORY_QUERY,
    params: { slug },
    tags: ["category", `category:${slug}`, "post"],
  });
  if (!category?.slug) return undefined;
  const description = category.description?.trim() || undefined;
  const postCount = category.postCount ?? 0;
  return {
    title: category.title?.trim() || slug,
    slug: category.slug,
    description,
    postCount,
    indexable: Boolean(description) && postCount >= CATEGORY_INDEX_MIN_POSTS,
  };
}

export async function getContentSlugs(kind: "post" | "project") {
  const query = kind === "post" ? POST_SLUGS_QUERY : PROJECT_SLUGS_QUERY;
  const rows = await sanityFetchPublished<Array<{ slug: string }>>(query);
  if (rows?.length) return rows.map((row) => row.slug);
  return (kind === "post" ? blogPostsFull : localProjects).map((item) => item.slug);
}

export async function getSitemapEntries() {
  const [posts, projects, categories] = await Promise.all([
    sanityFetchPublished<Array<{ slug: string; updated?: string }>>(SITEMAP_POSTS_QUERY),
    sanityFetchPublished<Array<{ slug: string; updated?: string }>>(SITEMAP_PROJECTS_QUERY),
    sanityFetchPublished<Array<{ slug: string; updated?: string }>>(SITEMAP_CATEGORIES_QUERY),
  ]);
  return {
    posts: posts?.length
      ? posts
      : blogPostsFull.map((post) => ({ slug: post.slug, updated: post.date })),
    projects: projects?.length
      ? projects
      : localProjects.map((project) => ({ slug: project.slug, updated: undefined })),
    categories: categories ?? [],
  };
}
