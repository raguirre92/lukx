import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import PortableBody from "@/components/PortableBody";
import ContactCta from "@/components/ContactCta";
import { getBlogPost, getBlogPosts, getContentSlugs } from "@/lib/cms";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/organization";
import { formatContentDate, pageMetadata, postCanonical } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getContentSlugs("post");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog" };
  const metaTitle = post.seoTitle?.trim();
  return pageMetadata({
    title: metaTitle || post.title,
    absoluteTitle: Boolean(metaTitle),
    description: post.seoDescription || post.excerpt,
    canonical: postCanonical(post.slug, post.canonical),
    image: post.ogImage || post.image,
    noindex: post.noindex,
    nofollow: post.nofollow,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const posts = await getBlogPosts();
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const canonical = postCanonical(post.slug, post.canonical);
  const image = post.ogImage || post.image;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: post.title,
        description: post.seoDescription || post.excerpt,
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        inLanguage: "es-MX",
        image: image.startsWith("http") ? image : `${SITE_URL}${image}`,
        mainEntityOfPage: canonical,
        author: post.authorName
          ? { "@type": "Person", name: post.authorName, url: post.authorUrl }
          : { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        title={post.title}
        subtitle={[post.category, formatContentDate(post.date)].filter(Boolean).join(" · ")}
        image={post.image}
        ctaLabel="Más artículos"
        ctaHref="/blog"
      />

      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        {post.body?.length ? <PortableBody value={post.body} /> : null}
        <div className="mt-12 border-t border-black/10 pt-8">
          <Link
            href="/blog"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-lukx-green-btn hover:text-lukx-green"
          >
            ← Volver al blog
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="bg-lukx-light">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
            <h2 className="font-display text-4xl text-lukx-charcoal md:text-5xl">Más artículos</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-display mt-4 text-2xl text-lukx-charcoal transition-colors group-hover:text-lukx-green md:text-3xl">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCta />
    </>
  );
}
