"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import BookingScheduler from "@/components/BookingScheduler";
import HeroScrim from "@/components/HeroScrim";
import { site } from "@/data/site";
import {
  CIUDADES,
  INTERESES_CASA,
  RANGOS_LUZ_RESIDENCIAL,
} from "@/lib/agendar-config";
import { captureAttribution, pushDataLayer, type Attribution } from "@/lib/attribution";
import type { Pag } from "@/content/agendar-copys-v2";

const PAGE = "/lp/residencial";

const RANGO_ICON: Record<(typeof RANGOS_LUZ_RESIDENCIAL)[number], string> = {
  "Menos de $2,000": "solar:bill-list-linear",
  "$2,000–$5,000": "solar:bill-linear",
  "$5,000–$10,000": "solar:chart-square-linear",
  "Más de $10,000": "solar:graph-up-linear",
  "No sé": "solar:question-circle-linear",
};

const INTERES_ICON: Record<(typeof INTERESES_CASA)[number], string> = {
  "Paneles solares": "solar:sun-linear",
  "Baterías de respaldo": "solar:battery-charge-linear",
  "Las dos": "solar:layers-linear",
  "No estoy seguro": "solar:question-circle-linear",
};

const BUBBLES = {
  1: "¡Hola! Para mandarte tu propuesta necesito tus datos. Tu WhatsApp es para enviarte la propuesta y tu correo para mandarte la confirmación de tu cita.",
  2: "Con esto calculamos el tamaño aproximado de tu sistema.",
  3: "Así te asignamos al especialista correcto.",
  cita: "Elige el día y la hora. La asesoría es por llamada o videollamada.",
} as const;

const fieldClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-base text-lukx-charcoal outline-none transition focus:border-lukx-green";

function AdvisorBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <div
        className="grid size-11 shrink-0 place-items-center rounded-full bg-lukx-charcoal text-xs font-semibold tracking-wide text-white"
        aria-hidden
      >
        LX
      </div>
      <div className="quote-bubble min-w-0">
        <p className="text-xs font-semibold text-lukx-charcoal">Asesora Lukx</p>
        <p className="mt-1 rounded-2xl rounded-tl-md bg-lukx-light px-4 py-3 text-sm leading-relaxed text-lukx-charcoal">
          {text}
        </p>
      </div>
    </div>
  );
}

