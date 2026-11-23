"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import type { BookingPage } from "@/lib/booking-pages";

const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"] as const;
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

type Step = "datos" | "horario" | "lista";
type Slot = { start: string; stop: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function timeLabel(iso: string) {
  return iso.slice(11, 16);
}

function longDate(iso: string) {
  const day = Number(iso.slice(8, 10));
  const month = Number(iso.slice(5, 7));
  const year = Number(iso.slice(0, 4));
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<{ y: number; m: number; d: number } | null> = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let day = 1; day <= count; day += 1) cells.push({ y: year, m: month, d: day });
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { y: next.getUTCFullYear(), m: next.getUTCMonth() + 1 };
}

export default function BookingScheduler({
  page,
  initialNeed = "",
  resumeToken = null,
  onScheduled,
}: {
  page?: BookingPage;
  initialNeed?: string;
  resumeToken?: string | null;
  onScheduled?: () => void;
}) {
  const [step, setStep] = useState<Step>(resumeToken ? "horario" : "datos");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [need, setNeed] = useState(page?.needs.some((item) => item.value === initialNeed) ? initialNeed : "");
  const [city, setCity] = useState("");
  const [extra, setExtra] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [leadToken, setLeadToken] = useState<string | null>(resumeToken);
  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Slot | null>(null);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = dayKey(slot.start);
      const list = map.get(key) ?? [];
      list.push(slot);
      map.set(key, list);
    }
    return map;
  }, [slots]);

  const cells = useMemo(
    () => (cursor ? monthCells(cursor.y, cursor.m) : []),
    [cursor],
  );
  const daySlots = selectedDay ? (byDay.get(selectedDay) ?? []) : [];

  useEffect(() => {
    if (resumeToken) void loadSlots();
  }, [resumeToken]);

  async function loadSlots() {
    setLoadingSlots(true);
    try {
      const res = await fetch("/api/disponibilidad", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        timezone?: string;
        slots?: Slot[];
      };
      if (!res.ok) {
        throw new Error(data.error || "No pudimos consultar los horarios.");
      }
      const next = data.slots ?? [];
      setSlots(next);
      setTimezone(data.timezone || "America/Mexico_City");
      setSelectedDay(null);
      setSelectedStart(null);
      if (next[0]) {
        setCursor({
          y: Number(next[0].start.slice(0, 4)),
          m: Number(next[0].start.slice(5, 7)),
        });
      }
      return next;
    } catch (err) {
      setSlots([]);
      setError(err instanceof Error ? err.message : "No pudimos consultar los horarios.");
      return [];
    } finally {
      setLoadingSlots(false);
    }
  }

  async function onLead(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          privacyAccepted,
          lukx_hp: honeypot,
          utm_source: params.get("utm_source") ?? "",
          utm_medium: params.get("utm_medium") ?? "",
          utm_campaign: params.get("utm_campaign") ?? "",
          pagina: page?.id ?? "",
          necesidad: need,
          ciudad: city,
          tipoNegocio: page?.extra?.name === "tipoNegocio" ? extra : "",
          tipoPlanta: page?.extra?.name === "tipoPlanta" ? extra : "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        leadToken?: string;
      };
      if (!res.ok) throw new Error(data.error || "No pudimos guardar tus datos.");
      if (!data.leadToken) {
        throw new Error("No pudimos continuar. Recarga la página e inténtalo de nuevo.");
      }
      setLeadToken(data.leadToken);
      setStep("horario");
      await loadSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onBook(event: FormEvent) {
    event.preventDefault();
    if (!leadToken || !selectedStart) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadToken, start: selectedStart }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        start?: string;
        stop?: string;
      };
      if (res.status === 409) {
        setError(data.error || "Ese horario ya fue tomado. Elige otro.");
        setSelectedStart(null);
        setStep("horario");
        await loadSlots();
        return;
      }
      if (res.status === 401) {
        setLeadToken(null);
        setStep("datos");
        throw new Error(data.error || "Tu sesión expiró. Vuelve a dejar tus datos para agendar.");
      }
      if (!res.ok || !data.start || !data.stop) {
        throw new Error(data.error || "No pudimos confirmar la cita.");
      }
      setConfirmed({ start: data.start, stop: data.stop });
      setStep("lista");
      onScheduled?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos confirmar la cita.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "lista" && confirmed) {
    const first = name.trim().split(" ")[0] || "";
    return (
      <div className="bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:p-8">
        <p className="font-display text-3xl leading-none text-lukx-charcoal md:text-4xl">
          CITA RESERVADA
        </p>
        <p className="mt-4 text-sm leading-relaxed text-lukx-muted md:text-base">
          Gracias{first ? `, ${first}` : ""}. Tu asesoría quedó agendada el{" "}
          <strong className="font-semibold text-lukx-charcoal">{longDate(confirmed.start)}</strong>{" "}
          a las{" "}
          <strong className="font-semibold text-lukx-charcoal">{timeLabel(confirmed.start)}</strong>{" "}
          (hora del centro de México).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <div className="flex gap-2 border-b border-black/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted md:px-6">
        <span className={step === "datos" ? "text-lukx-charcoal" : undefined}>Datos</span>
        <span aria-hidden>›</span>
        <span className={step === "horario" ? "text-lukx-charcoal" : undefined}>Fecha y hora</span>
        <span aria-hidden>›</span>
        <span>Confirmación</span>
      </div>

      {step === "datos" ? (
        <form onSubmit={onLead} className="relative grid gap-8 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-6">
          <div className="space-y-4">
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="lukx_hp">Sitio web</label>
              <input
                id="lukx_hp"
                name="lukx_hp"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="bk-name" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                Nombre completo
              </label>
              <input
                id="bk-name"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              />
            </div>
            <div>
              <label htmlFor="bk-email" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                Correo electrónico
              </label>
              <input
                id="bk-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              />
            </div>
            <div>
              <label htmlFor="bk-phone" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                WhatsApp
              </label>
              <input
                id="bk-phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="81 1234 5678"
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              />
            </div>
            <div>
              <label htmlFor="bk-need" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                ¿Qué quieres revisar?
              </label>
              <select
                id="bk-need"
                required
                value={need}
                onChange={(event) => setNeed(event.target.value)}
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              >
                <option value="">Elige una opción</option>
                {(page?.needs ?? []).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            {page?.city ? (
              <div>
                <label htmlFor="bk-city" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                  Ciudad
                </label>
                <input
                  id="bk-city"
                  required
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Monterrey"
                  className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
                />
              </div>
            ) : null}
            {page?.extra ? (
              <div>
                <label htmlFor="bk-extra" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                  {page?.extra?.label}
                </label>
                <input
                  id="bk-extra"
                  required
                  value={extra}
                  onChange={(event) => setExtra(event.target.value)}
                  placeholder={page?.extra?.placeholder}
                  className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
                />
              </div>
            ) : null}
            <label className="flex items-start gap-3 text-sm text-lukx-charcoal">
              <input
                type="checkbox"
                required
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
                className="mt-1"
              />
              <span>
                Acepto el{" "}
                <a
                  href={site.privacyPdf}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lukx-green-btn underline"
                >
                  Aviso de Privacidad
                </a>
              </span>
            </label>
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" disabled={submitting} className="btn-green disabled:opacity-50">
              {submitting ? "Guardando…" : "Continuar"}
            </button>
          </div>
          <aside className="border border-black/10 bg-lukx-light/60 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted">
              Resumen
            </p>
            <ul className="mt-4 space-y-2 text-sm text-lukx-charcoal">
              <li>Llamada o videollamada</li>
              <li>Zona horaria: America/Mexico_City</li>
              <li>Tus datos quedan registrados al continuar, aunque todavía no elijas horario.</li>
            </ul>
          </aside>
        </form>
      ) : (
        <form onSubmit={onBook} className="grid gap-8 p-5 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold capitalize text-lukx-charcoal">
                {cursor ? `${MONTHS[cursor.m - 1]} ${cursor.y}` : "Horarios"}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => cursor && setCursor(shiftMonth(cursor.y, cursor.m, -1))}
                  className="flex h-9 w-9 items-center justify-center border border-black/15 text-lukx-charcoal transition hover:border-lukx-green hover:text-lukx-green"
                  aria-label="Mes anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => cursor && setCursor(shiftMonth(cursor.y, cursor.m, 1))}
                  className="flex h-9 w-9 items-center justify-center border border-black/15 text-lukx-charcoal transition hover:border-lukx-green hover:text-lukx-green"
                  aria-label="Mes siguiente"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-lukx-muted">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, index) => {
                if (!day) return <div key={`e-${index}`} />;
                const key = `${day.y}-${pad(day.m)}-${pad(day.d)}`;
                const available = byDay.has(key);
                const selected = selectedDay === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSelectedDay(key);
                      setSelectedStart(null);
                      setError(null);
                    }}
                    className={`aspect-square text-sm transition ${
                      selected
                        ? "bg-lukx-green text-white"
                        : available
                          ? "border border-lukx-green/40 text-lukx-charcoal hover:bg-lukx-green/10"
                          : "text-black/25"
                    }`}
                  >
                    {day.d}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-lukx-muted">Zona horaria: {timezone}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-lukx-charcoal">Selecciona una hora</p>
            {loadingSlots ? (
              <p className="mt-3 text-sm text-lukx-muted">Cargando horarios…</p>
            ) : slots.length === 0 ? (
              <div className="mt-3 text-sm leading-relaxed text-lukx-muted">
                <p>
                  Por ahora no hay horarios libres en los próximos días. Escríbenos y te ayudamos a
                  encontrar un espacio.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="/contacto"
                    className="inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.12em] text-lukx-green-btn"
                  >
                    Contacto
                  </a>
                </div>
              </div>
            ) : !selectedDay ? (
              <p className="mt-3 text-sm text-lukx-muted">Primero elige un día en el calendario.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {daySlots.map((slot) => {
                  const active = selectedStart === slot.start;
                  return (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => {
                        setSelectedStart(slot.start);
                        setError(null);
                      }}
                      className={`border px-3 py-3 text-sm font-medium transition ${
                        active
                          ? "border-lukx-green bg-lukx-green text-white"
                          : "border-black/15 text-lukx-green-btn hover:border-lukx-green"
                      }`}
                    >
                      {timeLabel(slot.start)}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 border-t border-black/10 pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted">
                Detalles de la reunión
              </p>
              <ul className="mt-3 space-y-2 text-sm text-lukx-charcoal">
                <li>Llamada o videollamada</li>
                {selectedStart ? (
                  <li className="font-medium text-lukx-green-btn">
                    {longDate(selectedStart)} · {timeLabel(selectedStart)}
                  </li>
                ) : null}
              </ul>
              {error ? (
                <p className="mt-4 text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("datos");
                    setError(null);
                  }}
                  className="border border-black/20 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-lukx-charcoal transition hover:border-lukx-charcoal"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={!selectedStart || submitting}
                  className="btn-green disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Confirmando…" : "Confirmar cita"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
