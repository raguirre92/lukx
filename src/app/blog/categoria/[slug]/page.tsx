import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getBlogPosts, getPublishedCategorySlugs } from "@/lib/cms";
import { absoluteUrl, formatContentDate, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getPublishedCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const title = posts.find((post) => post.categorySlug === slug)?.category;
  if (!title) return { title: "Categoría" };
  return pageMetadata({
    title: title,
    description: `Artículos de ${title} en el blog de Lukx.`,
    canonical: absoluteUrl(`/blog/categoria/${slug}`),
    noindex: true,
    nofollow: false,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const posts = (await getBlogPosts()).filter((post) => post.categorySlug === slug);
  if (!posts.length) notFound();
  const title = posts[0]?.category || slug;

  return (
    <>
      <PageHero title={title} subtitle="Artículos de esta categoría." image={posts[0]?.image || "/images/luz-1.jpg"} />
      <section className="site-container py-16 md:py-24">
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-lukx-light">
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <time className="mt-4 block text-xs uppercase tracking-[0.14em] text-lukx-muted">
                  {formatContentDate(post.date)}
                </time>
                <h2 className="font-display mt-2 text-3xl text-lukx-charcoal group-hover:text-lukx-green">
                  {post.title}
                </h2>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
