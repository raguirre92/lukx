/** +52 y exactamente 10 dígitos. Si el texto ya trae 52 o +52, no se vuelve a anteponer. */
export function normalizeWhatsAppMx(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || !/^[0-9+\s()-]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  while (digits.length > 10 && digits.startsWith("52")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (!/^\d{10}$/.test(digits)) return null;
  return `+52${digits}`;
}

export function normalizePersonName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 120) return null;
  return name;
}

export function normalizeEmailAddress(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim();
  if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function cleanUtm(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[\r\n\t]+/g, " ").trim().slice(0, 80);
}
