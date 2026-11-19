import { getBlogPosts } from "@/lib/cms";
import { SITE_URL } from "@/lib/organization";
import { postCanonical } from "@/lib/seo";

export const revalidate = 300;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getBlogPosts();
  const items = posts
    .map((post) => {
      const link = postCanonical(post.slug);
      return `<item>
        <title>${escapeXml(post.title)}</title>
        <link>${link}</link>
        <guid>${link}</guid>
        <pubDate>${post.date ? new Date(post.date).toUTCString() : ""}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog Lukx</title>
    <link>${SITE_URL}/blog</link>
    <description>Artículos de Lukx sobre energía, iluminación y movilidad eléctrica.</description>
    <language>es-MX</language>
    ${items}
  </channel>
</rss>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
