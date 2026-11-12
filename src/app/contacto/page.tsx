import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Lukx: Oficina +52 81 8340 1975, Celular +52 81 1524 9123, hola@lukx.com.mx. Miguel Nieto#306, Nuevas colonias, Monterrey.",
};

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
          </div>

          <div className="bg-lukx-light p-6 md:p-10">
            <h2 className="font-display text-4xl text-lukx-charcoal md:text-5xl">
              Envíanos un mensaje
            </h2>
            <p className="mt-3 text-sm text-lukx-muted md:text-base">
              Completa el formulario y un asesor te contactará a la brevedad.
            </p>
            <form
              className="mt-8 space-y-4"
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
            >
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-lukx-green focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                  Correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-lukx-green focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-lukx-green focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-lukx-charcoal"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-lukx-green focus:ring-2"
                />
              </div>
              <button type="submit" className="btn-green w-full">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
