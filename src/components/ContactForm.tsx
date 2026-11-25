"use client";

import { useState, type FormEvent } from "react";
import { captureAttribution } from "@/lib/attribution";

const fieldClass =
  "w-full border border-black/10 bg-white px-4 py-3 text-sm outline-none ring-lukx-green focus:ring-2";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSending(true);
    try {
      const attribution = captureAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp: phone,
          mensaje: message,
          pagina: "/contacto",
          formulario: "contacto",
          lukx_hp: honeypot,
          atribucion: attribution,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "No pudimos enviar tu mensaje.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <p className="mt-8 text-base leading-relaxed text-lukx-charcoal" role="status">
        Recibimos tu mensaje. Te contactamos pronto.
      </p>
    );
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="lukx_hp">Sitio web</label>
        <input id="lukx_hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
          Nombre
        </label>
        <input id="name" name="name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
          Correo
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
          Teléfono
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-lukx-charcoal">
          Mensaje
        </label>
        <textarea id="message" name="message" rows={5} required value={message} onChange={(event) => setMessage(event.target.value)} className={fieldClass} />
      </div>
      {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
      <button type="submit" disabled={sending} className="btn-green w-full disabled:opacity-50">
        {sending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
