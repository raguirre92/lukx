import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import { getBlogPost, getBlogPosts } from "@/lib/wordpress";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: `${post.title}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const posts = await getBlogPosts();
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={[post.category, new Date(post.date).toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })].filter(Boolean).join(" · ")}
        image={post.image}
        ctaLabel="Más artículos"
        ctaHref="/blog"
      />

      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <div className="space-y-8">
          {post.sections.map((section, index) => (
            <div key={`${post.slug}-${index}`}>
              {section.heading ? (
                <h2 className="font-display text-3xl text-lukx-charcoal md:text-4xl">
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className={`text-base leading-relaxed text-lukx-muted md:text-lg ${
                    section.heading ? "mt-4" : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-base leading-relaxed text-lukx-muted md:text-lg"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

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
            <h2 className="font-display text-4xl text-lukx-charcoal md:text-5xl">
              Más artículos
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
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
