"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { captureAttribution, pushDataLayer } from "@/lib/attribution";

const fieldClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-base text-lukx-charcoal outline-none transition focus:border-lukx-green";

export default function ExitIntentLead({
  pagePath,
  linea,
  suspended = false,
}: {
  pagePath: string;
  linea: string;
  suspended?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const armed = useRef(false);
  const shown = useRef(false);
  const pushed = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (suspended || done) return;
    const storageKey = `lukx-exit:${pagePath}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    const show = () => {
      if (shown.current || armed.current === false) return;
      if (window.sessionStorage.getItem(storageKey)) return;
      shown.current = true;
      window.sessionStorage.setItem(storageKey, "1");
      setOpen(true);
    };

    const onMouseOut = (event: MouseEvent) => {
      if (event.clientY > 8) return;
      if (event.relatedTarget) return;
      show();
    };

    const arm = window.setTimeout(() => {
      armed.current = true;
      if (!pushed.current) {
        pushed.current = true;
        history.pushState({ lukxExit: pagePath }, "");
      }
      document.documentElement.addEventListener("mouseout", onMouseOut);
      window.addEventListener("popstate", show);
    }, 5000);

    return () => {
      window.clearTimeout(arm);
      armed.current = false;
      document.documentElement.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("popstate", show);
    };
  }, [done, pagePath, suspended]);

  function close() {
    setOpen(false);
    setError(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(whatsapp)) {
      setError("Escribe tu WhatsApp a 10 dígitos.");
      return;
    }
    setSubmitting(true);
    try {
      const attribution = captureAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          privacyAccepted: privacy,
          lukx_hp: honeypot,
          pagina: pagePath,
          formulario: "salida",
          respuestas: { Origen: "Intención de salida" },
          atribucion: attribution,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; leadToken?: string };
      if (honeypot.trim()) {
        setDone(true);
        return;
      }
      if (!res.ok || !data.leadToken) throw new Error(data.error || "No pudimos guardar tus datos.");
      pushDataLayer("generate_lead", {
        linea,
        necesidad: "",
        ciudad: "",
        tiene_paneles: "",
        pagina: pagePath,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes exit-intent-enter {
          from {
            opacity: 0;
            transform: translateY(0.75rem) scale(0.98);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          }
          to {
            opacity: 1;
            transform: none;
            box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
          }
        }
        @keyframes exit-intent-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: no-preference) {
          dialog.exit-intent[open] {
            animation: exit-intent-enter 480ms cubic-bezier(0.22, 0.8, 0.24, 1) both !important;
          }
          dialog.exit-intent[open]::backdrop {
            animation: exit-intent-backdrop 280ms ease-out both !important;
          }
        }
      `}</style>
      <dialog
      ref={dialogRef}
      className="exit-intent bg-white text-lukx-charcoal"
      aria-labelledby="exit-intent-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div data-exit-card className="p-6 sm:p-8">
        <span data-exit-rule className="mb-5 block h-0.5 w-10 origin-left bg-lukx-green-btn" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <h2 id="exit-intent-title" data-no-split className="text-balance font-display text-4xl leading-none">Platiquemos de tu proyecto</h2>
          <button type="button" onClick={close} aria-label="Cerrar" className="px-1 text-2xl leading-none text-lukx-charcoal">×</button>
        </div>
        {done ? (
          <p className="mt-4 text-sm leading-relaxed text-lukx-muted">Listo. Te escribimos pronto.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4">
            <p className="text-base leading-relaxed text-lukx-muted">Deja tus datos y pronto nos pondremos en contacto contigo.</p>
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="exit-hp">Sitio web</label>
              <input id="exit-hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            <div className="mt-4 grid gap-3">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Nombre</span>
                <input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">WhatsApp</span>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10 dígitos"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Correo</span>
                <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
              </label>
              {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className="btn-green w-full disabled:opacity-50">
                {submitting ? "Guardando…" : "Enviar"}
              </button>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" required checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} className="mt-1 size-4 accent-lukx-green-btn" />
                <span>
                  Acepto el{" "}
                  <a href={site.privacyPdf} target="_blank" rel="noreferrer" className="text-lukx-green-btn underline">aviso de privacidad</a>
                </span>
              </label>
            </div>
          </form>
        )}
      </div>
    </dialog>
    </>
  );
}
