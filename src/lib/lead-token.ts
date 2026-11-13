import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { BookingError, MSG } from "@/lib/booking-error";

export type LeadToken = {
  leadId: number;
  partnerId: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.LEAD_SIGNING_SECRET?.trim();
  if (!value) throw new BookingError(503, MSG.calendar);
  return value;
}

export function signLeadToken(leadId: number, partnerId: number, now = Date.now()): string {
  const body = Buffer.from(
    JSON.stringify({ leadId, partnerId, exp: now + DAY_MS }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyLeadToken(token: string): LeadToken | null {
  const key = process.env.LEAD_SIGNING_SECRET?.trim();
  if (!key) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expected = createHmac("sha256", key).update(body).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      leadId?: unknown;
      partnerId?: unknown;
      exp?: unknown;
    };
    if (
      typeof payload.leadId !== "number" ||
      typeof payload.partnerId !== "number" ||
      typeof payload.exp !== "number" ||
      !Number.isInteger(payload.leadId) ||
      !Number.isInteger(payload.partnerId)
    ) {
      return null;
    }
    if (payload.exp < Date.now()) return null;
    return { leadId: payload.leadId, partnerId: payload.partnerId };
  } catch {
    return null;
  }
}
