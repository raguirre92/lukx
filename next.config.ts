import type { NextConfig } from "next";

const OLD_POSTS = [
  "como-mejorar-la-eficiencia-energetica-en-industrias-y-oficinas",
  "como-preparar-tu-negocio-para-la-era-de-los-autos-electricos",
  "como-una-buena-iluminacion-mejora-la-eficiencia-y-estetica-de-un-edificio",
  "retorno-de-inversion-vale-la-pena-instalar-paneles-solares",
];

const permanent = true;

const dated = "/:yyyy(\\d{4})/:mm(\\d{2})/:dd(\\d{2})/:slug";

const redirects = [
  { source: `${dated}/`, destination: "/blog/:slug", permanent },
  { source: dated, destination: "/blog/:slug", permanent },
  ...OLD_POSTS.flatMap((slug) => [
    { source: `/${slug}/`, destination: `/blog/${slug}`, permanent },
    { source: `/${slug}`, destination: `/blog/${slug}`, permanent },
  ]),
  { source: "/feed/", destination: "/blog/rss.xml", permanent },
  { source: "/feed", destination: "/blog/rss.xml", permanent },
  { source: "/contacto-2/", destination: "/contacto", permanent },
  { source: "/contacto-2", destination: "/contacto", permanent },
  { source: "/landing-iluminacion/", destination: "/iluminacion", permanent },
  { source: "/landing-iluminacion", destination: "/iluminacion", permanent },
  { source: "/landing-paneles/", destination: "/paneles-solares", permanent },
  { source: "/landing-paneles", destination: "/paneles-solares", permanent },
  { source: "/coolers/", destination: "/", permanent },
  { source: "/coolers", destination: "/", permanent },
  { source: "/gracias-por-:slug/", destination: "/contacto", permanent },
  { source: "/gracias-por-:slug", destination: "/contacto", permanent },
  {
    source: "/category/:slug((?!uncategorized/|uncategorized$)[^/]+)/",
    destination: "/blog/categoria/:slug",
    permanent,
  },
  {
    source: "/category/:slug((?!uncategorized/|uncategorized$)[^/]+)",
    destination: "/blog/categoria/:slug",
    permanent,
  },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent },
  { source: "/sitemap_index.xml/", destination: "/sitemap.xml", permanent },
  { source: "/:file(.*-sitemap\\d*\\.xml)", destination: "/sitemap.xml", permanent },
  { source: "/:file(.*-sitemap\\d*\\.xml)/", destination: "/sitemap.xml", permanent },
  { source: "/portfolio", destination: "/#proyectos", permanent },
  { source: "/portfolio/", destination: "/#proyectos", permanent },
  {
    source: "/agendar",
    has: [{ type: "query" as const, key: "segmento", value: "residencial" }],
    destination: "/agendar/residencial",
    permanent,
  },
  {
    source: "/agendar/",
    has: [{ type: "query" as const, key: "segmento", value: "residencial" }],
    destination: "/agendar/residencial",
    permanent,
  },
  {
    source: "/agendar",
    has: [{ type: "query" as const, key: "segmento", value: "comercial" }],
    destination: "/agendar/comercial",
    permanent,
  },
  {
    source: "/agendar/",
    has: [{ type: "query" as const, key: "segmento", value: "comercial" }],
    destination: "/agendar/comercial",
    permanent,
  },
  {
    source: "/agendar",
    has: [{ type: "query" as const, key: "segmento", value: "industrial" }],
    destination: "/agendar/industrial",
    permanent,
  },
  {
    source: "/agendar/",
    has: [{ type: "query" as const, key: "segmento", value: "industrial" }],
    destination: "/agendar/industrial",
    permanent,
  },
  // El proxy responde 410 antes que este comodín. Estas rutas quedan fuera
  // para no convertirlas en un 308 hacia otra URL.
  {
    source:
      "/:path((?!sample-page/$|carrusel-de-inicio/$|comments/feed/$|category/[^/]+/feed/$|[^/]+/feed/$|category/uncategorized/$|wp-content/uploads/2021/05/AURORA-HIGH-BAY-1\\.pdf/$|wp-content/uploads/2021/05/UFO-HIGH-BAY\\.pdf/$|wp-content/uploads/2021/05/Access-Street-Light-A-1\\.pdf/$).+)/",
    destination: "/:path",
    permanent,
  },
];

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "lukx.com.mx", pathname: "/wp-content/**" },
      { protocol: "http", hostname: "lukx.com.mx", pathname: "/wp-content/**" },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return redirects;
  },
  async headers() {
    const lp = {
      source: "/lp/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    };
    const agendar = ["/agendar/comercial", "/agendar/industrial", "/agendar/asesoria"].map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
    }));
    if (process.env.VERCEL_ENV === "production") return [lp, ...agendar];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      lp,
      ...agendar,
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
