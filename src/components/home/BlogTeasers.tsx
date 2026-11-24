import Image from "next/image";
import Link from "next/link";

type BlogTeaser = {
  slug: string;
  title: string;
  image: string;
  category?: string;
};

export default function BlogTeasers({ posts }: { posts: BlogTeaser[] }) {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="site-container">
        <h2 className="font-display text-center text-[clamp(2.4rem,4vw,3.5rem)] leading-none text-lukx-charcoal">
          Blog
        </h2>
        <div data-stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-lukx-light">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:1024px) 50vw, 25vw"
                  />
                </div>
                {post.category ? (
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-green">
                    {post.category}
                  </p>
                ) : null}
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-lukx-charcoal transition group-hover:text-lukx-green">
                  {post.title}
                </h3>
                <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-green">
                  Leer más
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
