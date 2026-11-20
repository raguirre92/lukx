import Image from "next/image";
import Link from "next/link";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  image: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function PageHero({
  title,
  subtitle,
  image,
  ctaHref = "/agendar",
  ctaLabel = "Agendar asesoría",
  secondaryHref = "/contacto",
  secondaryLabel = "Contacto",
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-lukx-black pt-24 md:min-h-[76vh]">
      <Image src={image} alt="" fill priority className="kenburns object-cover object-center" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-14 md:px-10 md:pb-20">
        <p className="eyebrow lead-hero-copy">Lukx · Monterrey</p>
        <div className="lead-hero-copy">
          <h1 className="mt-5 max-w-5xl font-display text-[clamp(3rem,8vw,7rem)] leading-[1.08] text-white">{title}</h1>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/85 md:text-base">{subtitle}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaHref} className="btn-green">
              {ctaLabel} <span className="arrow" aria-hidden>→</span>
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref} className="btn-outline">{secondaryLabel}</Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
