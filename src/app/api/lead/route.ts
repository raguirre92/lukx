import { NextResponse } from "next/server";
import { BookingError, MSG, logBookingError } from "@/lib/booking-error";
import { toOdooUtc } from "@/lib/cdmx";
import { signLeadToken } from "@/lib/lead-token";
import { CIUDADES, RANGOS_RECIBO_ACEPTADOS } from "@/lib/agendar-config";
import {
  cityLabel,
  cleanComment,
  emptyPendingFields,
  sectorForPage,
  type PendingLeadFields,
} from "@/lib/lead-mapping";
import { saveWebLead } from "@/lib/odoo";
import {
  SOLUTION_WEB_FIELDS,
  answerFields,
  anuncioFor,
  attributionOf,
  formularioFor,
  leadOrigin,
  pageField,
  trackingFields,
  type WebFields,
} from "@/lib/web-answers";
import { normalizeEmailAddress, normalizePersonName, normalizeWhatsAppMx } from "@/lib/phone";
import { allowLeadWrite, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function cleanText(value: unknown, max = 160) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

function isContact(pagina: string) {
  return pagina === "/contacto" || pagina === "contacto";
}

function pendingFrom(record: Record<string, unknown>, respuestas: Record<string, unknown>, privacyAccepted: boolean): PendingLeadFields {
  const pending = emptyPendingFields();
  const atribucion = record.atribucion && typeof record.atribucion === "object"
    ? record.atribucion as Record<string, unknown>
    : {};
  const pick = (key: keyof PendingLeadFields, ...sources: unknown[]) => {
    for (const source of sources) {
      const text = cleanText(source, 300);
      if (text) {
        pending[key] = text;
        return;
      }
    }
  };
  pick("tienePaneles", respuestas["¿Ya tienes paneles solares?"]);
  pick("motivo", respuestas["¿Qué te motiva más?"]);
  pick("propietario", respuestas["¿Eres dueño de la casa?"]);
  pick("empresa", respuestas.Empresa);
  pick("puesto", respuestas.Puesto);
  pick("plazo", respuestas["¿Cuándo planeas hacerlo?"]);
  pick("tipoNegocio", respuestas["Tipo de negocio"], respuestas["¿Qué tipo de negocio tienes?"], record.tipoNegocio);
  pick("tipoPlanta", respuestas["Tipo de planta"], respuestas["Tipo de planta o nave"], respuestas["¿Qué tipo de instalación tienes?"], respuestas["Tipo de planta/nave"], record.tipoPlanta);
  pick("decideCompra", respuestas["¿Eres quien decide la compra?"], respuestas["¿El inmueble es propio o rentado?"], respuestas["¿Eres propietario o administras el inmueble?"]);
  pick("tarifaCfe", respuestas["¿Qué tarifa de CFE tienes?"]);
  pick("rol", respuestas["¿Cuál es tu rol?"]);
  pick("espacio", respuestas["¿Para qué tipo de espacio es?"]);
  pick("tamanoNave", respuestas["Tamaño aproximado de la nave o del consumo"]);
  pick("landing", atribucion.landing);
  pick("referrer", atribucion.referrer);
  pick("gclid", atribucion.gclid, record.gclid);
  pick("gbraid", atribucion.gbraid, record.gbraid);
  pick("wbraid", atribucion.wbraid, record.wbraid);
  pick("fbclid", atribucion.fbclid, record.fbclid);
  pick("utm_source", atribucion.utm_source, record.utm_source);
  pick("utm_medium", atribucion.utm_medium, record.utm_medium);
  pick("utm_campaign", atribucion.utm_campaign, record.utm_campaign);
  pick("utm_term", atribucion.utm_term, record.utm_term);
  pick("utm_content", atribucion.utm_content, record.utm_content);
  if (privacyAccepted) pending.avisoPrivacidadEn = toOdooUtc(new Date());
  return pending;
}

export async function POST(request: Request) {
  if (!allowLeadWrite(clientIp(request))) {
    return fail(429, MSG.rate);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, MSG.invalidJson);
  }
  if (!body || typeof body !== "object") return fail(400, MSG.invalidJson);
  const record = body as Record<string, unknown>;

  const honeypot = record.lukx_hp;
  if (typeof honeypot === "string" ? honeypot.trim().length > 0 : Boolean(honeypot)) {
    return NextResponse.json({ ok: true });
  }

  const name = normalizePersonName(record.name);
  if (!name) return fail(400, MSG.name);
  const email = normalizeEmailAddress(record.email);
  if (!email) return fail(400, MSG.email);

  const pagina = cleanText(record.pagina, 40);
  if (!pagina) return fail(400, "No pudimos identificar la página de agenda.");
  const contact = isContact(pagina);
  const rawPhone = typeof record.whatsapp === "string" ? record.whatsapp.trim() : "";
  let whatsapp = "";
  if (rawPhone) {
    const normalized = normalizeWhatsAppMx(rawPhone);
    if (!normalized) return fail(400, MSG.whatsapp);
    whatsapp = normalized;
  } else if (!contact) {
    return fail(400, MSG.whatsapp);
  }
  const privacyAccepted = record.privacyAccepted === true;
  if (!contact && !privacyAccepted) return fail(400, MSG.privacy);
  if (!process.env.LEAD_SIGNING_SECRET?.trim()) return fail(503, MSG.calendar);

  try {
    const respuestas = record.respuestas && typeof record.respuestas === "object"
      ? record.respuestas as Record<string, unknown>
      : {};
    const cityRaw = cleanText(respuestas["Ciudad o municipio"] ?? record.ciudad, 80);
    if (cityRaw && !CIUDADES.includes(cityRaw as (typeof CIUDADES)[number]) && cityRaw !== "Monterrey y área metropolitana" && cityRaw !== "Otra") {
      return fail(400, "Elige tu ciudad.");
    }
    const recibo = cleanText(
      record.recibo
        ?? respuestas["¿Cuánto pagas de luz al bimestre, aproximadamente?"]
        ?? respuestas["¿Cuánto pagas de luz al mes, aproximadamente?"]
        ?? respuestas["¿Cuánto pagas de luz, aproximadamente?"],
      80,
    );
    if (recibo && !RANGOS_RECIBO_ACEPTADOS.includes(recibo as (typeof RANGOS_RECIBO_ACEPTADOS)[number])) {
      return fail(400, "Elige un rango de tu recibo.");
    }
    const space = cleanText(
      respuestas["¿Dónde sería el proyecto?"]
        ?? respuestas["¿Para qué espacio es tu proyecto?"]
        ?? respuestas["¿Para qué tipo de espacio es?"],
      160,
    );
    const solution = cleanText(
      respuestas["¿Qué te interesa?"] ?? respuestas["Tipo de proyecto"] ?? record.necesidad,
      160,
    );
    const rawComment = [record.mensaje, respuestas.Comentarios, respuestas.Mensaje].find((item) => typeof item === "string") ?? "";
    const comment = cleanComment(rawComment);
    if (contact && !comment) return fail(400, "Escribe tu mensaje.");

    const replaceSolutionDetails = record.replaceSolutionDetails === true && ["Paneles solares", "Sistemas de respaldo", "Ambos", "Iluminación", "Estaciones de carga"].includes(solution);
    const tracking = trackingFields(record);
    const webFields: WebFields = { ...answerFields(respuestas, recibo) };
    if (replaceSolutionDetails) {
      for (const field of SOLUTION_WEB_FIELDS) if (!(field in webFields)) webFields[field] = false;
    }
    const formulario = formularioFor(record.formulario, contact);
    if (formulario) webFields.x_web_formulario = formulario;
    const page = pageField(pagina);
    if (page) webFields.x_web_pagina = page;
    Object.assign(webFields, tracking.fields);
    const sector = sectorForPage(pagina, space);
    const attribution = attributionOf(record);

    const saved = await saveWebLead({
      name,
      email,
      whatsapp,
      city: cityRaw === "Otro" ? cleanText(respuestas["Otra ciudad o municipio"], 120) || cityLabel(cityRaw) : cityLabel(cityRaw),
      cityChosen: Boolean(cityRaw),
      sector,
      comment,
      solution,
      recibo,
      replaceSolutionDetails,
      contact,
      pendingFields: pendingFrom(record, respuestas, privacyAccepted),
      webFields,
      utmCampaign: tracking.utmCampaign,
      origin: leadOrigin(attribution),
      anuncio: anuncioFor(attribution.utm_content, sector),
      privacyAcceptedAt: privacyAccepted ? toOdooUtc(new Date()) : "",
    });
    const leadToken = signLeadToken(saved.leadId, saved.partnerId);
    return NextResponse.json({ leadToken });
  } catch (err) {
    if (err instanceof BookingError) return fail(err.status, err.message);
    logBookingError("lead", err);
    return fail(502, MSG.save);
  }
}
