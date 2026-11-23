"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { navSolutions, navSpaces } from "@/data/site";

const menuGroups = [
  { label: "Por espacio", items: navSpaces },
  { label: "Por solución", items: navSolutions },
];

const menuItems = menuGroups.flatMap((group) => group.items);

type Props = {
  open: boolean;
  pathname: string;
  onOpenChange: (open: boolean) => void;
};

export function SolutionsTrigger({
  open,
  active,
  onOpen,
  onToggle,
}: {
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const openedAt = useRef(0);

  return (
    <button
      type="button"
      className="nav-link nav-item flex items-center gap-1.5 px-2.5 py-2 text-[13px] font-medium xl:px-4 xl:text-[14px]"
      aria-expanded={open}
      aria-controls="soluciones-mega"
      data-active={active || open ? "true" : "false"}
      onMouseEnter={() => {
        openedAt.current = performance.now();
        onOpen();
      }}
      onClick={() => {
        if (open && performance.now() - openedAt.current > 350) onToggle();
        else onOpen();
      }}
    >
      Soluciones
      <Icon
        icon="solar:alt-arrow-down-linear"
        width={14}
        className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "rotate-180" : ""}`}
        aria-hidden
      />
    </button>
  );
}

export function SolutionsMega({ open, pathname, onOpenChange }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const fromKeys = useRef(false);
  const [active, setActive] = useState(0);
  const [marker, setMarker] = useState({ y: 0, h: 56 });
  const current = menuItems[active] ?? menuItems[0];

  useEffect(() => {
    const match = menuItems.findIndex((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match >= 0) setActive(match);
  }, [pathname, open]);

  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelectorAll("a")[active];
    if (!list || !link) return;
    const listBox = list.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    setMarker({ y: linkBox.top - listBox.top, h: linkBox.height });
  }, [active, open]);

  useEffect(() => {
    if (!open || !fromKeys.current) return;
    const link = listRef.current?.querySelectorAll("a")[active];
    link?.focus({ preventScroll: true });
    fromKeys.current = false;
  }, [active, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      event.preventDefault();
      fromKeys.current = true;
      setActive((index) => {
        const next = event.key === "ArrowDown" ? index + 1 : index - 1;
        return (next + menuItems.length) % menuItems.length;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div
      id="soluciones-mega"
      className="mega-panel fixed inset-x-0 top-[72px] z-20 hidden h-[min(520px,70vh)] grid-cols-[1.15fr_0.85fr] bg-[#141414] md:top-[88px] lg:grid"
      data-open={open}
      inert={!open}
      aria-hidden={!open}
    >
      <div className="relative min-h-0 overflow-hidden">
        {menuItems.map((item, index) => (
          <div key={item.href} className="mega-photo absolute inset-0" data-active={index === active}>
            <Image
              src={item.image}
              alt=""
              fill
              sizes="60vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/25 to-transparent" />
        <Link
          href={current.href}
          tabIndex={-1}
          aria-hidden
          className="absolute inset-0 z-10"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-8 md:p-10">
          <p className="font-display text-[clamp(3.2rem,6vw,5.4rem)] leading-[0.9] text-white">
            {current.label}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">{current.summary}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col justify-center overflow-y-auto px-8 py-8 md:px-12">
        <div className="relative">
        <span
          className="mega-marker absolute left-0 top-0 w-[3px] bg-lukx-green"
          style={{ height: marker.h, transform: `translateY(${marker.y}px)` }}
          aria-hidden
        />
        <div ref={listRef} className="flex flex-col gap-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="pl-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => {
                  const index = menuItems.findIndex((entry) => entry.href === item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`mega-row nav-link flex items-center justify-between gap-4 py-3 pl-6 pr-2 text-[15px] font-medium ${
                          index === active ? "translate-x-2" : ""
                        }`}
                        data-active={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "true" : "false"}
                        data-current={index === active ? "true" : "false"}
                        onMouseEnter={() => setActive(index)}
                        onFocus={() => setActive(index)}
                      >
                        {item.label}
                        <Icon
                          icon="solar:arrow-right-linear"
                          width={18}
                          className={`shrink-0 transition-transform duration-500 ${index === active ? "translate-x-1 text-lukx-green" : "text-white/30"}`}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export function SolutionsMobileList({ pathname }: { pathname: string }) {
  return (
    <div className="grid gap-4 pb-2">
      {menuGroups.map((group) => (
        <div key={group.label}>
          <p className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
            {group.label}
          </p>
          <ul className="grid gap-2">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link flex items-center gap-3 py-1"
                  data-active={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "true" : "false"}
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden">
                    <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-white/60">{item.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
