import Image from "next/image";
import Link from "next/link";
import { navMain, navSolutions, navSpaces, site } from "@/data/site";

const socials = [
  { label: "Instagram", href: site.social.instagram, icon: "/icons/instagram.svg" },
  { label: "Facebook", href: site.social.facebook, icon: "/icons/facebook.svg" },
  { label: "LinkedIn", href: site.social.linkedin, icon: "/icons/linkedin.svg" },
];

export default function Footer() {
  return (
    <footer className="bg-lukx-charcoal text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-4 md:py-16">
        <div className="flex items-start">
          <Link href="/" aria-label="Lukx">
            <Image
              src={site.logos.verticalWhite}
              alt="Lukx"
              width={140}
              height={140}
              className="h-24 w-auto"
            />
          </Link>
        </div>

        <div>
          <h2 className="font-display text-3xl tracking-wide">Contacto</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/85">
            <li>
              <a href={`tel:${site.phoneOfficeTel}`} className="hover:text-lukx-green">
                Oficina: {site.phoneOffice}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneMobileTel}`} className="hover:text-lukx-green">
                Celular : {site.phoneMobile}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-lukx-green">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href="https://maps.google.com/?q=Miguel+Nieto+306+Nuevas+colonias+Monterrey"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lukx-green"
              >
                {site.address}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-3xl tracking-wide">Mapa del sitio</h2>
          <nav className="mt-5 grid gap-2 text-sm text-white/85">
            {navMain
              .filter((i) => !i.children)
              .map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-lukx-green">
                  {item.label}
                </Link>
              ))}
            <p className="pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Por espacio
            </p>
            {navSpaces.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-lukx-green">
                {item.label}
              </Link>
            ))}
            <p className="pt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Por solución
            </p>
            {navSolutions.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-lukx-green">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-display text-3xl tracking-wide">Síguenos en nuestras redes</h2>
          <div className="mt-5 flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:border-lukx-green hover:bg-lukx-green"
              >
                <img src={social.icon} alt="" width={20} height={20} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/55 md:flex-row">
          <p>© {new Date().getFullYear()} Lukx. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href={site.privacyPdf} target="_blank" rel="noreferrer" className="hover:text-white">
              Aviso de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
