export class BookingError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}

export const MSG = {
  invalidJson: "JSON inválido.",
  name: "Escribe tu nombre completo.",
  email: "Escribe un correo electrónico válido.",
  whatsapp: "Escribe un WhatsApp de México a 10 dígitos.",
  privacy: "Acepta el Aviso de Privacidad para continuar.",
  rate: "Demasiados intentos. Espera un momento e inténtalo de nuevo.",
  save: "No pudimos guardar tus datos. Intenta de nuevo o escríbenos por WhatsApp.",
  calendar: "El calendario no está disponible por ahora. Intenta más tarde o escríbenos por WhatsApp.",
  slots: "No pudimos consultar los horarios. Intenta de nuevo en unos minutos.",
  connect: "No pudimos conectar con el calendario. Intenta de nuevo o escríbenos por WhatsApp.",
  book: "No pudimos confirmar la cita. Intenta de nuevo o escríbenos por WhatsApp.",
  taken: "Ese horario ya fue tomado. Elige otro.",
  expired: "Tu sesión expiró. Vuelve a dejar tus datos para agendar.",
  badSlot: "Elige un horario de la lista.",
} as const;

export function redactSecrets(value: string): string {
  let out = value;
  for (const key of ["ODOO_API_KEY", "LEAD_SIGNING_SECRET", "ODOO_LOGIN", "ODOO_DB"]) {
    const secret = process.env[key];
    if (secret) out = out.split(secret).join("[redacted]");
  }
  return out.slice(0, 2000);
}

export function logBookingError(scope: string, err: unknown): void {
  const raw = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  console.error(`[${scope}]`, redactSecrets(raw));
}
