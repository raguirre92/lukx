import { mkdirSync, writeFileSync } from "node:fs";
import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { JSDOM } from "jsdom";

const ORIGIN = "https://lukx.com.mx";
const OLD_POSTS = new Set([
  "como-mejorar-la-eficiencia-energetica-en-industrias-y-oficinas",
  "como-preparar-tu-negocio-para-la-era-de-los-autos-electricos",
  "como-una-buena-iluminacion-mejora-la-eficiencia-y-estetica-de-un-edificio",
  "retorno-de-inversion-vale-la-pena-instalar-paneles-solares",
]);
const KEEP = new Set([
  "/",
  "/blog",
  "/contacto",
  "/nosotros",
  "/faqs",
  "/paneles-solares",
  "/iluminacion",
  "/estaciones-de-carga",
  "/coolers",
  "/sistemas-de-respaldo-de-energia-en-baterias",
  "/agendar",
]);

const warnings = [];
const imageRows = [];

function warn(message, extra = {}) {
  warnings.push({ message, ...extra });
}

function decode(value = "") {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

function plain(html) {
  return decode(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/\s*\[…\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withoutTitle(text, title) {
  const trimmed = text.trim();
  if (trimmed.toLowerCase().startsWith(title.toLowerCase())) {
    return trimmed.slice(title.length).replace(/^[\s:.\-–—¿?]+/, "").trim();
  }
  return trimmed;
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function absolute(url) {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${ORIGIN}${url}`;
  return url;
}

function originalImage(url) {
  const clean = absolute(url).split("?")[0].split("#")[0];
  return clean.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, "");
}

function isImage(url) {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(originalImage(url));
}

function iso(value) {
  if (!value) return undefined;
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) return value;
  return `${value}Z`;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function wpCollection(resource) {
  const items = [];
  for (let page = 1; page <= 40; page += 1) {
    const separator = resource.includes("?") ? "&" : "?";
    const url = `${ORIGIN}/wp-json/wp/v2/${resource}${separator}per_page=100&page=${page}`;
    const response = await fetch(url);
    if (response.status === 400 || response.status === 404) break;
    if (!response.ok) throw new Error(`WordPress ${response.status} en ${url}`);
    const batch = await response.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    items.push(...batch);
    const pages = Number(response.headers.get("x-wp-totalpages") || "1");
    if (page >= pages) break;
  }
  return items;
}

const schema = Schema.compile({
  name: "default",
  types: [
    {
      name: "post",
      type: "document",
      fields: [
        {
          name: "body",
          type: "array",
          of: [
            {
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
                { title: "H4", value: "h4" },
              ],
              lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Number", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Emphasis", value: "em" },
                ],
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    fields: [
                      { name: "href", type: "url" },
                      { name: "newTab", type: "boolean" },
                      { name: "nofollow", type: "boolean" },
                      { name: "sponsored", type: "boolean" },
                    ],
                  },
                ],
              },
            },
            {
              name: "image",
              type: "object",
              fields: [
                { name: "alt", type: "string" },
                { name: "caption", type: "string" },
              ],
            },
          ],
        },
      ],
    },
  ],
});

const blockType = schema.get("post").fields.find((field) => field.name === "body").type;

function relFlags(value = "") {
  const rel = value.toLowerCase();
  return {
    nofollow: rel.includes("nofollow"),
    sponsored: rel.includes("sponsored"),
  };
}

function blocksFromHtml(html, { slug, title, featured, altByUrl }) {
  const dom = new JSDOM(`<body>${html || ""}</body>`);
  const document = dom.window.document;
  document.querySelectorAll("script, style, noscript, svg, iframe, video").forEach((node) => {
    if (node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
      warn(`Se omitió <${node.tagName.toLowerCase()}>`, { slug });
    }
    node.remove();
  });

  for (const anchor of document.querySelectorAll("a.e-gallery-item, a[href]")) {
    const href = anchor.getAttribute("href") || "";
    if (!isImage(href) || anchor.closest("p, h1, h2, h3, h4, li")) continue;
    const image = document.createElement("img");
    image.setAttribute("src", originalImage(href));
    image.setAttribute("alt", "");
    anchor.replaceWith(image);
  }

  let context = title;
  const pieces = [];
  const seen = new Set();

  const remember = (node) => {
    const text = node.textContent?.replace(/\s+/g, " ").trim();
    if (text) context = text.slice(0, 180);
  };

  const recordImage = (src, alt) => {
    const url = originalImage(src);
    if (!url || seen.has(url) || (featured && url === featured)) return "";
    seen.add(url);
    const finalAlt = (alt || altByUrl.get(url) || "").trim();
    if (!finalAlt) warn("Imagen sin texto alternativo", { slug, url });
    imageRows.push({ slug, url, alt: finalAlt, context });
    return url;
  };

  const pushImage = (src, alt, caption = "") => {
    const url = recordImage(src, alt);
    if (!url) return;
    const finalAlt = (alt || altByUrl.get(url) || "").trim();
    pieces.push(
      `<figure><img src="${url.replace(/"/g, "&quot;")}" alt="${finalAlt.replace(/"/g, "&quot;")}">${
        caption ? `<figcaption>${caption}</figcaption>` : ""
      }</figure>`,
    );
  };

  const recordEmbedded = (node) => {
    for (const image of node.querySelectorAll("img")) {
      recordImage(image.getAttribute("data-src") || image.getAttribute("src"), image.getAttribute("alt"));
    }
  };

  const walk = (node) => {
    if (node.nodeType === 3) return;
    if (node.nodeType !== 1) return;
    const tag = node.tagName.toLowerCase();
    if (tag === "img") {
      pushImage(node.getAttribute("data-src") || node.getAttribute("src"), node.getAttribute("alt"));
      return;
    }
    if (/^h[1-6]$/.test(tag) || tag === "p" || tag === "li") remember(node);
    if (/^h[1-4]$/.test(tag)) {
      const level = tag === "h1" ? "h2" : tag;
      if (tag === "h1") warn("H1 pasado a H2", { slug, text: node.textContent?.trim() });
      const text = node.textContent?.replace(/\s+/g, " ").trim();
      if (text && text.toLowerCase() !== title.toLowerCase()) pieces.push(`<${level}>${node.innerHTML}</${level}>`);
      return;
    }
    if (tag === "p") {
      recordEmbedded(node);
      if (node.textContent?.trim() || node.querySelector("img, a")) pieces.push(`<p>${node.innerHTML}</p>`);
      return;
    }
    if (tag === "ul" || tag === "ol") {
      recordEmbedded(node);
      pieces.push(node.outerHTML);
      return;
    }
    for (const child of node.childNodes) walk(child);
  };
  for (const child of document.body.childNodes) walk(child);

  const simplified = pieces.join("\n");
  if (/\[[a-z][^\]]*\]/i.test(simplified)) warn("Quedó un shortcode en el HTML", { slug });

  const blocks = htmlToBlocks(simplified, blockType, {
    parseHtml: (value) => new JSDOM(value).window.document,
    rules: [
      {
        deserialize(element, next, block) {
          const name = element.tagName?.toLowerCase();
          if (name === "a") {
            const href = element.getAttribute("href");
            if (!href) return undefined;
            const rel = relFlags(element.getAttribute("rel") || "");
            return {
              _type: "__annotation",
              markDef: {
                _type: "link",
                href: absolute(href),
                newTab: element.getAttribute("target") === "_blank",
                ...rel,
              },
              children: next(element.childNodes),
            };
          }
          if (name === "img") {
            const src = originalImage(element.getAttribute("src") || "");
            if (!src) return undefined;
            const caption = element.parentElement?.tagName === "FIGURE"
              ? element.parentElement.querySelector("figcaption")?.textContent?.trim()
              : "";
            return block({
              _type: "image",
              _sanityAsset: `image@${src}`,
              alt: element.getAttribute("alt") || "",
              ...(caption ? { caption } : {}),
            });
          }
          return undefined;
        },
      },
    ],
  });

  return blocks.filter((block) => {
    if (block._type === "image") return true;
    const text = (block.children || []).map((child) => child.text || "").join("").trim();
    return Boolean(text);
  });
}

function imageField(url, alt) {
  if (!url) return undefined;
  return { _type: "image", _sanityAsset: `image@${url}`, alt: alt || "" };
}

async function sitemapUrls() {
  const read = async (url, urls, seen) => {
    if (seen.has(url)) return;
    seen.add(url);
    const xml = await fetch(url).then((response) => response.text());
    if (xml.includes("<sitemapindex")) {
      for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) await read(match[1].trim(), urls, seen);
      return;
    }
    for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) urls.push(match[1].trim());
  };
  const urls = [];
  await read(`${ORIGIN}/sitemap_index.xml`, urls, new Set());
  return urls;
}

function mapSitemapUrl(raw, projectSlugs) {
  const url = new URL(raw);
  const hadSlash = url.pathname.length > 1 && url.pathname.endsWith("/");
  let path = decodeURIComponent(url.pathname);
  if (path.length > 1) path = path.replace(/\/+$/, "");
  path = path.toLowerCase();
  const finish = (destination, code) => ({
    oldUrl: raw,
    destination,
    code: hadSlash && code === 200 ? 301 : code,
  });
  const gone =
    path === "/sample-page" ||
    path === "/carrusel-de-inicio" ||
    path === "/comments/feed" ||
    path === "/category/uncategorized" ||
    /^\/category\/[^/]+\/feed$/.test(path) ||
    /^\/[^/]+\/feed$/.test(path);
  if (gone) return finish("", 410);
  if (path === "/feed") return finish(`${ORIGIN}/blog/rss.xml`, 301);
  if (path === "/contacto-2") return finish(`${ORIGIN}/contacto`, 301);
  const category = path.match(/^\/category\/([^/]+)$/);
  if (category && category[1] !== "uncategorized") {
    return finish(`${ORIGIN}/blog/categoria/${category[1]}`, 301);
  }
  const dated = path.match(/^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)$/);
  if (dated) return finish(`${ORIGIN}/blog/${dated[1]}`, 301);
  const leaf = path.split("/").filter(Boolean).at(-1) || "";
  if (OLD_POSTS.has(leaf) && (path === `/${leaf}` || dated)) return finish(`${ORIGIN}/blog/${leaf}`, 301);
  if (path === "/landing-iluminacion") return finish(`${ORIGIN}/iluminacion`, 301);
  if (path === "/landing-paneles") return finish(`${ORIGIN}/paneles-solares`, 301);
  if (path.startsWith("/gracias-por-")) return finish(`${ORIGIN}/contacto`, 301);
  if (projectSlugs.has(leaf) && path !== `/portfolio/${leaf}`) {
    return finish(`${ORIGIN}/portfolio/${leaf}`, "revisar");
  }
  const normalized = path === "/" ? `${ORIGIN}/` : `${ORIGIN}${path}`;
  if (KEEP.has(path) || path.startsWith("/blog/") || path.startsWith("/portfolio/")) {
    return finish(normalized, raw.replace(/\/+$/, "") === normalized.replace(/\/+$/, "") ? 200 : 301);
  }
  if (raw.replace(/\/+$/, "") !== normalized.replace(/\/+$/, "")) return finish(normalized, 301);
  return finish("", "revisar");
}

const posts = await wpCollection("posts?_embed=1");
const categories = await wpCollection("categories?hide_empty=true");
const projects = await wpCollection("elemenfolio?_embed=1");
let media = [];
try {
  media = await wpCollection("media");
} catch (error) {
  warn(`No se pudo leer la mediateca: ${error.message}`);
}

const altByUrl = new Map();
for (const item of media) {
  if (item.source_url) altByUrl.set(originalImage(item.source_url), item.alt_text || "");
}
for (const post of [...posts, ...projects]) {
  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  if (featured?.source_url) altByUrl.set(originalImage(featured.source_url), featured.alt_text || "");
}

let usersStatus = 0;
try {
  usersStatus = (await fetch(`${ORIGIN}/wp-json/wp/v2/users?per_page=20`)).status;
} catch {
  usersStatus = 0;
}
warn(
  `El endpoint de usuarios de WordPress respondió ${usersStatus || "sin respuesta"}. El autor importado es la marca Lukx, no una persona.`,
);

const documents = [];
documents.push({
  _id: "siteSettings",
  _type: "siteSettings",
  name: "Lukx",
  telephone: "+52 81 8340 1975",
  streetAddress: "Miguel Nieto 306, Nuevas Colonias",
  addressLocality: "Monterrey",
  addressRegion: "NL",
  addressCountry: "MX",
  timeZone: "America/Mexico_City",
  openingHours: [
    {
      _key: "weekday",
      _type: "openingHours",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/lukx.mexico/",
    "https://www.instagram.com/lukx.mexico/",
    "https://www.linkedin.com/company/lukx-m%C3%A9xico/",
  ],
});

documents.push({
  _id: "author-lukx",
  _type: "author",
  name: "Lukx",
  slug: { _type: "slug", current: "lukx" },
  url: ORIGIN,
  sameAs: [],
  legacyId: "1",
});

const categoryIds = new Map();
for (const category of categories) {
  if (category.slug === "uncategorized" || category.count === 0) continue;
  const id = `category-${category.slug}`;
  categoryIds.set(category.id, id);
  documents.push({
    _id: id,
    _type: "category",
    title: plain(category.name),
    slug: { _type: "slug", current: category.slug.toLowerCase() },
    description: plain(category.description),
    legacyId: String(category.id),
  });
}

function featuredOf(entry) {
  const mediaItem = entry._embedded?.["wp:featuredmedia"]?.[0];
  const url = mediaItem?.source_url ? originalImage(mediaItem.source_url) : "";
  const alt = (mediaItem?.alt_text || altByUrl.get(url) || "").trim();
  return { url, alt };
}

for (const post of posts) {
  const title = plain(post.title?.rendered);
  const slug = post.slug.toLowerCase();
  const featured = featuredOf(post);
  if (featured.url) {
    if (!featured.alt) warn("Imagen destacada sin texto alternativo", { slug, url: featured.url });
    imageRows.push({ slug, url: featured.url, alt: featured.alt, context: title });
  } else {
    warn("Artículo sin imagen destacada", { slug });
  }
  const yoast = post.yoast_head_json || {};
  const description = plain(yoast.og_description || post.excerpt?.rendered || "");
  const descriptionWithoutTitle = withoutTitle(description, title).replace(/\s*…\s*$/u, "").trim();
  if (descriptionWithoutTitle.length > 160) {
    warn("La descripción meta de Yoast supera 160 caracteres y queda para revisión", {
      slug,
      length: descriptionWithoutTitle.length,
    });
  }
  const robots = yoast.robots || {};
  const categoryRefs = (post.categories || [])
    .map((id) => categoryIds.get(id))
    .filter(Boolean)
    .map((id) => ({ _type: "reference", _ref: id, _key: id }));

  documents.push({
    _id: `post-${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt: withoutTitle(plain(post.excerpt?.rendered), title) || descriptionWithoutTitle,
    ...(featured.url ? { mainImage: imageField(featured.url, featured.alt) } : {}),
    body: blocksFromHtml(post.content?.rendered, { slug, title, featured: featured.url, altByUrl }),
    author: { _type: "reference", _ref: "author-lukx" },
    categories: categoryRefs,
    publishedAt: iso(post.date),
    updatedAt: iso(post.modified),
    seo: {
      _type: "seo",
      ...(descriptionWithoutTitle ? { metaDescription: descriptionWithoutTitle } : {}),
      noindex: robots.index === "noindex",
      nofollow: robots.follow === "nofollow",
    },
    legacyId: String(post.id),
  });
}

const projectSlugs = new Set();
for (const project of projects) {
  const title = plain(project.title?.rendered);
  const slug = project.slug.toLowerCase();
  projectSlugs.add(slug);
  const prose = blocksFromHtml(project.content?.rendered, {
    slug,
    title,
    featured: "",
    altByUrl,
  }).filter((block) => {
    if (block._type !== "block") return false;
    const text = (block.children || []).map((child) => child.text || "").join(" ").replace(/\s+/g, " ").trim();
    const remainder = text.replace(new RegExp(title, "ig"), "").replace(/proyecto/gi, "").trim();
    return remainder.length > 0;
  });
  if (prose.length === 0) {
    warn("El proyecto de WordPress no tiene texto descriptivo, solo galería", { slug });
  }
  const gallery = imageRows.filter((row) => row.slug === slug);
  const summary = title;
  documents.push({
    _id: `project-${slug}`,
    _type: "project",
    title,
    slug: { _type: "slug", current: slug },
    summary,
    category: "",
    ...(gallery[0] ? { mainImage: imageField(gallery[0].url, gallery[0].alt) } : {}),
    gallery: gallery.map((image, index) => ({
      _key: `g${index}`,
      ...imageField(image.url, image.alt),
    })),
    body: prose,
    services: [],
    seo: { _type: "seo", noindex: false, nofollow: false },
    legacyId: String(project.id),
  });
}

const sitemap = await sitemapUrls();
const mapRows = sitemap.map((url) => mapSitemapUrl(url, projectSlugs));

mkdirSync("import", { recursive: true });
writeFileSync("import/lukx.ndjson", `${documents.map((document) => JSON.stringify(document)).join("\n")}\n`);
writeFileSync(
  "import/imagenes-por-post.csv",
  ["post slug,image URL,current alt,nearby context text", ...imageRows.map((row) => [row.slug, row.url, row.alt, row.context].map(csvCell).join(","))].join("\n") + "\n",
);
const extraMapRows = [
  { oldUrl: `${ORIGIN}/feed/`, destination: `${ORIGIN}/blog/rss.xml`, code: 301 },
  { oldUrl: `${ORIGIN}/comments/feed/`, destination: "", code: 410 },
  { oldUrl: `${ORIGIN}/comments/feed`, destination: "", code: 410 },
  { oldUrl: `${ORIGIN}/category/uncategorized/`, destination: "", code: 410 },
  { oldUrl: `${ORIGIN}/category/uncategorized`, destination: "", code: 410 },
  ...["cargadores-electricos", "iluminacion", "paneles-solares"].flatMap((slug) => [
    { oldUrl: `${ORIGIN}/category/${slug}/feed/`, destination: "", code: 410 },
    { oldUrl: `${ORIGIN}/category/${slug}/feed`, destination: "", code: 410 },
  ]),
  ...[...OLD_POSTS].flatMap((slug) => [
    { oldUrl: `${ORIGIN}/${slug}/feed/`, destination: "", code: 410 },
    { oldUrl: `${ORIGIN}/${slug}/feed`, destination: "", code: 410 },
  ]),
];
const seenMap = new Set(mapRows.map((row) => row.oldUrl));
for (const row of extraMapRows) {
  if (!seenMap.has(row.oldUrl)) mapRows.push(row);
}
writeFileSync(
  "import/mapa-301.csv",
  [
    "# Nota: las filas marcadas 301 se responden con 308 porque Next.js usa permanent: true. Para SEO es equivalente (redirección permanente).",
    "old URL,destination,code",
    ...mapRows.map((row) => [row.oldUrl, row.destination, row.code].map(csvCell).join(",")),
  ].join("\n") + "\n",
);
writeFileSync("import/advertencias.json", `${JSON.stringify(warnings, null, 2)}\n`);

const counts = documents.reduce((total, document) => {
  total[document._type] = (total[document._type] || 0) + 1;
  return total;
}, {});
const images = documents.reduce((total, document) => {
  const text = JSON.stringify(document);
  return total + (text.match(/"_sanityAsset"/g) || []).length;
}, 0);
console.log(JSON.stringify({ documents: documents.length, counts, sanityAssets: images, imageRows: imageRows.length, sitemap: mapRows.length, warnings: warnings.length }, null, 2));
