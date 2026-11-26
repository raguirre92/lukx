import Link from "next/link";
import { site } from "@/data/site";

type ContactCtaProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  primaryHref?: string;
  primaryLabel?: string;
  items?: string[];
  backgroundImage?: string;
};

export default function ContactCta({
  title = "Agenda tu asesoría",
  subtitle = "Revisamos tu caso, te decimos qué solución conviene y armamos el siguiente paso: visita o propuesta. Sin compromiso de compra.",
  eyebrow = "Siguiente paso",
  primaryHref = "/agendar",
  primaryLabel = "Agendar asesoría",
  items,
  backgroundImage,
}: ContactCtaProps) {
  return (
    <section
      className="relative overflow-hidden bg-lukx-black bg-cover bg-center text-white"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.78) 38%, rgba(0,0,0,.42) 100%)",
          }}
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lukx-green to-transparent" />
      <div className="site-container relative grid gap-8 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-10">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2
            className={`${eyebrow ? "mt-4" : ""} font-display ${
              title.length > 70
                ? "text-[clamp(1.7rem,2.8vw,2.35rem)] leading-[1.12]"
                : "text-[clamp(2.75rem,6vw,5rem)] leading-[1.02]"
            }`}
          >
            {title}
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">{subtitle}</p>
          {items?.length ? (
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              {items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-lukx-green" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          <div data-reveal className="mt-7 flex flex-wrap gap-3">
            <Link href={primaryHref} className="btn-green">
              {primaryLabel} <span className="arrow" aria-hidden>→</span>
            </Link>
            <Link href="/contacto" className="btn-outline">Contacto</Link>
          </div>
        </div>
        <dl data-stagger className="grid gap-5 border-t border-white/15 pt-6 text-sm">
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
