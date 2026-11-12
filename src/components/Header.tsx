"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navMain, site } from "@/data/site";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-[#1a1a1a] transition-shadow duration-300 data-[scrolled=true]:shadow-lg data-[scrolled=true]:shadow-black/25"
      data-scrolled={scrolled || open}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 md:h-[88px] md:gap-6 md:px-8 xl:px-10">
        <Link href="/" className="relative z-10 shrink-0">
          <Image
            src={site.logos.horizontalWhite}
            alt="Lukx"
            width={150}
            height={44}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-0 lg:flex">
          {navMain.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button
                  type="button"
                  className="nav-link flex items-center gap-1.5 px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-4 xl:text-[14px]"
                  data-active={
                    item.children.some((c) => isActive(c.href)) || solutionsOpen
                      ? "true"
                      : "false"
                  }
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden>
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute left-1/2 top-full z-50 min-w-[230px] -translate-x-1/2 bg-[#222] py-2 shadow-2xl transition ${
                    solutionsOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="nav-link block px-5 py-2.5 text-sm transition-colors hover:bg-white/5"
                      data-active={isActive(child.href) ? "true" : "false"}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-4 xl:text-[14px]"
                data-active={isActive(item.href) ? "true" : "false"}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden shrink-0 items-center lg:flex">
          <Link href="/contacto" className="btn-green !px-4 xl:!px-[22px]">
            Solicitar asesoría
          </Link>
        </div>

        <button
          type="button"
          className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open ? (
        <div className="max-h-[80vh] overflow-y-auto border-t border-white/10 bg-[#1a1a1a] px-4 pb-6 pt-2 lg:hidden">
          {navMain.map((item) =>
            item.children ? (
              <div key={item.label} className="border-b border-white/10 py-2">
                <button
                  type="button"
                  className="nav-link flex w-full items-center justify-between py-2 text-left"
                  onClick={() => setSolutionsOpen((v) => !v)}
                >
                  {item.label}
                  <span>{solutionsOpen ? "−" : "+"}</span>
                </button>
                {solutionsOpen
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="nav-link block py-2 pl-4 text-sm opacity-90"
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link block border-b border-white/10 py-3"
                data-active={isActive(item.href) ? "true" : "false"}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/contacto" className="btn-green mt-4 w-full">
            Solicitar asesoría
          </Link>
        </div>
      ) : null}
    </header>
  );
}
