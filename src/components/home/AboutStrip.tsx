import Image from "next/image";
import Link from "next/link";

export default function AboutStrip() {
  return (
    <section className="relative overflow-hidden bg-lukx-charcoal text-white">
      <div className="site-container grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19b600] md:text-sm">
            ILUMINACIÓN Y ENERGÍA SOLAR
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.08] text-white">
            <span className="block">+15 AÑOS DE EXPERIENCIA</span>
            <span className="block">SIENDO TU ASESOR EN</span>
            <span className="block">ILUMINACIÓN Y ENERGÍA SOLAR</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-[15px]">
            Lukx es una empresa de servicios de iluminación y soluciones energéticas, especialista
            en Paneles solares precio Monterrey, donde buscamos brindar soluciones integrales para
            nuestros clientes que vayan de acuerdo a sus necesidades, conjugando el diseño, la
            funcionalidad y el ahorro energético.
          </p>
          <Link href="/contacto" className="btn-green mt-8">
            Cotizar
          </Link>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
          <Image
            src="/images/2025-07-alternative-energy-ecological-concept.jpg"
            alt="Soluciones Lukx"
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
