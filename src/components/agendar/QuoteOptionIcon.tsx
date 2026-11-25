import type { ReactNode } from "react";

const shapes = {
  store: <><path d="M4 10v11h16V10M3 6l2-3h14l2 3v4H3V6ZM9 21v-7h6v7M3 6h18M7 6v4m5-4v4m5-4v4" /></>,
  office: <><rect x="5" y="3" width="14" height="10" rx="1" /><path d="M12 13v4m-4 0h8M2 18h20M5 18v4m14-4v4" /></>,
  warehouse: <><path d="m3 8 9-5 9 5v13H3V8ZM7 21v-7h10v7M7 10h10M7 17h10m-5-3v7" /></>,
  facade: <><path d="M4 21V3h16v18M2 21h20M10 21v-5h4v5M8 7h1m6 0h1M8 11h1m6 0h1" /></>,
  parking: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 18V6h4a3 3 0 0 1 0 6H9" /></>,
  outdoors: <><path d="m13 3 5 7h-3l4 6H7l4-6H8l5-7ZM13 16v5M4 21h17" /><circle cx="4" cy="5" r="2" /></>,
  factory: <><path d="M3 21V10l6 4v-4l6 4V3h4v18H3ZM7 18h1m3 0h1m3 0h1" /></>,
  yard: <><path d="M2 6h12v11H2V6Zm12 4h4l4 4v3h-8M4 3h13m0 0-2-2m2 2-2 2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  dock: <><path d="M2 21V3h13v5M5 5h7v12H5V5Zm0 4h7M2 21h20M9 17h13M14 11h5l3 3v3h-8v-6ZM7 17v4m3-4v4" /><circle cx="18" cy="18" r="1.5" /></>,
  frontage: <><path d="M3 21V6h10v15M1 21h22M6 10h1m2 0h1M6 14h1m2 0h1M6 21v-4h4v4M18 14v7m-3-3 3-3 3 3" /><circle cx="19" cy="5" r="2" /></>,
  fridge: <><rect x="6" y="2" width="12" height="19" rx="2" /><path d="M6 9h12M9 5v1m0 7v3M8 21v1m8-1v1" /></>,
  router: <><rect x="3" y="14" width="18" height="7" rx="2" /><path d="M6 14V9m12 5V9M8 7a6 6 0 0 1 8 0M5 4a10 10 0 0 1 14 0M7 18h.1m4 0h.1" /></>,
  bulb: <><path d="M8 15a7 7 0 1 1 8 0l-1 3H9l-1-3ZM9 21h6M12 18v-6m-2-2 2 2 2-2" /></>,
  computer: <><rect x="3" y="3" width="18" height="13" rx="2" /><path d="M12 16v5m-5 0h10M7 7h10m-10 3h7" /></>,
  ac: <><rect x="3" y="4" width="18" height="10" rx="2" /><path d="M3 10h18M7 13h10M7 17v3m5-3v4m5-4v3" /></>,
  checkout: <><path d="m5 3 12 2-2 8-12-2 2-8ZM10 12v4M3 16h17v5H3v-5Zm11 0v-3h5l2 3M6 19h3m5 0h3" /></>,
  controls: <><path d="M5 2v7m0 4v9M12 2v12m0 4v4M19 2v3m0 4v13" /><circle cx="5" cy="11" r="2" /><circle cx="12" cy="16" r="2" /><circle cx="19" cy="7" r="2" /></>,
  people: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4v3" /></>,
  fleet: <><path d="M2 7h12v10H2V7Zm12 4h4l4 4v2h-8M5 3h12v4" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  badge: <><rect x="4" y="4" width="16" height="18" rx="2" /><path d="M9 2h6v5H9V2ZM8 19a4 4 0 0 1 8 0" /><circle cx="12" cy="12" r="2" /></>,
  charger: <><rect x="3" y="2" width="11" height="19" rx="2" /><rect x="6" y="5" width="5" height="5" rx="0.5" /><path d="M1 22h15M14 13h2v5a2 2 0 0 0 4 0V9l-3-3m0-3 3 3v4M8 13l-2 3h4l-2 3" /></>,
  other: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M12 7v10M7 12h10" /></>,
} satisfies Record<string, ReactNode>;

function kind(option: string): keyof typeof shapes {
  if (/estaciones? de carga/i.test(option)) return "charger";
  if (/otros?|adicional/i.test(option)) return "other";
  if (/ventas|atención/i.test(option)) return "store";
  if (/oficinas/i.test(option)) return "office";
  if (/bodega|almacén/i.test(option)) return "warehouse";
  if (/andenes/i.test(option)) return "dock";
  if (/patio/i.test(option)) return "yard";
  if (/estacionamiento/i.test(option)) return "parking";
  if (/fachada y exteriores/i.test(option)) return "frontage";
  if (/fachada/i.test(option)) return "facade";
  if (/exteriores/i.test(option)) return "outdoors";
  if (/nave|producción/i.test(option)) return "factory";
  if (/refriger/i.test(option)) return "fridge";
  if (/internet|comunicaciones/i.test(option)) return "router";
  if (/iluminación/i.test(option)) return "bulb";
  if (/computadoras|TV/i.test(option)) return "computer";
  if (/aire acondicionado/i.test(option)) return "ac";
  if (/punto de venta/i.test(option)) return "checkout";
  if (/control/i.test(option)) return "controls";
  if (/clientes|visitantes/i.test(option)) return "people";
  if (/flotilla/i.test(option)) return "fleet";
  if (/personal/i.test(option)) return "badge";
  return "other";
}

export default function QuoteOptionIcon({ option, className }: { option: string; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>{shapes[kind(option)]}</svg>;
}
