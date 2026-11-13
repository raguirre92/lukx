export type CivilDate = { y: number; m: number; d: number };

export function addCivilDays(y: number, m: number, d: number, days: number): CivilDate {
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return {
    y: next.getUTCFullYear(),
    m: next.getUTCMonth() + 1,
    d: next.getUTCDate(),
  };
}

export function getTimeZoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(date);
  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  if (name === "GMT" || name === "UTC") return 0;
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!match) throw new Error(`Sin desfase para ${timeZone}.`);
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? "0"));
}

export function civilParts(date: Date, timeZone: string): CivilDate & {
  hour: number;
  minute: number;
  second: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  let hour = Number(map.hour);
  let year = Number(map.year);
  let month = Number(map.month);
  let day = Number(map.day);
  if (hour === 24) {
    hour = 0;
    const next = addCivilDays(year, month, day, 1);
    year = next.y;
    month = next.m;
    day = next.d;
  }
  return {
    y: year,
    m: month,
    d: day,
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

export function zonedTimeToUtc(
  y: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const utcGuess = Date.UTC(y, month - 1, day, hour, minute, 0);
  const offset = getTimeZoneOffsetMinutes(new Date(utcGuess), timeZone);
  let instant = utcGuess - offset * 60_000;
  const corrected = getTimeZoneOffsetMinutes(new Date(instant), timeZone);
  if (corrected !== offset) instant = utcGuess - corrected * 60_000;
  return new Date(instant);
}

export function formatOffsetIso(date: Date, timeZone: string): string {
  const parts = civilParts(date, timeZone);
  const offset = getTimeZoneOffsetMinutes(date, timeZone);
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parts.y}-${pad(parts.m)}-${pad(parts.d)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

export function formatCdmxStamp(date: Date): string {
  const parts = civilParts(date, "America/Mexico_City");
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(parts.d)}/${pad(parts.m)}/${parts.y} ${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)} (America/Mexico_City)`;
}

/** Odoo appointment.slot weekday: '1' Monday … '7' Sunday. Gregorian, not the host zone. */
export function odooWeekday(y: number, m: number, d: number): string {
  const js = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return js === 0 ? "7" : String(js);
}

export function toOdooUtc(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function fromOdooUtc(value: string): Date {
  const trimmed = value.trim();
  const iso = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const zoned = /[zZ]|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const date = new Date(zoned);
  if (Number.isNaN(date.getTime())) throw new Error("Fecha de Odoo inválida.");
  return date;
}
