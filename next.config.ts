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
  { source: "/category/:slug/", destination: "/blog/categoria/:slug", permanent },
  { source: "/category/:slug", destination: "/blog/categoria/:slug", permanent },
  { source: "/:path*/", destination: "/:path*", permanent },
];

// TODO(Rafa): no redirigir todavía /landing-iluminacion, /landing-paneles ni /gracias-por-*
// hasta confirmar si los anuncios siguen usando esas URLs.

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
    if (process.env.VERCEL_ENV === "production") return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
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
