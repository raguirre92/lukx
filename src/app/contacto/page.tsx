import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";
import { brandedPage } from "@/lib/seo";

export const metadata: Metadata = brandedPage({
  title: "Contacto",
  description:
    "Contacta a Lukx: Oficina +52 81 8340 1975, Celular +52 81 1524 9123, hola@lukx.com.mx. Miguel Nieto#306, Nuevas colonias, Monterrey.",
  path: "/contacto",
});

const contactItems = [
  {
    label: "Oficina",
    value: site.phoneOffice,
    href: `tel:${site.phoneOfficeTel}`,
  },
  {
    label: "Celular",
    value: site.phoneMobile,
    href: `tel:${site.phoneMobileTel}`,
  },
  {
    label: "Correo",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    label: "Dirección",
    value: site.address,
    href: "https://maps.google.com/?q=Miguel+Nieto+306+Nuevas+colonias+Monterrey",
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contacto"
        subtitle="Estamos listos para ayudarte a diseñar tu solución energética."
        image="/images/2025-12-WhatsApp-Image-2025-07-07-at-3.58.27-PM-1.jpeg"
        ctaHref={site.whatsapp}
        ctaLabel="WhatsApp"
        secondaryHref="/agendar"
        secondaryLabel="Agendar asesoría"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div data-stagger className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Hablemos de tu proyecto"
              subtitle="Oficina, celular, correo o visita. Elige el canal que prefieras."
            />
            <ul className="mt-10 space-y-6">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lukx-green">
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    target={item.label === "Dirección" ? "_blank" : undefined}
                    rel={item.label === "Dirección" ? "noreferrer" : undefined}
                    className="mt-1 block text-lg text-lukx-charcoal transition-colors hover:text-lukx-green md:text-xl"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/agendar" className="btn-green mt-10 inline-flex">
              Prefiero agendar una videollamada <span className="arrow" aria-hidden>→</span>
            </Link>
          </div>

          <div className="bg-lukx-light p-6 md:p-10">
            <h2 className="font-display text-4xl text-lukx-charcoal md:text-5xl">
              Envíanos un mensaje
            </h2>
            <p className="mt-3 text-sm text-lukx-muted md:text-base">
              Completa el formulario y un asesor te contactará a la brevedad.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
