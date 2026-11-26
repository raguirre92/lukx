"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import BookingScheduler from "@/components/BookingScheduler";
import {
  ASESORIA_WHATSAPP,
  CIUDADES,
  RANGOS_LUZ,
  SOLUCION_PRESELECT,
  TIPOS_NEGOCIO,
  TIPOS_PROYECTO_INDUSTRIAL,
} from "@/lib/agendar-config";
import { captureAttribution, pushDataLayer, type Attribution } from "@/lib/attribution";
import { site } from "@/data/site";
import { califCom, califInd, califRes, comoFunciona, type Campo, type Pag } from "@/content/agendar-copys-v2";

function splitOptions(opciones: string): string[] | null {
  if (opciones.includes("[rangos por definir]") && !opciones.includes("·")) return RANGOS_LUZ ? [...RANGOS_LUZ] : null;
  if (opciones.trim() === "[opciones por definir]") return TIPOS_NEGOCIO ? [...TIPOS_NEGOCIO] : null;
  if (opciones.includes("propuesta:")) return [...TIPOS_PROYECTO_INDUSTRIAL];
  if (!opciones.includes("·")) return null;
  return opciones
    .split("·")
    .map((item) => item.replace(/\s*\([^)]*\)\s*/g, "").trim())
    .filter(Boolean);
}

function FieldControl({
  campo,
  value,
  onChange,
}: {
  campo: Campo;
  value: string;
  onChange: (value: string) => void;
}) {
  const required = campo.obligatorio === "Sí";
  if (campo.campo === "Aviso de privacidad") {
    return (
      <label className="flex items-start gap-3 text-sm text-lukx-charcoal">
        <input type="checkbox" required checked={value === "si"} onChange={(event) => onChange(event.target.checked ? "si" : "")} className="mt-1" />
        <span>
          Acepto el{" "}
          <a href={site.privacyPdf} target="_blank" rel="noreferrer" className="text-lukx-green-btn underline">
            aviso de privacidad
          </a>
        </span>
      </label>
    );
  }
  if (campo.campo === "Ciudad o municipio") {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-lukx-charcoal">{campo.campo}</span>
        <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-lukx-green">
          <option value="">Elige tu ciudad</option>
          {CIUDADES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
    );
  }
  const options = campo.campo === "¿Cuánto pagas de luz al bimestre, aproximadamente?" || campo.campo === "¿Cuánto pagas de luz al mes, aproximadamente?"
    ? RANGOS_LUZ
    : splitOptions(campo.opciones);
  if (options && options.length > 1) {
    return (
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-lukx-charcoal">{campo.campo}</span>
        <select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-lukx-green">
          <option value="">Elige una opción</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }
  const type = campo.campo === "Correo electrónico" ? "email" : campo.campo === "WhatsApp" ? "tel" : "text";
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-lukx-charcoal">{campo.campo}</span>
      {campo.campo === "Comentarios" ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={campo.opciones} rows={3} className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-lukx-green" />
      ) : (
        <input
          type={type}
          required={required}
          inputMode={type === "tel" ? "numeric" : undefined}
          pattern={type === "tel" ? "[0-9]{10}" : undefined}
          maxLength={type === "tel" ? 10 : undefined}
          value={value}
          placeholder={campo.campo === "WhatsApp" ? "10 dígitos" : campo.opciones}
          onChange={(event) => onChange(type === "tel" ? event.target.value.replace(/\D/g, "").slice(0, 10) : event.target.value)}
          className="w-full border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-lukx-green"
        />
      )}
    </label>
  );
}

function linkLine(line: string) {
  const match = line.match(/^(.*?)\s*(?:→|->)\s*(\/\S+)/);
  if (!match) return null;
  return { label: match[1].replace(/\/$/, "").trim(), href: match[2] };
}

