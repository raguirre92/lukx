"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { navSolutions, navSpaces } from "@/data/site";

const solutionDetails: Record<string, { icon: string; description: string }> = {
  "/paneles-solares": {
    icon: "solar:sun-linear",
    description: "Diseño e instalación de sistemas solares según tu consumo.",
  },
  "/sistemas-de-respaldo-de-energia-en-baterias": {
    icon: "solar:battery-charge-linear",
    description: "Energía de respaldo con baterías para cuando se va la luz.",
  },
  "/iluminacion": {
    icon: "solar:lightbulb-linear",
    description: "Proyectos de iluminación del diseño a la instalación.",
  },
  "/estaciones-de-carga": {
    icon: "solar:plug-circle-linear",
    description: "Instalación de cargadores para vehículos eléctricos.",
  },
};

const spaceIcons: Record<string, string> = {
  "/residencial": "solar:home-2-linear",
  "/comercial": "solar:shop-linear",
  "/industrial": "solar:buildings-2-linear",
};

const menuGroups = [
  { label: "Por espacio", items: navSpaces },
  { label: "Por solución", items: navSolutions },
];

const menuItems = [...navSpaces, ...navSolutions];

type Props = {
  open: boolean;
  pathname: string;
  onOpenChange: (open: boolean) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

export function SolutionsTrigger({
  open,
  active,
  onOpen,
  onToggle,
  onLeave,
}: {
  open: boolean;
  active: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onLeave: () => void;
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
      onMouseLeave={onLeave}
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

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function menuIndex(href: string) {
  return menuItems.findIndex((entry) => entry.href === href);
}

export function SolutionsMega({ open, pathname, onOpenChange, onHoverStart, onHoverEnd }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const fromKeys = useRef(false);
  const [active, setActive] = useState(0);
  const current = menuItems[active] ?? menuItems[0];

  useEffect(() => {
    const match = menuItems.findIndex((item) => isCurrentPath(pathname, item.href));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match >= 0) setActive(match);
  }, [pathname, open]);

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
      className="mega-panel fixed inset-x-0 top-[72px] z-20 hidden bg-[#141414] md:top-[88px] lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)] lg:items-start"
      data-open={open}
      inert={!open}
      aria-hidden={!open}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div ref={listRef} className="px-8 pb-8 pt-8 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Por espacio</p>
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {navSpaces.map((item) => {
            const index = menuIndex(item.href);
            const currentPath = isCurrentPath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-2.5 p-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                  data-active={currentPath ? "true" : "false"}
                  data-current={index === active ? "true" : "false"}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <Icon
                    icon={spaceIcons[item.href] ?? "solar:map-point-linear"}
                    width={20}
                    className={`shrink-0 ${currentPath ? "text-lukx-green" : "text-white/55 group-hover:text-white"}`}
                    aria-hidden
                  />
                  <span
                    className={`text-[15px] font-semibold ${
                      currentPath ? "text-lukx-green" : "text-white/90 group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="my-5 h-px bg-white/10" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Por solución</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {navSolutions.map((item) => {
            const index = menuIndex(item.href);
            const detail = solutionDetails[item.href];
            const currentPath = isCurrentPath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex gap-3 p-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                  data-active={currentPath ? "true" : "false"}
                  data-current={index === active ? "true" : "false"}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                >
                  <Icon
                    icon={detail?.icon ?? "solar:widget-linear"}
                    width={22}
                    className={`mt-0.5 shrink-0 ${currentPath ? "text-lukx-green" : "text-white/55 group-hover:text-white"}`}
                    aria-hidden
                  />
                  <span>
                    <span
                      className={`block text-[15px] font-semibold ${
                        currentPath ? "text-lukx-green" : "text-white/90 group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-white/55">{detail?.description}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative mt-8 mr-8 mb-8 min-h-[340px] self-start overflow-hidden border border-white/10">
        {menuItems.map((item, index) => (
          <div key={item.href} className="mega-photo absolute inset-0" data-active={index === active}>
            <Image src={item.image} alt="" fill sizes="34vw" className="object-cover" priority />
          </div>
        ))}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,0) 80%)",
          }}
          aria-hidden
        />
        <Link href={current.href} tabIndex={-1} aria-hidden className="absolute inset-0 z-10" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-8"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,.7)" }}
        >
          <p className="font-display text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.9] text-white">{current.label}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">{current.summary}</p>
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
          <ul className="grid gap-1">
            {group.items.map((item) => {
              const currentPath = isCurrentPath(pathname, item.href);
              const description = solutionDetails[item.href]?.description;
              const icon = solutionDetails[item.href]?.icon ?? spaceIcons[item.href] ?? "solar:widget-linear";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-3 px-1 py-2"
                    data-active={currentPath ? "true" : "false"}
                  >
                    <Icon
                      icon={icon}
                      width={20}
                      className={`mt-0.5 shrink-0 ${currentPath ? "text-lukx-green" : "text-white/55"}`}
                      aria-hidden
                    />
                    <span>
                      <span className={`block text-sm font-semibold ${currentPath ? "text-lukx-green" : "text-white"}`}>
                        {item.label}
                      </span>
                      {description ? (
                        <span className="mt-0.5 block text-xs leading-snug text-white/55">{description}</span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
