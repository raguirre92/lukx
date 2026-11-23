import { site } from "@/data/site";

// TODO: el spec marca el número comercial como pendiente. Se usa el teléfono y el WhatsApp ya publicados.
export const ASESORIA_PHONE_DISPLAY = site.phoneOffice;
export const ASESORIA_PHONE_TEL = site.phoneOfficeTel;
export const ASESORIA_WHATSAPP = site.whatsapp;

// Lista del formulario de Meta, más Ramos Arizpe y Otro. «Otro» se guarda vacío en Odoo.
export const CIUDADES = [
  "Monterrey",
  "Saltillo",
  "Apodaca",
  "Escobedo",
  "San Nicolás",
  "Guadalupe",
  "García",
  "Juárez",
  "Santa Catarina",
  "San Pedro",
  "Salinas",
  "Cadereyta",
  "Ramos Arizpe",
  "Otro",
] as const;

// Textos exactos del formulario de Meta. Van a x_studio_gasto_en_recibo_de_luz.
export const RANGOS_LUZ_META = [
  "Entre 0 y 3,000 pesos",
  "Entre 3,001 y 6,000 pesos",
  "Entre 6,001 y 10,000 pesos",
  "Más de 10,000 pesos",
] as const;

export const RANGOS_LUZ: readonly string[] = RANGOS_LUZ_META;
export const RANGOS_LUZ_RESIDENCIAL = RANGOS_LUZ_META;

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
