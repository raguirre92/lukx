/**
 * Mapeo de formularios web a crm.lead.
 * La sección «ACTUALIZACIÓN 23 nov 13:22» de odoo-mapeo-leads.md manda.
 * pendingFields se recolecta y no se envía: todavía no hay campos en Odoo.
 */

export const COMPANY_ID = 1;
export const TEAM_ID = 1;
export const SOURCE_WEB_ID = 51;
export const MEDIUM_WEB_ID = 1;
export const TAG_UNSCHEDULED = 25;
export const TAG_SCHEDULED = 26;
export const TAG_PANELES = 5;
export const TAG_RESPALDO = 16;
export const TAG_ILUMINACION = 14;
export const TAG_CARGA = 19;
export const TAG_OTRO = 20;
export const SOLUTION_TAG_IDS = [TAG_PANELES, TAG_RESPALDO, TAG_ILUMINACION, TAG_CARGA, TAG_OTRO] as const;
export const SOLUCION_RESPALDO = "Sistemas de respaldo";

export type TipoVenta = "Solar" | "Respaldo" | "Iluminacion" | "Cargador";

export type Sector = "Residencial" | "Comercial" | "Industrial";

export type PendingLeadFields = {
  tienePaneles: string;
  avisoPrivacidadEn: string;
  landing: string;
  referrer: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

const SLUG_TAGS: Record<string, number[]> = {
  "paneles-solares": [TAG_PANELES],
  "sistemas-de-respaldo-de-energia-en-baterias": [TAG_RESPALDO],
  "respaldo-baterias": [TAG_RESPALDO],
  respaldo: [TAG_RESPALDO],
  iluminacion: [TAG_ILUMINACION],
  "iluminacion-naves": [TAG_ILUMINACION],
  "estaciones-de-carga": [TAG_CARGA],
  "carga-flotilla": [TAG_CARGA],
  ambos: [TAG_PANELES, TAG_RESPALDO],
  "las dos": [TAG_PANELES, TAG_RESPALDO],
  "no-seguro": [TAG_OTRO],
  otro: [TAG_OTRO],
};

export function emptyPendingFields(): PendingLeadFields {
  return {
    tienePaneles: "",
    avisoPrivacidadEn: "",
    landing: "",
    referrer: "",
    gclid: "",
    gbraid: "",
    wbraid: "",
    fbclid: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  };
}

/** Identidad a propósito: conserva el objeto y evita mandarlo a execute_kw. */
export function holdPendingFields(fields: PendingLeadFields): PendingLeadFields {
  return fields;
}

export function cityLabel(value: string): string {
  const city = value.trim();
  if (!city || city === "Otro" || city === "Otra") return "";
  if (city === "Monterrey y área metropolitana") return "Monterrey";
  return city;
}

export function sectorFromSpace(space: string): Sector | "" {
  const value = space.trim().toLowerCase();
  if (!value || value === "otro" || value.startsWith("otro")) return "";
  if (value.startsWith("casa") || value.includes("residencial")) return "Residencial";
  if (value.startsWith("negocio") || value.includes("comercial") || value.includes("oficina")) return "Comercial";
  if (value.includes("industria") || value.includes("nave") || value.includes("bodega") || value.includes("planta")) {
    return "Industrial";
  }
  return "";
}

export function sectorForPage(pagina: string, space = ""): Sector | "" {
  const page = pagina.toLowerCase();
  if (page.includes("residencial")) return "Residencial";
  if (page.includes("comercial")) return "Comercial";
  if (page.includes("industrial")) return "Industrial";
  return sectorFromSpace(space);
}

export function solutionTagIds(raw: string): number[] {
  const value = raw.trim().toLowerCase();
  if (!value) return [];
  if (value === "las dos" || value === "ambos" || value.startsWith("las dos") || value.startsWith("ambos")) {
    return [TAG_PANELES, TAG_RESPALDO];
  }
  const slug = SLUG_TAGS[value];
  if (slug) return [...slug];
  if (/no estoy seguro|todav[ií]a no|no lo s[eé]|no-seguro|^otro$/.test(value)) return [TAG_OTRO];
  const tags = new Set<number>();
  if (value.includes("paneles")) tags.add(TAG_PANELES);
  if (value.includes("respaldo") || value.includes("bater")) tags.add(TAG_RESPALDO);
  if (value.includes("iluminaci")) tags.add(TAG_ILUMINACION);
  if (value.includes("carga") || value.includes("estacion")) tags.add(TAG_CARGA);
  return [...tags];
}

export function solutionIncludesRespaldo(raw: string): boolean {
  return solutionTagIds(raw).includes(TAG_RESPALDO);
}

export function tipoVentaFor(raw: string): TipoVenta | "" {
  const tags = solutionTagIds(raw);
  if (!tags.length || tags.includes(TAG_OTRO)) return "";
  if (tags.includes(TAG_PANELES)) return "Solar";
  if (tags.includes(TAG_RESPALDO)) return "Respaldo";
  if (tags.includes(TAG_ILUMINACION)) return "Iluminacion";
  if (tags.includes(TAG_CARGA)) return "Cargador";
  return "";
}

export function cleanComment(value: string): string {
  return value.replace(/\r/g, "").trim().slice(0, 4000);
}
