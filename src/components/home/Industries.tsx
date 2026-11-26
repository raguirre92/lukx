import Image from "next/image";
import { industries } from "@/data/site";

export default function Industries() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="site-container">
        <h2 className="font-display text-center text-[clamp(2.4rem,4vw,3.5rem)] leading-none text-lukx-charcoal">
          Industrias de especialización
        </h2>
        <div data-stagger className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {industries.map((item) => (
            <article key={item.title} className="group relative aspect-[4/5] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <h3 className="absolute inset-x-0 bottom-0 p-6 font-display text-[2.4rem] leading-none text-white md:text-[2.8rem]">
                {item.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
