import Image from "next/image";
import Link from "next/link";
import { agendarHref, solutions, spaces, type SpaceId } from "@/data/site";

function solutionGridClass(count: number) {
  const base = "grid gap-3 lg:gap-4";
  if (count <= 1) return `${base} mx-auto max-w-sm grid-cols-1`;
  if (count === 2) return `${base} mx-auto max-w-4xl grid-cols-1 sm:grid-cols-2`;
  if (count === 3) return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
  return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`;
}

function solutionImageSizes(count: number) {
  if (count >= 4) return "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw";
  if (count === 3) return "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";
  if (count === 2) return "(max-width: 639px) 100vw, 50vw";
  return "100vw";
}

export default function SolutionsGrid({ segmento }: { segmento?: SpaceId }) {
  const space = spaces.find((item) => item.id === segmento);
  const items = space
    ? solutions.filter((item) => space.solutionIds.includes(item.id))
    : solutions;

  return (
    <section id="soluciones" className="scroll-mt-24 bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-6">
        <div className="mb-6 flex flex-col gap-2 px-1 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-[clamp(2rem,3vw,2.8rem)] leading-[1.08] text-lukx-charcoal">
              {space ? `Soluciones para ${space.title.toLowerCase()}` : "Nuestras soluciones"}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-lukx-muted">
              {space
                ? "Paneles solares es la solución principal. Elige una ficha o agenda tu asesoría."
                : "Solar es la solución principal, y también resolvemos respaldo, iluminación y carga."}
            </p>
          </div>
          {space ? (
            <Link href="/#espacios" className="text-sm font-medium text-lukx-green hover:underline">
              Ver todos los espacios
            </Link>
          ) : null}
        </div>
        <div data-stagger className={solutionGridClass(items.length)}>
          {items.map((item, index) => (
              <article
                key={item.href}
                className={`group relative aspect-[3/4] overflow-hidden bg-lukx-charcoal ${
                  items.length === 3 && index === items.length - 1
                    ? "sm:col-span-2 sm:w-[calc(50%-0.375rem)] sm:justify-self-center lg:col-span-1 lg:w-full lg:justify-self-stretch"
                    : ""
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes={solutionImageSizes(items.length)}
                />
                <div className="absolute inset-0 bg-black/25 transition duration-500 group-hover:bg-black/70" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <h3 className="font-display text-[1.75rem] leading-none text-white md:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-h-0 overflow-hidden text-[13px] leading-relaxed text-white/90 opacity-0 transition-all duration-400 group-hover:max-h-40 group-hover:opacity-100">
                    {item.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      href={item.href}
                      className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white underline decoration-lukx-green decoration-2 underline-offset-4"
                    >
                      Ver solución
                    </Link>
                    <Link
                      href={agendarHref({ segmento, solucion: item.id })}
                      className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-green"
                    >
                      Agendar asesoría
                    </Link>
                  </div>
                </div>
              </article>
          ))}
        </div>
      </div>
    </section>
  );
}
