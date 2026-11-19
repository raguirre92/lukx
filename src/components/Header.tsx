"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navMain, site } from "@/data/site";
import { SolutionsMega, SolutionsMobileList, SolutionsTrigger } from "@/components/SolutionsMenu";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const closeMenuTimer = useRef<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-[#1a1a1a] transition-shadow duration-300 data-[scrolled=true]:shadow-lg data-[scrolled=true]:shadow-black/25"
      data-scrolled={scrolled || open}
      onMouseEnter={() => {
        if (closeMenuTimer.current) window.clearTimeout(closeMenuTimer.current);
      }}
      onMouseLeave={() => {
        if (!window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) return;
        closeMenuTimer.current = window.setTimeout(() => setSolutionsOpen(false), 160);
      }}
    >
      <button
        type="button"
        className="mega-backdrop fixed inset-0 z-0"
        data-open={solutionsOpen}
        aria-hidden={!solutionsOpen}
        aria-label="Cerrar soluciones"
        tabIndex={-1}
        onClick={() => setSolutionsOpen(false)}
      />
      <div className="relative z-30 mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-4 md:h-[88px] md:gap-6 md:px-8 xl:px-10">
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
              <span key={item.label} className="contents">
                <SolutionsTrigger
                  open={solutionsOpen}
                  active={item.children.some((child) => isActive(child.href))}
                  onOpen={() => setSolutionsOpen(true)}
                  onToggle={() => setSolutionsOpen((value) => !value)}
                />
                <SolutionsMega
                  open={solutionsOpen}
                  pathname={pathname}
                  onOpenChange={setSolutionsOpen}
                />
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link nav-item px-2.5 py-2 text-[13px] font-medium xl:px-4 xl:text-[14px]"
                data-active={isActive(item.href) ? "true" : "false"}
                onMouseEnter={() => setSolutionsOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden shrink-0 items-center lg:flex">
          <Link href="/agendar" className="btn-green !px-4 xl:!px-[22px]">
            Agendar asesoría
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
                {solutionsOpen ? <SolutionsMobileList pathname={pathname} /> : null}
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
          <Link href="/agendar" className="btn-green mt-4 w-full">
            Agendar asesoría
          </Link>
        </div>
      ) : null}
    </header>
  );
}
