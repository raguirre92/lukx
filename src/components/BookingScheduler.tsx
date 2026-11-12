"use client";

import { useMemo, useState, type FormEvent } from "react";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] as const;
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

type Step = "schedule" | "details" | "done";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isBookableDay(d: Date, today: Date) {
  const day = d.getDay(); // 0 Sun
  if (day === 0) return false;
  return startOfDay(d) >= today;
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  // Monday-first index
  const mondayIndex = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < mondayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function BookingScheduler() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("schedule");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cells = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const canGoDetails = Boolean(selectedDate && selectedTime);

  function prevMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/agendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date: toISODate(selectedDate),
          time: selectedTime,
          timezone: "America/Mexico_City",
          durationMinutes: 60,
          source: "lukx-web/agendar",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "No se pudo agendar. Intenta de nuevo.");
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done" && selectedDate && selectedTime) {
    return (
      <div className="bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:p-8">
        <p className="font-display text-3xl leading-none text-lukx-charcoal md:text-4xl">
          CITA RESERVADA
        </p>
        <p className="mt-4 text-sm leading-relaxed text-lukx-muted md:text-base">
          Gracias, {name.split(" ")[0]}. Te esperamos el{" "}
          <strong className="font-semibold text-lukx-charcoal">
            {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
          </strong>{" "}
          a las <strong className="font-semibold text-lukx-charcoal">{selectedTime}</strong>{" "}
          (America/Mexico_City). Te llegará confirmación por correo.
        </p>
        <button
          type="button"
          className="btn-green mt-8"
          onClick={() => {
            setStep("schedule");
            setSelectedDate(null);
            setSelectedTime(null);
            setName("");
            setEmail("");
            setPhone("");
          }}
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <div className="flex gap-2 border-b border-black/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted md:px-6">
        <span className={step === "schedule" ? "text-lukx-charcoal" : undefined}>
          Fecha y hora
        </span>
        <span aria-hidden>›</span>
        <span className={step === "details" ? "text-lukx-charcoal" : undefined}>
          Detalles
        </span>
        <span aria-hidden>›</span>
        <span>Reservada</span>
      </div>

      {step === "schedule" ? (
        <div className="grid gap-8 p-5 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:p-6">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold capitalize text-lukx-charcoal">
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-9 w-9 items-center justify-center border border-black/15 text-lukx-charcoal transition hover:border-lukx-green hover:text-lukx-green"
                  aria-label="Mes anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-9 w-9 items-center justify-center border border-black/15 text-lukx-charcoal transition hover:border-lukx-green hover:text-lukx-green"
                  aria-label="Mes siguiente"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-lukx-muted">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const bookable = isBookableDay(day, today);
                const selected = selectedDate ? isSameDay(day, selectedDate) : false;
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={!bookable}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null);
                    }}
                    className={`aspect-square text-sm transition ${
                      selected
                        ? "bg-lukx-green text-white"
                        : bookable
                          ? "border border-lukx-green/40 text-lukx-charcoal hover:bg-lukx-green/10"
                          : "text-black/25"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-lukx-muted">
              Zona horaria: America/Mexico_City
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-lukx-charcoal">
              Selecciona una hora
            </p>
            {!selectedDate ? (
              <p className="mt-3 text-sm text-lukx-muted">
                Primero elige un día en el calendario.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`border px-3 py-3 text-sm font-medium transition ${
                        active
                          ? "border-lukx-green bg-lukx-green text-white"
                          : "border-black/15 text-lukx-green-btn hover:border-lukx-green"
                      }`}
                    >
                      {slot}
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
                <li>En línea · Videollamada</li>
                <li>1 hora</li>
                {selectedDate && selectedTime ? (
                  <li className="font-medium text-lukx-green-btn">
                    {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} ·{" "}
                    {selectedTime}
                  </li>
                ) : null}
              </ul>
              <button
                type="button"
                disabled={!canGoDetails}
                onClick={() => setStep("details")}
                className="btn-green mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-8 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="bk-name" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                Nombre completo
              </label>
              <input
                id="bk-name"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              />
            </div>
            <div>
              <label htmlFor="bk-phone" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
                Número de teléfono
              </label>
              <input
                id="bk-phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52"
                className="w-full border border-black/15 bg-white px-3 py-3 text-sm text-lukx-charcoal outline-none transition focus:border-lukx-green"
              />
            </div>
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("schedule")}
                className="border border-black/20 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-lukx-charcoal transition hover:border-lukx-charcoal"
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-green disabled:opacity-50"
              >
                {submitting ? "Enviando…" : "Confirmar cita"}
              </button>
            </div>
          </div>

          <aside className="border border-black/10 bg-lukx-light/60 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted">
              Resumen
            </p>
            <ul className="mt-4 space-y-2 text-sm text-lukx-charcoal">
              <li>Videollamada · 1 hora</li>
              {selectedDate ? (
                <li>
                  {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}{" "}
                  {selectedDate.getFullYear()}
                </li>
              ) : null}
              {selectedTime ? <li>{selectedTime} · America/Mexico_City</li> : null}
            </ul>
          </aside>
        </form>
      )}
    </div>
  );
}
