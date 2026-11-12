import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function ProjectCard({ title, slug, image, category }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${slug}`}
      className="group relative block aspect-[4/3] overflow-hidden bg-lukx-charcoal"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black/90" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {category ? (
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-lukx-green">
            {category}
          </p>
        ) : null}
        <h3 className="font-display mt-1 text-3xl text-white md:text-4xl">{title}</h3>
      </div>
    </Link>
  );
}
