const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

const STORAGE_KEY = "lukx_attr_v1";
const COOKIE = "lukx_attr";
const MAX_AGE = 60 * 60 * 24 * 90;

export type Attribution = Record<(typeof KEYS)[number] | "landing" | "referrer", string>;

function empty(): Attribution {
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    gclid: "",
    gbraid: "",
    wbraid: "",
    fbclid: "",
    landing: "",
    referrer: "",
  };
}

function readCookie(): Attribution | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Attribution;
  } catch {
    return null;
  }
}

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return empty();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...empty(), ...JSON.parse(stored) };
  } catch {
    /* ignore broken storage */
  }
  return readCookie() ?? empty();
}

function save(value: Attribution) {
  const json = JSON.stringify(value);
  window.localStorage.setItem(STORAGE_KEY, json);
  document.cookie = `${COOKIE}=${encodeURIComponent(json)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
}

export function captureAttribution(): Attribution {
  const current = readAttribution();
  const params = new URLSearchParams(window.location.search);
  const next = { ...current };
  const fresh = !current.landing;
  if (fresh) {
    next.landing = window.location.href;
    next.referrer = document.referrer || "";
  }
  for (const key of KEYS) {
    const incoming = params.get(key);
    if (incoming && (fresh || !next[key])) next[key] = incoming;
  }
  save(next);
  return next;
}

export function pushDataLayer(event: string, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const layer = (window as Window & { dataLayer?: Record<string, string>[] }).dataLayer ?? [];
  layer.push({ event, ...params });
  (window as Window & { dataLayer?: Record<string, string>[] }).dataLayer = layer;
}
