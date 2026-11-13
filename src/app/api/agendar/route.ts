import { NextResponse } from "next/server";
import { BookingError, MSG, logBookingError } from "@/lib/booking-error";
import { verifyLeadToken } from "@/lib/lead-token";
import { bookWebSlot } from "@/lib/odoo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  if (!process.env.LEAD_SIGNING_SECRET?.trim()) return fail(503, MSG.calendar);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, MSG.invalidJson);
  }
  if (!body || typeof body !== "object") return fail(400, MSG.invalidJson);
  const record = body as Record<string, unknown>;
  if (typeof record.leadToken !== "string" || typeof record.start !== "string") {
    return fail(400, MSG.badSlot);
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(record.start) || Number.isNaN(Date.parse(record.start))) {
    return fail(400, MSG.badSlot);
  }

  const token = verifyLeadToken(record.leadToken);
  if (!token) return fail(401, MSG.expired);

  try {
    const booked = await bookWebSlot({
      leadId: token.leadId,
      partnerId: token.partnerId,
      startIso: record.start,
    });
    return NextResponse.json({ ok: true, ...booked });
  } catch (err) {
    if (err instanceof BookingError) return fail(err.status, err.message);
    logBookingError("agendar", err);
    return fail(502, MSG.book);
  }
}
