import { NextResponse } from "next/server";
import { INTERESES_CASA, RANGOS_LUZ_RESIDENCIAL } from "@/lib/agendar-config";
import { BookingError, MSG, logBookingError } from "@/lib/booking-error";
import { verifyLeadToken } from "@/lib/lead-token";
import { appendLeadAnswers } from "@/lib/odoo";
import { allowLeadWrite, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RANGOS = new Set<string>(RANGOS_LUZ_RESIDENCIAL);
const INTERESES = new Set<string>(INTERESES_CASA);

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function clean(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 80);
}

export async function POST(request: Request) {
  if (!allowLeadWrite(clientIp(request))) return fail(429, MSG.rate);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, MSG.invalidJson);
  }
  if (!body || typeof body !== "object") return fail(400, MSG.invalidJson);
  const record = body as Record<string, unknown>;
  const token = typeof record.leadToken === "string" ? verifyLeadToken(record.leadToken) : null;
  if (!token) return fail(401, MSG.expired);

  const recibo = clean(record.recibo);
  const interes = clean(record.interes);
  if (recibo && !RANGOS.has(recibo)) return fail(400, "Elige un rango de tu recibo.");
  if (interes && !INTERESES.has(interes)) return fail(400, "Elige qué te interesa.");
  if (!recibo && !interes) return fail(400, "Falta la respuesta para actualizar tu solicitud.");

  const lines: string[] = [];
  if (recibo) lines.push(`¿Cuánto pagas de luz al bimestre?: ${recibo}`);
  if (interes) lines.push(`¿Qué te interesa?: ${interes}`);

  try {
    await appendLeadAnswers({ leadId: token.leadId, partnerId: token.partnerId, lines });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof BookingError) return fail(err.status, err.message);
    logBookingError("lead-detalle", err);
    return fail(502, MSG.save);
  }
}
