export function normalizeWhatsAppMx(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || !/^[0-9+\s-]+$/.test(trimmed)) return null;
  const compact = trimmed.replace(/[\s-]/g, "");
  let national: string;
  if (compact.startsWith("+")) {
    if (!/^52\d{10}$/.test(compact.slice(1))) return null;
    national = compact.slice(3);
  } else if (/^52\d{10}$/.test(compact)) {
    national = compact.slice(2);
  } else if (/^\d{10}$/.test(compact)) {
    national = compact;
  } else {
    return null;
  }
  return `+52${national}`;
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
