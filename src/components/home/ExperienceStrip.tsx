import Link from "next/link";

export default function ExperienceStrip() {
  return (
    <section className="relative overflow-hidden bg-[url('/images/2025-07-banner-abajo.jpg')] bg-cover bg-center">
      <div className="bg-black/55 px-4 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19b600]">
            ILUMINACIÓN Y ENERGÍA SOLAR
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.08]">
            <span className="block">+15 AÑOS DE EXPERIENCIA</span>
            <span className="block">SIENDO TU ASESOR EN</span>
            <span className="block">ILUMINACIÓN Y ENERGÍA SOLAR</span>
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 md:text-[15px]">
            Lukx es una empresa con mas de 15 años de experiencia brindando servicios de iluminación
            y soluciones energéticas, donde buscamos brindar soluciones integrales para nuestros
            clientes que vayan de acuerdo a sus necesidades, conjugando el diseño, la funcionalidad
            y el ahorro energético.
          </p>
          <Link href="/agendar" className="btn-green mt-8">
            Agendar asesoría <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
