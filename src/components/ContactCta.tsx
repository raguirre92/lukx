import Link from "next/link";
import { site } from "@/data/site";

type ContactCtaProps = {
  title?: string;
  subtitle?: string;
};

export default function ContactCta({
  title = "¿Listo para empezar tu proyecto?",
  subtitle = "Contáctanos y te ayudamos a diseñar la solución energética ideal para tu hogar, negocio o industria.",
}: ContactCtaProps) {
  return (
    <section className="relative overflow-hidden bg-lukx-black text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lukx-green to-transparent" />
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">Hablemos</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[1.08]">{title}</h2>
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{subtitle}</p>
          <div data-reveal className="mt-9 flex flex-wrap gap-3">
            <Link href="/agendar" className="btn-green">
              Agendar asesoría <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/contacto" className="btn-outline">Contáctanos</Link>
          </div>
        </div>
        <dl data-stagger className="grid gap-6 border-t border-white/15 pt-8 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Oficina</dt>
            <dd className="mt-1"><a className="link-underline text-lg" href={`tel:${site.phoneOfficeTel}`}>{site.phoneOffice}</a></dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Celular / WhatsApp</dt>
            <dd className="mt-1"><a className="link-underline text-lg" href={site.whatsapp} target="_blank" rel="noreferrer">{site.phoneMobile}</a></dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-white/50">Correo</dt>
            <dd className="mt-1"><a className="link-underline text-lg" href={`mailto:${site.email}`}>{site.email}</a></dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