export default function AgendarScreen({ pag }: { pag: Pag }) {
  const ads = pag.tipo === "ads";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [started, setStarted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attr, setAttr] = useState<Attribution | null>(null);

  useEffect(() => {
    const captured = captureAttribution();
    // Attribution and the ?solucion= preset only exist in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(captured);
    const params = new URLSearchParams(window.location.search);
    const preset = SOLUCION_PRESELECT[params.get("solucion") ?? ""];
    if (preset) setAnswers((current) => ({ ...current, "¿Qué te interesa?": current["¿Qué te interesa?"] || preset }));
  }, []);

  const space = answers["¿Para qué espacio es tu proyecto?"];
  const extraCalif = useMemo(() => {
    if (!ads || pag.version !== "general" || step !== 1) return [];
    if (space?.startsWith("Casa")) return califRes;
    if (space?.startsWith("Negocio")) return califCom;
    if (space?.startsWith("Industria")) return califInd;
    return [];
  }, [ads, pag.version, step, space]);

  const fields = useMemo(() => {
    const paso = pag.pasos[Math.min(step, pag.pasos.length - 1)];
    return [...paso.campos, ...extraCalif];
  }, [pag.pasos, step, extraCalif]);

  function markStart() {
    if (started) return;
    setStarted(true);
    pushDataLayer("form_start", { pagina: pag.version });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (ads && step === 0) {
      setStep(1);
      pushDataLayer("form_step_2", { pagina: pag.version });
      return;
    }
    if (!/^\d{10}$/.test(answers.WhatsApp ?? "")) {
      setError("Escribe tu WhatsApp a 10 dígitos.");
      return;
    }
    setSubmitting(true);
    try {
      const attribution = attr ?? captureAttribution();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: answers.Nombre ?? "",
          email: answers["Correo electrónico"] ?? "",
          whatsapp: answers.WhatsApp ?? "",
          privacyAccepted: answers["Aviso de privacidad"] === "si",
          lukx_hp: honeypot,
          pagina: pag.url,
          formulario: "agendar",
          respuestas: answers,
          atribucion: attribution,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; leadToken?: string };
      if (!res.ok || !data.leadToken) throw new Error(data.error || "No pudimos guardar tus datos.");
      pushDataLayer("generate_lead", {
        pagina: pag.version,
        necesidad: answers["¿Qué te interesa?"] || answers["Tipo de proyecto"] || "",
        ciudad: answers["Ciudad o municipio"] || "",
        tiene_paneles: answers["¿Ya tienes paneles solares?"] || "",
        linea: pag.version,
      });
      setToken(data.leadToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  const form = (
    <form id="agenda" onSubmit={onSubmit} onFocus={markStart} className="bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:p-6">
      {pag.pasos[step]?.indicador ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lukx-muted">{pag.pasos[step].indicador}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl leading-none text-lukx-charcoal">{pag.pasos[Math.min(step, pag.pasos.length - 1)].titulo}</h2>
      <p className="mt-3 text-sm leading-relaxed text-lukx-muted">{pag.pasos[Math.min(step, pag.pasos.length - 1)].micro}</p>
      <div className="mt-5 grid gap-4">
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
          <label htmlFor="lukx_hp">Sitio web</label>
          <input id="lukx_hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
        </div>
        {attr
          ? Object.entries(attr).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} readOnly />)
          : null}
        {fields.map((campo) => (
          <FieldControl
            key={`${step}-${campo.campo}`}
            campo={campo}
            value={answers[campo.campo] ?? ""}
            onChange={(value) => setAnswers((current) => ({ ...current, [campo.campo]: value }))}
          />
        ))}
        {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
        <button type="submit" disabled={submitting} className="btn-green w-fit disabled:opacity-50">
          {submitting ? "Guardando…" : step === 0 && ads ? "Continuar" : "Agendar asesoría"}
        </button>
      </div>
    </form>
  );

  return (
    <article className={ads ? "bg-lukx-light" : ""}>
      <section className={`site-container grid gap-8 pb-12 ${ads ? "pt-24 md:pt-28" : "pt-28 md:pt-32"} lg:grid-cols-[1fr_1fr] lg:items-start`}>
        <div className={ads ? "order-2 lg:order-1" : ""}>
          <h1 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] text-lukx-charcoal">{pag.h1}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-lukx-muted md:text-base">{pag.sub}</p>
        </div>
        <div className={ads ? "order-1 lg:order-2" : ""}>
          {token ? (
            <BookingScheduler
              resumeToken={token}
              onScheduled={() => pushDataLayer("schedule_appointment", { pagina: pag.version, ciudad: answers["Ciudad o municipio"] || "" })}
            />
          ) : (
            form
          )}
          {token ? (
            <ul className="mt-4 space-y-2 text-sm text-lukx-muted">
              {pag.confPasos.map((item) => (
                <li key={item.title}><span className="font-semibold text-lukx-charcoal">{item.title}. </span>{item.detail}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {pag.bloques.filter((bloque) => bloque.k === "lista" && bloque.lineas && !ads).map((bloque) => (
        <section key={bloque.t} className="site-container py-8">
          <h2 className="font-display text-3xl text-lukx-charcoal">{bloque.lineas?.[0]?.startsWith("Título:") ? bloque.lineas[0].replace(/^Título:\s*/, "") : bloque.t}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-lukx-muted">
            {(bloque.lineas?.[0]?.startsWith("Título:") ? bloque.lineas.slice(1) : bloque.lineas)?.filter((line) => !line.startsWith("[")).map((line) => {
              const linked = linkLine(line);
              return (
                <li key={line}>
                  {linked ? <Link href={linked.href} className="text-lukx-green-btn underline">{linked.label}</Link> : line}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {pag.bloques.some((bloque) => bloque.k === "pasos") ? (
        <section className="site-container grid gap-4 py-8 md:grid-cols-3">
          {comoFunciona.map((item) => (
            <div key={item.title} className="border border-black/10 p-4">
              <h2 className="text-base font-semibold text-lukx-charcoal">{item.title}</h2>
              <p className="mt-2 text-sm text-lukx-muted">{item.detail}</p>
            </div>
          ))}
        </section>
      ) : null}

      {pag.faq.length ? (
        <section className="site-container py-10">
          <h2 className="font-display text-3xl text-lukx-charcoal">Preguntas frecuentes</h2>
          <div className="mt-6">
            <FaqAccordion items={pag.faq.map((item) => ({ question: item.q, answer: item.a }))} />
          </div>
        </section>
      ) : null}

      {!ads && pag.ctaS.includes("WhatsApp") ? (
        <p className="site-container pb-10 text-center text-sm">
          <a href={ASESORIA_WHATSAPP} target="_blank" rel="noreferrer" onClick={() => pushDataLayer("click_whatsapp", { pagina: pag.version })} className="text-lukx-green-btn underline">
            Prefiero escribir por WhatsApp
          </a>
        </p>
      ) : null}

      {ads ? (
        <footer className="border-t border-black/10 bg-lukx-charcoal py-6 text-center text-xs text-white/70">
          <a href={site.privacyPdf} className="underline" target="_blank" rel="noreferrer">Aviso de privacidad</a>
          <span> · © {new Date().getFullYear()} Lukx</span>
        </footer>
      ) : (
        <p className="site-container pb-12 text-center">
          <a href="#agenda" className="btn-green">{pag.ctaP}</a>
        </p>
      )}
    </article>
  );
}
