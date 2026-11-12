import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { getBlogPosts } from "@/lib/wordpress";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre eficiencia energética, paneles solares, iluminación y movilidad eléctrica.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Ideas y guías para tomar mejores decisiones energéticas."
        image="/images/luz-1.jpg"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          title="Últimas publicaciones"
          subtitle="Contenido práctico sobre energía, iluminación y movilidad eléctrica."
        />
        <div data-stagger className="mt-12 grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug} className="group flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-lukx-light"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Link>
              <div className="mt-5 flex flex-1 flex-col">
                {post.category ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lukx-green">
                    {post.category}
                  </p>
                ) : null}
                <time className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-lukx-muted">
                  {new Date(post.date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="font-display mt-2 text-3xl leading-none text-lukx-charcoal md:text-4xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-lukx-green"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-lukx-muted md:text-base">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-lukx-green-btn hover:text-lukx-green"
                >
                  Leer más →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ContactCta />
    </>
  );
}
