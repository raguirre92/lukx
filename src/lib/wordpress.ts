import { blogPostsFull, type BlogPost, type BlogSection } from "@/data/blog";
import { portfolioProjects as localProjects, type PortfolioProject } from "@/data/portfolio";

const WP_URL = (process.env.WORDPRESS_URL ?? "https://lukx.com.mx").replace(/\/$/, "");
const REVALIDATE_SECONDS = 300;

const PREFERRED_PROJECT_ORDER = [
  "grand-park",
  "bodegas-gp",
  "colegio-excelsior",
  "ifpp",
  "noho",
  "parroquia-goretti",
  "rinconada-patos",
];

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

type WpRendered = { rendered: string };

type WpPost = {
  slug: string;
  date: string;
  title: WpRendered;
  excerpt: WpRendered;
  content: WpRendered;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
    "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>>;
  };
};

type WpProject = {
  slug: string;
  title: WpRendered;
  content: WpRendered;
};

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function plainText(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function sameText(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function withoutTitle(value: string, title: string) {
  let text = value.trim().replace(/^\d+\s*[.)\-–—]+\s*/, "");
  if (text.toLowerCase().startsWith(title.toLowerCase())) {
    text = text.slice(title.length).replace(/^[\s:.\-–—]+/, "").trim();
  }
  return text;
}

function sectionsFromHtml(html: string, title: string): BlogSection[] {
  const sections: BlogSection[] = [];
  let current: BlogSection | null = null;
  const pattern = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  const ensure = () => {
    if (!current) {
      current = {};
      sections.push(current);
    }
    return current;
  };

  while ((match = pattern.exec(html))) {
    const text = plainText(match[2]);
    if (!text || sameText(text, title)) continue;
    const tag = match[1].toLowerCase();

    if (tag.startsWith("h")) {
      current = { heading: text };
      sections.push(current);
      continue;
    }

    const section = ensure();
    if (tag === "li") {
      section.bullets = [...(section.bullets ?? []), text];
    } else {
      section.paragraphs = [...(section.paragraphs ?? []), text];
    }
  }

  return sections;
}

function originalUploads(html: string) {
  const urls = [
    ...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpe?g|png|webp|gif)/gi),
  ].map((match) => decodeEntities(match[0]).split("?")[0]);

  const originals: string[] = [];
  for (const url of urls) {
    if (!url.includes("/wp-content/uploads/")) continue;
    if (/-\d+x\d+\.(?:jpe?g|png|webp|gif)$/i.test(url)) continue;
    if (!originals.includes(url)) originals.push(url);
  }
  return originals;
}

async function fetchCollection<T>(resource: string): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= 20; page += 1) {
    const separator = resource.includes("?") ? "&" : "?";
    const response = await fetch(
      `${WP_URL}/wp-json/wp/v2/${resource}${separator}per_page=100&page=${page}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );

    if (response.status === 400) break;
    if (!response.ok) {
      throw new Error(`WordPress respondió ${response.status} en ${resource}`);
    }

    const batch = (await response.json()) as T[];
    items.push(...batch);
    const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "1");
    if (page >= totalPages) break;
  }

  return items;
}

function mapPost(post: WpPost): BlogPost {
  const title = plainText(post.title.rendered);
  const sections = sectionsFromHtml(post.content.rendered, title);
  const local = blogPostsFull.find((item) => item.slug === post.slug);
  const firstParagraph = sections.flatMap((section) => section.paragraphs ?? [])[0] ?? "";
  const excerpt = withoutTitle(plainText(post.excerpt.rendered), title);
  const lead = withoutTitle(firstParagraph, title);
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    originalUploads(post.content.rendered)[0] ||
    local?.image ||
    "/images/luz-1.jpg";

  const category =
    (post._embedded?.["wp:term"] ?? [])
      .flat()
      .filter((term) => term.taxonomy === "category")
      .map((term) => term.name ?? "")
      .find((name) => name && !/^(uncategorized|sin categoría)$/i.test(name)) ||
    local?.category;

  return {
    slug: post.slug,
    title,
    date: post.date,
    image,
    excerpt: excerpt.length > 40 ? excerpt : lead || local?.excerpt || title,
    category,
    sections: sections.length > 0 ? sections : local?.sections ?? [],
  };
}

function mapProject(project: WpProject): PortfolioProject {
  const title = plainText(project.title.rendered);
  const gallery = originalUploads(project.content.rendered);
  const paragraphs = sectionsFromHtml(project.content.rendered, title).flatMap((section) => [
    ...(section.heading ? [section.heading] : []),
    ...(section.paragraphs ?? []),
  ]);
  const local = localProjects.find((item) => item.slug === project.slug);
  const body = paragraphs.filter((paragraph) => !sameText(paragraph, title));
  const thin = body.join(" ").length < 80;

  return {
    slug: project.slug,
    title,
    image: gallery[0] || local?.image || "/images/2025-09-3.jpg",
    gallery: gallery.length > 0 ? gallery : local?.gallery ?? [],
    category: local?.category ?? "Proyecto",
    summary: thin ? local?.summary ?? `Proyecto ${title}` : body[0],
    description: thin ? local?.description ?? body : body,
    services: local?.services ?? [],
  };
}

function sortProjects(projects: PortfolioProject[]) {
  return [...projects].sort((a, b) => {
    const aIndex = PREFERRED_PROJECT_ORDER.indexOf(a.slug);
    const bIndex = PREFERRED_PROJECT_ORDER.indexOf(b.slug);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await fetchCollection<WpPost>("posts?_embed=1");
    if (posts.length === 0) return blogPostsFull;
    return posts.map(mapPost);
  } catch {
    return blogPostsFull;
  }
}

export async function getBlogPost(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  try {
    const projects = await fetchCollection<WpProject>("elemenfolio");
    if (projects.length === 0) return localProjects;
    return sortProjects(projects.map(mapProject));
  } catch {
    return localProjects;
  }
}

export async function getPortfolioProject(slug: string) {
  const projects = await getPortfolioProjects();
  return projects.find((project) => project.slug === slug);
}
