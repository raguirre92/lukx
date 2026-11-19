import Image from "next/image";
import Link from "next/link";
import { agendarHref, spaces, type SpaceId } from "@/data/site";

export default function SpaceChooser({ segmento }: { segmento?: SpaceId }) {
  const active = spaces.find((space) => space.id === segmento);

  return (
    <section id="espacios" className="scroll-mt-24 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-10">
        <h2 className="font-display text-center text-[clamp(2.4rem,4vw,3.5rem)] leading-[1.08] text-lukx-charcoal">
          ¿Qué espacio quieres resolver?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-lukx-muted md:text-base">
          Elige si es tu casa, tu negocio o tu planta. Te mostramos las soluciones
          que aplican y puedes agendar desde ahí.
        </p>
        <div data-stagger className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {spaces.map((space) => {
            const isActive = segmento === space.id;
            return (
              <Link
                key={space.id}
                href={`/?segmento=${space.id}#soluciones`}
                className={`group relative aspect-[4/5] overflow-hidden ${
                  isActive ? "ring-4 ring-lukx-green ring-offset-2" : ""
                }`}
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
            );
          })}
        </div>
        {active ? (
          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-lukx-muted">
              Elegiste {active.title}. Abajo ves las soluciones que aplican.
            </p>
            <Link href={agendarHref({ segmento: active.id })} className="btn-green">
              Agendar asesoría para {active.title.toLowerCase()}{" "}
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
