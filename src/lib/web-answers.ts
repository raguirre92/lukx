/**
 * Respuestas del sitio web → campos x_web_* de crm.lead.
 * Las claves de selección deben coincidir con las creadas en Odoo (25 nov 2026).
 */
import { RANGOS_LUZ_COMERCIAL, RANGOS_LUZ_INDUSTRIAL, RANGOS_LUZ_META } from "@/lib/agendar-config";

export type WebFieldValue = string | false;
export type WebFields = Record<string, WebFieldValue>;

export const FORMULARIOS = ["cotizador", "agendar", "salida", "contacto"] as const;
export type Formulario = (typeof FORMULARIOS)[number];

/** Campos que dependen de la solución elegida; se limpian cuando el cotizador cambia de solución. */
export const SOLUTION_WEB_FIELDS = [
  "x_web_tiene_paneles",
  "x_web_sistema_actual",
  "x_web_sistema_actual_otro",
  "x_web_equipos",
  "x_web_areas_iluminar",
  "x_web_necesidad_iluminacion",
  "x_web_necesidad_iluminacion_otro",
  "x_web_uso_cargadores",
  "x_web_vehiculos",
  "x_web_periodo_recibo",
] as const;

const TRACKING_MAX = 250;
const TEXT_MAX = 250;

const TIENE_PANELES: Record<string, string> = { "Sí": "si", Si: "si", No: "no" };
const SISTEMA_ACTUAL: Record<string, string> = {
  "Ampliar mi sistema": "ampliar",
  "Revisar o renovar mi sistema": "revisar",
  "Necesito asesoría": "asesoria",
  Otro: "otro",
};
const NECESIDAD_ILUMINACION: Record<string, string> = {
  "Una instalación nueva": "nueva",
  "Renovar la iluminación actual": "renovar",
  "Necesito asesoría": "asesoria",
  Otro: "otro",
};
const VEHICULOS: Record<string, string> = {
  "1 vehículo": "1",
  "De 2 a 5 vehículos": "2_5",
  "Más de 5 vehículos": "mas_5",
  "Aún no lo sé": "no_se",
};

const Q = {
  tienePaneles: ["¿Ya tienes paneles solares?"],
  sistemaActual: ["¿Qué necesitas para tu sistema actual?"],
  sistemaActualOtro: ["¿Qué necesitas hacer con tu sistema de paneles?"],
  equipos: ["¿Qué equipos necesitas mantener funcionando?", "¿Qué equipos o procesos necesitas respaldar?"],
  equiposOtro: ["¿Qué otros equipos o procesos necesitas respaldar?"],
  areas: ["¿Qué áreas necesitas iluminar?"],
  areasOtro: ["¿Qué otra área necesitas iluminar?"],
  iluminacion: ["¿Qué necesitas para la iluminación?"],
  iluminacionOtro: ["¿Qué más necesitas para la iluminación?"],
  uso: ["¿Quién usará las estaciones de carga?"],
  usoOtro: ["¿Quién más usará las estaciones de carga?"],
  vehiculos: ["¿Cuántos vehículos necesitas cargar al mismo tiempo?"],
  reciboMes: ["¿Cuánto pagas de luz al mes, aproximadamente?"],
} as const;

function clean(value: unknown, max = TEXT_MAX): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function answer(respuestas: Record<string, unknown>, keys: readonly string[], max = TEXT_MAX): string {
  for (const key of keys) {
    const value = clean(respuestas[key], max);
    if (value) return value;
  }
  return "";
}

function multi(respuestas: Record<string, unknown>, keys: readonly string[], otherKeys: readonly string[]): string {
  const base = answer(respuestas, keys, 400);
  if (!base) return "";
  const parts = base.split(";").map((item) => item.trim()).filter(Boolean);
  const other = answer(respuestas, otherKeys);
  if (other) parts.push(`Otro: ${other}`);
  return parts.join("; ").slice(0, TEXT_MAX);
}

export function periodoRecibo(recibo: string, respuestas: Record<string, unknown> = {}): "bimestral" | "mensual" | "" {
  const value = recibo.trim();
  if (!value || value === "No lo sé") return "";
  if (/al bimestre/i.test(value)) return "bimestral";
  if (/al mes/i.test(value)) return "mensual";
  if ((RANGOS_LUZ_COMERCIAL as readonly string[]).includes(value) || (RANGOS_LUZ_INDUSTRIAL as readonly string[]).includes(value)) return "mensual";
  if ((RANGOS_LUZ_META as readonly string[]).includes(value)) {
    return Q.reciboMes.some((key) => clean(respuestas[key]) === value) ? "mensual" : "bimestral";
  }
  return "";
}

export function formularioFor(raw: unknown, contact: boolean): Formulario | "" {
  const value = typeof raw === "string" ? raw.trim() : "";
  if ((FORMULARIOS as readonly string[]).includes(value)) return value as Formulario;
  return contact ? "contacto" : "";
}

