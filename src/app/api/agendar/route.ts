import { NextResponse } from "next/server";

export const runtime = "nodejs";

type BookingBody = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  timezone?: string;
  durationMinutes?: number;
  source?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const date = body.date?.trim() ?? "";
  const time = body.time?.trim() ?? "";
  const timezone = body.timezone?.trim() || "America/Mexico_City";
  const durationMinutes = body.durationMinutes ?? 60;
  const source = body.source?.trim() || "lukx-web/agendar";

  if (!name || !email || !phone || !date || !time) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios." },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json(
      { error: "Fecha u hora inválida." },
      { status: 400 },
    );
  }

  const payload = {
    name,
    email,
    phone,
    date,
    time,
    timezone,
    durationMinutes,
    source,
    createdAt: new Date().toISOString(),
  };

  const webhook = process.env.BOOKING_WEBHOOK_URL?.trim();

  if (webhook) {
    try {
      const upstream = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.BOOKING_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.BOOKING_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!upstream.ok) {
        const text = await upstream.text().catch(() => "");
        console.error("Booking webhook failed", upstream.status, text);
        return NextResponse.json(
          { error: "No se pudo registrar la cita. Intenta más tarde." },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error("Booking webhook error", err);
      return NextResponse.json(
        { error: "No se pudo conectar con el calendario." },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV === "development") {
    console.info("[agendar] webhook no configurado; cita recibida:", payload);
  }

  return NextResponse.json({ ok: true, booking: payload });
}
