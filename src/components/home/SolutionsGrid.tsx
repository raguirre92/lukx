import Image from "next/image";
import Link from "next/link";
import { segmentPages } from "@/data/segments";
import type { SpaceId } from "@/data/site";

export default function SolutionsGrid({ segmento = "residencial" }: { segmento?: SpaceId }) {
  const page = segmentPages[segmento];

  return (
    <section id="soluciones" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="site-container">
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-none text-lukx-charcoal">
          Proyectos para este espacio
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-lukx-muted md:text-base">
          Diseñamos e instalamos cada uno. Elige el que quieres conocer.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.solutions.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative aspect-[3/4] overflow-hidden bg-lukx-charcoal"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-[1.7rem] leading-none text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
