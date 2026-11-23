import { NextResponse } from "next/server";
import { BookingError, MSG, logBookingError } from "@/lib/booking-error";
import { signLeadToken } from "@/lib/lead-token";
import { CIUDADES } from "@/lib/agendar-config";
import { saveWebLead } from "@/lib/odoo";
import { cleanUtm, normalizeEmailAddress, normalizePersonName, normalizeWhatsAppMx } from "@/lib/phone";
import { allowLeadWrite, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function cleanText(value: unknown, max = 80) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
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
  const whatsapp =
    typeof record.whatsapp === "string" ? normalizeWhatsAppMx(record.whatsapp) : null;
  if (!whatsapp) return fail(400, MSG.whatsapp);
  if (record.privacyAccepted !== true) return fail(400, MSG.privacy);
  if (!process.env.LEAD_SIGNING_SECRET?.trim()) return fail(503, MSG.calendar);

  try {
    const pagina = cleanText(record.pagina, 40);
    if (!pagina) return fail(400, "No pudimos identificar la página de agenda.");
    const respuestas = record.respuestas && typeof record.respuestas === "object" ? record.respuestas as Record<string, unknown> : {};
    const ciudad = cleanText(respuestas["Ciudad o municipio"] ?? record.ciudad, 80);
    if (!CIUDADES.includes(ciudad as (typeof CIUDADES)[number])) return fail(400, "Elige tu ciudad.");
    const necesidad = cleanText(
      respuestas["¿Qué te interesa?"] ?? respuestas["Tipo de proyecto"] ?? record.necesidad,
      160,
    );
    const detalle = [`Página de agenda: ${pagina}`, `Necesidad: ${necesidad || "No indicada"}`, `Ciudad: ${ciudad}`];
    for (const [key, value] of Object.entries(respuestas)) {
      const text = cleanText(value, 300);
      if (!text || key === "Ciudad o municipio") continue;
      detalle.push(`${key}: ${text}`);
    }
    const atribucion = record.atribucion && typeof record.atribucion === "object" ? record.atribucion as Record<string, unknown> : {};
    for (const [key, value] of Object.entries(atribucion)) {
      const text = cleanText(value, 300);
      if (text) detalle.push(`${key}: ${text}`);
    }

    const saved = await saveWebLead({
      name,
      email,
      whatsapp,
      utmSource: cleanUtm(record.utm_source),
      utmMedium: cleanUtm(record.utm_medium),
      utmCampaign: cleanUtm(record.utm_campaign),
      pagina,
      necesidad,
      ciudad,
      detalle,
    });
    const leadToken = signLeadToken(saved.leadId, saved.partnerId);
    return NextResponse.json({ leadToken });
  } catch (err) {
    if (err instanceof BookingError) return fail(err.status, err.message);
    logBookingError("lead", err);
    return fail(502, MSG.save);
  }
}
