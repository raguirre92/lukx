import { site } from "@/data/site";

// TODO: el spec marca el número comercial como pendiente. Se usa el teléfono y el WhatsApp ya publicados.
export const ASESORIA_PHONE_DISPLAY = site.phoneOffice;
export const ASESORIA_PHONE_TEL = site.phoneOfficeTel;
export const ASESORIA_WHATSAPP = site.whatsapp;

export const CIUDADES = [
  "Monterrey y área metropolitana",
  "Saltillo",
  "Ramos Arizpe",
  "Otra",
] as const;

// TODO: rangos de recibo de CFE por definir. Hasta entonces el campo es texto libre.
export const RANGOS_LUZ: readonly string[] | null = null;

// TODO: rangos provisionales de /lp/residencial. Rafa tiene que aprobarlos antes de darlos por definitivos.
export const RANGOS_LUZ_RESIDENCIAL = [
  "Menos de $2,000",
  "$2,000–$5,000",
  "$5,000–$10,000",
  "Más de $10,000",
  "No sé",
] as const;

export const INTERESES_CASA = [
  "Paneles solares",
  "Baterías de respaldo",
  "Las dos",
  "No estoy seguro",
] as const;

// TODO: tipos de negocio por definir. Hasta entonces el campo es texto libre.
export const TIPOS_NEGOCIO: readonly string[] | null = null;

// TODO: pendiente de aprobación de Rafa. Propuesta incluida en el spec.
export const TIPOS_PROYECTO_INDUSTRIAL = [
  "Iluminación de nave o bodega",
  "Paneles solares",
  "Respaldo de energía",
  "Carga para vehículos eléctricos",
] as const;

export const SOLUCION_PRESELECT: Record<string, string> = {
  "paneles-solares": "Paneles solares",
  "sistemas-de-respaldo-de-energia-en-baterias": "Respaldo con baterías",
  iluminacion: "Proyecto de iluminación",
  "estaciones-de-carga": "Estación de carga",
};
