import { NextResponse } from "next/server";
import { BookingError, MSG, logBookingError } from "@/lib/booking-error";
import { signLeadToken } from "@/lib/lead-token";
import { saveWebLead } from "@/lib/odoo";
import { cleanUtm, normalizeEmailAddress, normalizePersonName, normalizeWhatsAppMx } from "@/lib/phone";
import { allowLeadWrite, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
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
    const saved = await saveWebLead({
      name,
      email,
      whatsapp,
      utmSource: cleanUtm(record.utm_source),
      utmMedium: cleanUtm(record.utm_medium),
      utmCampaign: cleanUtm(record.utm_campaign),
    });
    const leadToken = signLeadToken(saved.leadId, saved.partnerId);
    return NextResponse.json({ leadToken });
  } catch (err) {
    if (err instanceof BookingError) return fail(err.status, err.message);
    logBookingError("lead", err);
    return fail(502, MSG.save);
  }
}