function ChoiceCards({
  name,
  legend,
  options,
  icons,
  value,
  disabled,
  onPick,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  icons: Record<string, string>;
  value: string;
  disabled: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <fieldset disabled={disabled} className="mt-5 min-w-0 border-0 p-0">
      <legend className="font-display text-3xl leading-none text-lukx-charcoal md:text-4xl">{legend}</legend>
      <div className="mt-4 grid gap-3">
        {options.map((option) => {
          const id = `${name}-${option}`;
          return (
            <label key={option} htmlFor={id} className="block cursor-pointer">
              <input
                id={id}
                className="quote-radio peer sr-only"
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onPick(option)}
                onClick={() => {
                  if (value === option) onPick(option);
                }}
              />
              <span className="flex min-h-[4.5rem] items-center gap-3 border-2 border-black/10 bg-white px-4 py-3 transition peer-checked:border-lukx-green-btn peer-checked:bg-[#f3faf4] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lukx-green peer-disabled:cursor-wait">
                <Icon icon={icons[option] ?? "solar:check-circle-linear"} className="size-7 shrink-0 text-lukx-green-btn" aria-hidden />
                <span className="text-base font-semibold text-lukx-charcoal">{option}</span>
                <Icon
                  icon="solar:check-circle-bold"
                  className={`ml-auto size-5 shrink-0 text-lukx-green-btn ${value === option ? "opacity-100" : "opacity-0"}`}
                  aria-hidden
                />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function LpResidencialQuote({ pag }: { pag: Pag }) {
  const [phase, setPhase] = useState<1 | 2 | 3 | "cita">(1);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [recibo, setRecibo] = useState("");
  const [interes, setInteres] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [attr, setAttr] = useState<Attribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const tracked = useRef({ start: false, step2: false, lead: false });
  const busy = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const captured = captureAttribution();
    // The first-touch values only exist in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(captured);
  }, []);

  useEffect(() => {
    if (phase === 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }, [phase]);

  function markStart() {
    if (tracked.current.start) return;
    tracked.current.start = true;
    pushDataLayer("form_start", { pagina: PAGE });
  }

  async function saveDetalle(nextRecibo: string, nextInteres: string) {
    const res = await fetch("/api/lead/detalle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadToken: token, recibo: nextRecibo, interes: nextInteres }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(data.error || "No pudimos guardar tu respuesta.");
  }

  async function onContact(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(whatsapp)) {
      setError("Escribe tu WhatsApp a 10 dígitos.");
      return;
    }
    if (!CIUDADES.includes(city as (typeof CIUDADES)[number])) {
      setError("Elige tu ciudad.");
      return;
    }
    if (token) {
      if (!tracked.current.step2) {
        tracked.current.step2 = true;
        pushDataLayer("form_step_2", { pagina: PAGE });
      }
      setPhase(2);
      return;
    }
    setSubmitting(true);
    try {
      const attribution = attr ?? captureAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp,
          privacyAccepted: privacy,
          lukx_hp: honeypot,
          pagina: PAGE,
          ciudad: city,
          respuestas: {
            Nombre: name,
            WhatsApp: whatsapp,
            "Correo electrónico": email,
            "Ciudad o municipio": city,
          },
          atribucion: attribution,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; leadToken?: string };
      if (!res.ok || !data.leadToken) throw new Error(data.error || "No pudimos guardar tus datos.");
      setToken(data.leadToken);
      if (!tracked.current.step2) {
        tracked.current.step2 = true;
        pushDataLayer("form_step_2", { pagina: PAGE });
      }
      if (!tracked.current.lead) {
        tracked.current.lead = true;
        pushDataLayer("generate_lead", {
          linea: "residencial",
          necesidad: "",
          ciudad: city,
          tiene_paneles: "",
          pagina: PAGE,
        });
      }
      setPhase(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  async function pick(kind: "recibo" | "interes", value: string) {
    if (busy.current || !token) return;
    const nextRecibo = kind === "recibo" ? value : recibo;
    const nextInteres = kind === "interes" ? value : interes;
    if (kind === "recibo") setRecibo(value);
    else setInteres(value);
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      await saveDetalle(nextRecibo, nextInteres);
      setPhase(kind === "recibo" ? 3 : "cita");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  const stepNumber = phase === "cita" ? 3 : phase;
  const bubble = booked ? "" : BUBBLES[phase];

  return (
    <article className="relative min-h-svh bg-lukx-black">
      <div className="absolute inset-0">
        <Image
          src="/images/2025-07-proyecto-rinconada-patos.jpg"
          alt="Techo de una casa con paneles solares"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <HeroScrim />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-start gap-6 px-4 pt-24 pb-8 md:px-8 md:pt-28 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-12">
        <div className="max-w-xl text-white lg:pt-8">
          <h1 className="font-display text-[2.35rem] leading-[0.92] sm:text-[clamp(2.5rem,6vw,4.6rem)]">{pag.h1}</h1>
          <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/90 md:text-base lg:block">
            Revisamos tu recibo y lo que necesitas respaldar, y te decimos qué sistema conviene.
          </p>
        </div>

        <div
          ref={cardRef}
          className="scroll-mt-24 bg-white p-5 shadow-[0_28px_80px_rgba(0,0,0,0.35)] md:p-7"
        >
          {phase === "cita" ? (
            booked ? null : <AdvisorBubble text={BUBBLES.cita} />
          ) : (
            <>
              <p id="quote-step" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-muted">
                Paso {stepNumber} de 3
              </p>
              <div
                className="mt-2 h-1.5 bg-black/10"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={3}
                aria-valuenow={stepNumber}
                aria-labelledby="quote-step"
              >
                <div className="quote-bar h-full bg-lukx-green" style={{ width: `${(stepNumber / 3) * 100}%` }} />
              </div>
              <div className="mt-5">
                <AdvisorBubble text={bubble} />
              </div>
            </>
          )}

          {phase === 1 ? (
            <form onSubmit={onContact} onFocus={markStart} className="mt-5 grid gap-4">
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
                <label htmlFor="lukx_hp">Sitio web</label>
                <input id="lukx_hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
              </div>
              {attr
                ? Object.entries(attr).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} readOnly />)
                : null}
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Nombre</span>
                <input required autoComplete="name" value={name} onFocus={markStart} onChange={(event) => setName(event.target.value)} className={fieldClass} aria-describedby="note-nombre" />
                <span id="note-nombre" className="mt-1.5 block text-xs leading-relaxed text-lukx-muted">Para dirigirnos a ti en la propuesta.</span>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">WhatsApp</span>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10 dígitos"
                  value={whatsapp}
                  aria-describedby="note-whatsapp"
                  onFocus={markStart}
                  onChange={(event) => setWhatsapp(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={fieldClass}
                />
                <span id="note-whatsapp" className="mt-1.5 block text-xs leading-relaxed text-lukx-muted">Para enviarte la propuesta.</span>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Correo</span>
                <input required type="email" autoComplete="email" value={email} onFocus={markStart} onChange={(event) => setEmail(event.target.value)} className={fieldClass} aria-describedby="note-correo" />
                <span id="note-correo" className="mt-1.5 block text-xs leading-relaxed text-lukx-muted">Para mandarte la confirmación de tu cita.</span>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Ciudad o municipio</span>
                <select required value={city} onFocus={markStart} onChange={(event) => setCity(event.target.value)} className={fieldClass} aria-describedby="note-ciudad">
                  <option value="">Elige tu ciudad</option>
                  {CIUDADES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                <span id="note-ciudad" className="mt-1.5 block text-xs leading-relaxed text-lukx-muted">Para saber si tu casa está en la zona que atendemos.</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-lukx-charcoal">
                <input type="checkbox" required checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} className="mt-1 size-4 accent-lukx-green-btn" />
                <span>
                  Acepto el{" "}
                  <a href={site.privacyPdf} target="_blank" rel="noreferrer" className="text-lukx-green-btn underline">
                    aviso de privacidad
                  </a>
                </span>
              </label>
              {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className="btn-green w-full disabled:opacity-50">
                {submitting ? "Guardando…" : "Continuar"}
              </button>
            </form>
          ) : null}

          {phase === 2 ? (
            <div className="mt-5">
              <ChoiceCards
                name="recibo"
                legend="¿Cuánto pagas de luz al bimestre?"
                options={RANGOS_LUZ_RESIDENCIAL}
                icons={RANGO_ICON}
                value={recibo}
                disabled={submitting}
                onPick={(value) => void pick("recibo", value)}
              />
              {error ? (
                <p className="mt-3 text-sm text-red-600" role="alert">
                  {error}{" "}
                  <button type="button" className="underline" onClick={() => void pick("recibo", recibo)}>Reintentar</button>
                </p>
              ) : null}
              <button type="button" disabled={submitting} onClick={() => setPhase(1)} className="mt-4 text-sm font-semibold text-lukx-charcoal underline-offset-2 hover:underline disabled:opacity-40">
                Atrás
              </button>
            </div>
          ) : null}

          {phase === 3 ? (
            <div className="mt-5">
              <ChoiceCards
                name="interes"
                legend="¿Qué te interesa?"
                options={INTERESES_CASA}
                icons={INTERES_ICON}
                value={interes}
                disabled={submitting}
                onPick={(value) => void pick("interes", value)}
              />
              {error ? (
                <p className="mt-3 text-sm text-red-600" role="alert">
                  {error}{" "}
                  <button type="button" className="underline" onClick={() => void pick("interes", interes)}>Reintentar</button>
                </p>
              ) : null}
              <button type="button" disabled={submitting} onClick={() => setPhase(2)} className="mt-4 text-sm font-semibold text-lukx-charcoal underline-offset-2 hover:underline disabled:opacity-40">
                Atrás
              </button>
            </div>
          ) : null}

          {phase === "cita" && token ? (
            <div className="mt-5">
              <BookingScheduler
                resumeToken={token}
                guestName={name}
                trackingPage={PAGE}
                onBack={() => setPhase(3)}
                onScheduled={() => {
                  setBooked(true);
                  pushDataLayer("schedule_appointment", { pagina: PAGE, ciudad: city });
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <ul className="relative z-10 mx-auto grid max-w-[1180px] gap-3 px-4 pb-10 md:grid-cols-3 md:px-8">
        <li className="bg-white/95 px-4 py-4 text-sm leading-relaxed text-lukx-charcoal shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          Monterrey y área metropolitana, Saltillo y Ramos Arizpe
        </li>
        <li className="bg-white/95 px-4 py-4 text-sm leading-relaxed text-lukx-charcoal shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          Asesoría por llamada o videollamada
        </li>
        <li className="bg-white/95 px-4 py-4 text-sm leading-relaxed text-lukx-charcoal shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          La llamada no tiene costo.
        </li>
      </ul>
    </article>
  );
}
