import Image from "next/image";
import Link from "next/link";
import { spaces } from "@/data/site";

export default function SpaceChooser() {
  return (
    <section id="espacios" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-10">
        <h2 className="font-display text-center text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] text-lukx-charcoal">
          ¿Qué espacio quieres resolver?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-lukx-muted md:text-base">
          Casa, negocio o planta. Entra al espacio y conoce los proyectos que diseñamos e instalamos ahí.
        </p>
        <div data-stagger className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
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
