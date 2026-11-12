import Image from "next/image";
import Link from "next/link";
import { solutions } from "@/data/site";

export default function SolutionsGrid() {
  return (
    <section id="soluciones" className="scroll-mt-24 bg-white py-10 md:py-14">
      <div data-stagger className="mx-auto grid max-w-[1400px] gap-3 px-3 sm:grid-cols-2 sm:px-4 lg:grid-cols-5 lg:gap-4 lg:px-6">
        {solutions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative block aspect-[3/4] overflow-hidden bg-lukx-charcoal"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width:1024px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/25 transition duration-500 group-hover:bg-black/70" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
              <h3 className="font-display text-[1.75rem] leading-none text-white md:text-[2rem]">
                {item.title}
              </h3>
              <p className="mt-3 max-h-0 overflow-hidden text-[13px] leading-relaxed text-white/90 opacity-0 transition-all duration-400 group-hover:max-h-40 group-hover:opacity-100">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-lukx-green decoration-2 underline-offset-4">
                Más información
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
