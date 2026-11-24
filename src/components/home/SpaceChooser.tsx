import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { spaces } from "@/data/site";

export default function SpaceChooser() {
  return (
    <section id="espacios" className="scroll-mt-24 bg-white pt-12 pb-6 md:pt-16 md:pb-8">
      <div className="site-container">
        <div className="grid items-start gap-5 md:grid-cols-2 md:gap-10">
          <h2 className="min-w-0 text-balance font-display text-[clamp(2.4rem,3.6vw,3.5rem)] leading-[0.95] text-lukx-charcoal">
            +15 años siendo tu asesor en iluminación y energía solar
          </h2>
          <div className="min-w-0 md:pt-2">
            <p className="text-sm leading-relaxed text-lukx-muted md:text-base">
              Diseñamos soluciones de iluminación y energía según lo que cada cliente necesita, uniendo diseño, funcionalidad y ahorro.
            </p>
            <Link href="/nosotros" className="group/link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lukx-green-btn transition-colors hover:text-lukx-green">
              Conócenos
              <Icon icon="solar:arrow-right-linear" width={16} className="transition-transform duration-200 group-hover/link:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
        <div data-stagger className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={`/${space.id}`}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={space.image}
                alt={space.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-[2.4rem] leading-none text-white md:text-[2.8rem]">
                  {space.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{space.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
