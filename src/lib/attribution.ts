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

type DataLayerValue = string | number | boolean | Record<string, string> | undefined;
type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function pushDataLayer(event: string, params: Record<string, DataLayerValue> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

/** Teléfono a E.164: 10 dígitos de México → +52…; si ya trae + o lada 52, se respeta. */
export function normalizePhoneE164(raw: string): string {
  const value = (raw || "").trim();
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (value.startsWith("+")) return digits.length >= 8 ? `+${digits}` : "";
  if (digits.length === 10) return `+52${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return `+${digits}`;
  if (digits.length === 13 && digits.startsWith("521")) return `+52${digits.slice(3)}`;
  if (digits.length === 14 && digits.startsWith("0052")) return `+${digits.slice(2)}`;
  return "";
}

/**
 * Datos para Conversiones Avanzadas de Google Ads en `generate_lead`:
 * `email`/`phone` en el nivel superior y `user_data` con los nombres de GTM.
 * Solo incluye los campos con valor.
 */
export function leadUserData(email: string, phone: string): Record<string, DataLayerValue> {
  const emailAddress = (email || "").trim().toLowerCase();
  const phoneNumber = normalizePhoneE164(phone);
  const out: Record<string, DataLayerValue> = {};
  const userData: Record<string, string> = {};
  if (emailAddress) {
    out.email = emailAddress;
    userData.email_address = emailAddress;
  }
  if (phoneNumber) {
    out.phone = phoneNumber;
    userData.phone_number = phoneNumber;
  }
  if (Object.keys(userData).length) out.user_data = userData;
  return out;
}