/** Respuestas del cotizador. Solo incluye campos con valor. */
export function answerFields(respuestas: Record<string, unknown>, recibo: string): WebFields {
  const out: WebFields = {};
  const set = (field: string, value: string) => {
    if (value) out[field] = value;
  };
  set("x_web_tiene_paneles", TIENE_PANELES[answer(respuestas, Q.tienePaneles)] ?? "");
  set("x_web_sistema_actual", SISTEMA_ACTUAL[answer(respuestas, Q.sistemaActual)] ?? "");
  set("x_web_sistema_actual_otro", answer(respuestas, Q.sistemaActualOtro));
  set("x_web_equipos", multi(respuestas, Q.equipos, Q.equiposOtro));
  set("x_web_areas_iluminar", multi(respuestas, Q.areas, Q.areasOtro));
  set("x_web_necesidad_iluminacion", NECESIDAD_ILUMINACION[answer(respuestas, Q.iluminacion)] ?? "");
  set("x_web_necesidad_iluminacion_otro", answer(respuestas, Q.iluminacionOtro));
  set("x_web_uso_cargadores", multi(respuestas, Q.uso, Q.usoOtro));
  set("x_web_vehiculos", VEHICULOS[answer(respuestas, Q.vehiculos)] ?? "");
  set("x_web_periodo_recibo", periodoRecibo(recibo, respuestas));
  return out;
}

const TRACKING: Record<string, string> = {
  landing: "x_web_landing_url",
  referrer: "x_web_referrer",
  gclid: "x_web_gclid",
  fbclid: "x_web_fbclid",
  gbraid: "x_web_gbraid",
  wbraid: "x_web_wbraid",
  utm_source: "x_web_utm_source",
  utm_medium: "x_web_utm_medium",
  utm_term: "x_web_utm_term",
  utm_content: "x_web_utm_content",
};

/** Atribución del navegador; lee `atribucion` y, de respaldo, las claves sueltas del cuerpo. */
export function trackingFields(record: Record<string, unknown>): { fields: WebFields; utmCampaign: string } {
  const atribucion = record.atribucion && typeof record.atribucion === "object"
    ? record.atribucion as Record<string, unknown>
    : {};
  const pick = (key: string) => clean(atribucion[key], TRACKING_MAX) || clean(record[key], TRACKING_MAX);
  const fields: WebFields = {};
  for (const [key, field] of Object.entries(TRACKING)) {
    const value = pick(key);
    if (value) fields[field] = value;
  }
  return { fields, utmCampaign: pick("utm_campaign").slice(0, 100) };
}

export function pageField(pagina: string): string {
  return clean(pagina, 120);
}

/** Texto plano → HTML seguro para crm.lead.description, una línea por <br>. */
export function textToHtml(text: string): string {
  const escape = (line: string) =>
    line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const lines = text.replace(/\r/g, "").split("\n").map((line) => line.trim());
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  while (lines.length && !lines[0]) lines.shift();
  if (!lines.length) return "";
  return `<p>${lines.map(escape).join("<br>")}</p>`;
}

export type LeadOrigin = "organico" | "google_ads" | "chatgpt_ads";
export const ANUNCIOS = ["Residencial", "Comercial", "Industrial"] as const;
export type Anuncio = (typeof ANUNCIOS)[number];

function fold(value: unknown): string {
  return typeof value === "string"
    ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    : "";
}

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paid_search", "sem", "ads"]);

function isPaidMedium(medium: unknown): boolean {
  return PAID_MEDIUMS.has(fold(medium).replace(/[\s-]+/g, "_"));
}

/**
 * Origen del lead con la atribución de primer contacto del navegador.
 * Google Ads: gclid/gbraid/wbraid, o utm_source google/adwords con medio pagado.
 * ChatGPT Ads: utm_source chatgpt/openai con medio pagado. Lo demás es orgánico,
 * incluidos los enlaces de chatgpt.com que llegan con utm_source=chatgpt.com sin medio pagado.
 */
export function leadOrigin(attr: Record<string, unknown>): LeadOrigin {
  const source = fold(attr.utm_source);
  const paid = isPaidMedium(attr.utm_medium);
  const clickId = ["gclid", "gbraid", "wbraid"].some((key) => typeof attr[key] === "string" && (attr[key] as string).trim());
  if (clickId || (paid && /google|adwords/.test(source))) return "google_ads";
  if (paid && /chatgpt|openai/.test(source)) return "chatgpt_ads";
  return "organico";
}

/** utm_content → Residencial/Comercial/Industrial; si no se reconoce, usa el sector del lead. */
export function anuncioFor(utmContent: unknown, sector: string): Anuncio | "" {
  const content = fold(utmContent);
  if (content.includes("resid")) return "Residencial";
  if (content.includes("comerc")) return "Comercial";
  if (content.includes("indust")) return "Industrial";
  return (ANUNCIOS as readonly string[]).includes(sector) ? (sector as Anuncio) : "";
}

/** Atribución combinada: el objeto `atribucion` manda; las claves sueltas del cuerpo son respaldo. */
export function attributionOf(record: Record<string, unknown>): Record<string, string> {
  const atribucion = record.atribucion && typeof record.atribucion === "object"
    ? record.atribucion as Record<string, unknown>
    : {};
  const out: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid"]) {
    out[key] = clean(atribucion[key], TRACKING_MAX) || clean(record[key], TRACKING_MAX);
  }
  return out;
}
