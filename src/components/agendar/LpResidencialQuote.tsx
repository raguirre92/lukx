"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import BookingScheduler from "@/components/BookingScheduler";
import FaqAccordion from "@/components/FaqAccordion";
import HeroScrim from "@/components/HeroScrim";
import { site } from "@/data/site";
import { CIUDADES, RANGOS_LUZ_RESIDENCIAL } from "@/lib/agendar-config";
import { captureAttribution, pushDataLayer, type Attribution } from "@/lib/attribution";
import type { Pag } from "@/content/agendar-copys-v2";

const PAGE = "/lp/residencial";

const POINTS = [
  "Un sistema dimensionado con tu consumo real, no un paquete estándar.",
  "Paneles solares, respaldo con baterías o los dos: te decimos qué conviene.",
  "Diseño e instalación con el mismo equipo.",
];

const INCLUDES = [
  {
    icon: "solar:sun-linear",
    title: "Paneles solares",
    text: "Proyecto fotovoltaico para tu casa, del diseño a la instalación.",
  },
  {
    icon: "solar:battery-charge-linear",
    title: "Baterías de respaldo",
    text: "Proyecto de respaldo para que lo esencial de tu casa siga en marcha.",
  },
  {
    icon: "solar:ruler-linear",
    title: "A la medida de tu consumo",
    text: "Un sistema dimensionado con tu consumo real, no un paquete estándar.",
  },
  {
    icon: "solar:users-group-rounded-linear",
    title: "Un solo equipo",
    text: "Diseño e instalación con el mismo equipo.",
  },
];

const PROCESS = [
  {
    title: "Asesoría",
    text: "En la llamada o videollamada vemos tu recibo de CFE, fotos o planos y lo que quieres resolver.",
  },
  {
    title: "Diseño",
    text: "Diseñamos el sistema con tu consumo real, no con un paquete estándar.",
  },
  {
    title: "Instalación",
    text: "El mismo equipo que diseñó el proyecto lo instala.",
  },
  {
    title: "Seguimiento",
    text: "Monitoreo y mantenimiento del sistema ya instalado.",
  },
];

const GALLERY = [
  { src: "/images/2025-07-proyecto-rinconada-patos.jpg", alt: "Proyecto Rinconada Patos", title: "Rinconada Patos" },
  { src: "/images/2025-07-proyecto-rinconada-patos-2.jpg", alt: "Detalle del proyecto Rinconada Patos", title: "Rinconada Patos" },
  { src: "/images/2025-09-proyecto-rinconada-patos.jpg", alt: "Otra vista de Rinconada Patos", title: "Rinconada Patos" },
  { src: "/images/2025-07-proyecto-rinconada-patos-3.jpg", alt: "Instalación en Rinconada Patos", title: "Rinconada Patos" },
  { src: "/images/2025-09-1-4.jpg", alt: "Proyecto Noho", title: "Noho" },
  { src: "/images/2025-07-4.jpg", alt: "Detalle del proyecto Noho", title: "Noho" },
];

const RANGO_ICON: Record<(typeof RANGOS_LUZ_RESIDENCIAL)[number], string> = {
  "Entre 0 y 3,000 pesos": "solar:bill-list-linear",
  "Entre 3,001 y 6,000 pesos": "solar:bill-linear",
  "Entre 6,001 y 10,000 pesos": "solar:chart-square-linear",
  "Más de 10,000 pesos": "solar:graph-up-linear",
};

const INTERES_CASA = ["Paneles solares", "Baterías de respaldo", "Las dos", "No estoy seguro"] as const;

const INTERES_ICON: Record<(typeof INTERES_CASA)[number], string> = {
  "Paneles solares": "solar:sun-linear",
  "Baterías de respaldo": "solar:battery-charge-linear",
  "Las dos": "solar:layers-linear",
  "No estoy seguro": "solar:question-circle-linear",
};

const MOTIVOS = ["Pagar menos de luz", "Los apagones o tener respaldo", "Ambos"] as const;
const SI_NO = ["Sí", "No"] as const;

const STEPS = ["ciudad", "recibo", "interes", "paneles", "motivo", "propietario", "cita"] as const;

type Phase = (typeof STEPS)[number];

const BUBBLES: Record<Phase, string> = {
  ciudad: "Con tu ciudad confirmamos que podemos atender tu casa.",
  recibo: "Con esto calculamos el tamaño aproximado de tu sistema.",
  interes: "Así te asignamos al especialista correcto.",
  paneles: "Si ya tienes paneles, la asesoría se enfoca en el respaldo.",
  motivo: "Así vemos qué quieres resolver.",
  propietario: "Nos dice cómo plantear el proyecto de la casa.",
  cita: "Elige el día y la hora. La asesoría es por llamada o videollamada.",
};

const fieldClass =
  "w-full border border-black/15 bg-white px-3 py-3 text-base text-lukx-charcoal outline-none transition focus:border-lukx-green";

function AdvisorBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-lukx-charcoal text-xs font-semibold tracking-wide text-white" aria-hidden>
        LX
      </div>
      <div className="quote-bubble min-w-0">
        <p className="text-xs font-semibold text-lukx-charcoal">Asesora Lukx</p>
        <p className="mt-1 rounded-2xl rounded-tl-md bg-lukx-light px-4 py-3 text-sm leading-relaxed text-lukx-charcoal">{text}</p>
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              <span className="flex min-h-[4.5rem] items-center gap-3 border-2 border-black/10 bg-white px-4 py-3 transition peer-checked:border-lukx-green-btn peer-checked:bg-[#f3faf4] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lukx-green">
                <Icon icon={icons[option] ?? "solar:map-point-linear"} className="size-7 shrink-0 text-lukx-green-btn" aria-hidden />
                <span className="text-base font-semibold text-lukx-charcoal">{option}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function CardStep({
  title,
  name,
  options,
  value,
  disabled,
  onPick,
  onBack,
}: {
  title: string;
  name: string;
  options: readonly string[];
  value: string;
  disabled: boolean;
  onPick: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="mt-5">
      <ChoiceCards name={name} legend={title} options={options} icons={{}} value={value} disabled={disabled} onPick={onPick} />
      <button type="button" disabled={disabled} onClick={onBack} className="mt-4 text-sm font-semibold underline-offset-2 hover:underline disabled:opacity-40">
        Atrás
      </button>
    </div>
  );
}

export default function LpResidencialQuote({ pag }: { pag: Pag }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("ciudad");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [recibo, setRecibo] = useState("");
  const [interes, setInteres] = useState("");
  const [motivo, setMotivo] = useState("");
  const [propietario, setPropietario] = useState("");
  const [paneles, setPaneles] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [attr, setAttr] = useState<Attribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const tracked = useRef({ start: false, step2: false, lead: false });
  const busy = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const captured = captureAttribution();
    // Attribution only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(captured);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function markStart() {
    if (tracked.current.start) return;
    tracked.current.start = true;
    pushDataLayer("form_start", { pagina: PAGE });
  }

  function closeModal() {
    setOpen(false);
    setError(null);
    nameRef.current?.focus();
  }

  function profileAnswers(extra: {
    city?: string;
    recibo?: string;
    interes?: string;
    motivo?: string;
    propietario?: string;
    paneles?: string;
  } = {}) {
    const respuestas: Record<string, string> = {
      Nombre: name,
      WhatsApp: whatsapp,
      "Correo electrónico": email,
    };
    const chosenCity = extra.city ?? city;
    const chosenRecibo = extra.recibo ?? recibo;
    const chosenInteres = extra.interes ?? interes;
    const chosenMotivo = extra.motivo ?? motivo;
    const chosenPropietario = extra.propietario ?? propietario;
    const chosenPaneles = extra.paneles ?? paneles;
    if (chosenCity) respuestas["Ciudad o municipio"] = chosenCity;
    if (chosenRecibo) respuestas["¿Cuánto pagas de luz al bimestre, aproximadamente?"] = chosenRecibo;
    if (chosenInteres) respuestas["¿Qué te interesa?"] = chosenInteres;
    if (chosenMotivo) respuestas["¿Qué te motiva más?"] = chosenMotivo;
    if (chosenPropietario) respuestas["¿Eres dueño de la casa?"] = chosenPropietario;
    if (chosenPaneles) respuestas["¿Ya tienes paneles solares?"] = chosenPaneles;
    return { respuestas, chosenCity, chosenRecibo, chosenInteres };
  }

  async function postLead(extra: {
    city?: string;
    recibo?: string;
    interes?: string;
    motivo?: string;
    propietario?: string;
    paneles?: string;
  } = {}) {
    const attribution = attr ?? captureAttribution();
    const { respuestas, chosenCity, chosenRecibo, chosenInteres } = profileAnswers(extra);
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
        ciudad: chosenCity,
        recibo: chosenRecibo,
        necesidad: chosenInteres,
        respuestas,
        atribucion: attribution,
        utm_source: attribution.utm_source,
        utm_medium: attribution.utm_medium,
        utm_campaign: attribution.utm_campaign,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; leadToken?: string };
    if (!res.ok || !data.leadToken) throw new Error(data.error || "No pudimos guardar tus datos.");
    return data.leadToken;
  }

  async function onContact(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(whatsapp)) {
      setError("Escribe tu WhatsApp a 10 dígitos.");
      return;
    }
    if (token) {
      if (!tracked.current.step2) {
        tracked.current.step2 = true;
        pushDataLayer("form_step_2", { pagina: PAGE });
      }
      setPhase(city ? "recibo" : "ciudad");
      setOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      const leadToken = await postLead({});
      setToken(leadToken);
      if (!tracked.current.step2) {
        tracked.current.step2 = true;
        pushDataLayer("form_step_2", { pagina: PAGE });
      }
      if (!tracked.current.lead) {
        tracked.current.lead = true;
        pushDataLayer("generate_lead", {
          linea: "residencial",
          necesidad: "",
          ciudad: "",
          tiene_paneles: "",
          pagina: PAGE,
        });
      }
      setPhase("ciudad");
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  async function pickCity(value: string) {
    if (busy.current || !token) return;
    setCity(value);
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead({ city: value, recibo, interes });
      setToken(leadToken);
      setPhase("recibo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu ciudad.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  function go(next: Phase) {
    setError(null);
    setPhase(next);
  }

  async function pickMapped(kind: "recibo" | "interes", value: string) {
    if (busy.current || !token) return;
    if (kind === "recibo") setRecibo(value);
    else setInteres(value);
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead(kind === "recibo" ? { recibo: value } : { interes: value });
      setToken(leadToken);
      go(kind === "recibo" ? "interes" : "paneles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  async function finishProfile(value: string) {
    if (busy.current || !token) return;
    setPropietario(value);
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead({ propietario: value });
      setToken(leadToken);
      go("cita");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  const stepNumber = STEPS.indexOf(phase) + 1;
  const stepCount = STEPS.length;

  return (
    <article>
      <section className="relative bg-lukx-black">
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
        <div className="relative z-10 mx-auto grid max-w-[1180px] items-start gap-4 px-4 pt-20 pb-6 md:px-8 lg:grid-cols-[1.1fr_minmax(0,26rem)] lg:gap-8 lg:pt-[4.75rem] lg:pb-8">
          <div className="max-w-xl text-white">
            <h1 className="font-display text-[2rem] leading-[0.95] lg:text-[3.2rem]">{pag.h1}</h1>
            <p className="mt-2 max-w-md text-sm leading-snug text-white/90">{pag.sub}</p>
            <ul className="mt-3 space-y-1.5">
              {POINTS.map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-snug text-white">
                  <Icon icon="solar:check-circle-bold" className="mt-0.5 size-5 shrink-0 text-lukx-green" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <form id="agenda" onSubmit={onContact} onFocus={markStart} className="scroll-mt-20 bg-white p-4 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-muted">Agenda tu asesoría</p>
            <h2 className="mt-1 font-display text-2xl leading-none text-lukx-charcoal">Tus datos</h2>
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="lukx_hp">Sitio web</label>
              <input id="lukx_hp" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            {attr ? Object.entries(attr).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} readOnly />) : null}
            <div className="mt-3 grid gap-2.5">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Nombre</span>
                <input ref={nameRef} required autoComplete="name" value={name} onFocus={markStart} onChange={(event) => setName(event.target.value)} className={fieldClass} />
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
                  onFocus={markStart}
                  onChange={(event) => setWhatsapp(event.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Correo</span>
                <input required type="email" autoComplete="email" value={email} onFocus={markStart} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
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
              {error && !open ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className="btn-green w-full disabled:opacity-50">
                {submitting ? "Guardando…" : "Continuar"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[280px] overflow-hidden md:min-h-[420px]">
            <Image src="/images/2025-12-Paneles-solares-carrusel-1-1.jpg" alt="Proyecto de paneles solares" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div>
            <h2 className="font-display text-4xl leading-none text-lukx-charcoal md:text-5xl">Qué incluye el proyecto</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {INCLUDES.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <Icon icon={item.icon} className="size-8 shrink-0 text-lukx-green-btn" aria-hidden />
                  <div>
                    <p className="font-semibold text-lukx-charcoal">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-lukx-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-lukx-light py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="font-display text-4xl leading-none text-lukx-charcoal md:text-5xl">Cómo funciona</h2>
            <ol className="mt-8 space-y-6">
              {PROCESS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center bg-lukx-charcoal font-display text-xl text-white">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-lukx-charcoal">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-lukx-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative min-h-[280px] overflow-hidden md:min-h-[420px]">
            <Image src="/images/2025-07-proyecto-rinconada-patos-2.jpg" alt="Casa con paneles solares" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="bg-lukx-charcoal py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <h2 className="font-display text-4xl leading-none md:text-5xl">Proyectos en casa</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
            Rinconada Patos y Noho, proyectos residenciales de Lukx.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY.map((photo) => (
              <li key={photo.src} className="relative min-h-[220px] overflow-hidden">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-4 text-sm font-semibold">{photo.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-6 px-4 md:px-8 lg:grid-cols-2">
          <article className="overflow-hidden bg-lukx-light">
            <div className="relative h-64">
              <Image src="/images/2025-05-847925520_241513079_1706x960.webp" alt="Paneles solares" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-4xl leading-none text-lukx-charcoal">Paneles solares</h2>
              <p className="mt-3 text-sm leading-relaxed text-lukx-muted md:text-base">
                Proyecto fotovoltaico para tu casa, del diseño a la instalación. Con tu recibo de CFE vemos cuántos paneles hacen falta.
              </p>
            </div>
          </article>
          <article className="overflow-hidden bg-lukx-light">
            <div className="relative h-64">
              <Image src="/images/2025-10-baterias.jpg" alt="Baterías de respaldo" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-4xl leading-none text-lukx-charcoal">Baterías de respaldo</h2>
              <p className="mt-3 text-sm leading-relaxed text-lukx-muted md:text-base">
                Si quieres mantener encendidos algunos equipos en los apagones, vemos si conviene sumar un respaldo. Los dos se pueden combinar.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-lukx-light py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-4xl leading-none text-lukx-charcoal md:text-5xl">Preguntas frecuentes</h2>
          <div className="mt-8">
            <FaqAccordion items={pag.faq.map((item) => ({ question: item.q, answer: item.a }))} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-lukx-charcoal py-20 text-white md:py-28">
        <Image src="/images/2025-09-proyecto-rinconada-patos.jpg" alt="" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8">
          <h2 className="font-display text-4xl leading-none md:text-6xl">Agenda tu asesoría</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
            Deja tus datos y elige el día y la hora. La llamada o videollamada es con nuestro equipo.
          </p>
          <a href="#agenda" className="btn-green mt-8">
            Continuar
          </a>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="lp-modal bg-white text-lukx-charcoal"
        aria-labelledby="lp-modal-title"
        onCancel={(event) => {
          event.preventDefault();
          closeModal();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 md:px-8">
            <p id="lp-modal-title" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-muted">
              {booked ? "Cita reservada" : `Paso ${stepNumber} de ${stepCount}`}
            </p>
            <button ref={closeRef} type="button" onClick={closeModal} className="px-3 py-2 text-sm font-semibold text-lukx-charcoal">
              Cerrar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-xl">
              {booked ? null : (
                <>
                  <div className="h-1.5 bg-black/10" role="progressbar" aria-valuemin={1} aria-valuemax={stepCount} aria-valuenow={stepNumber} aria-labelledby="lp-modal-title">
                    <div className="quote-bar h-full bg-lukx-green" style={{ width: `${(stepNumber / stepCount) * 100}%` }} />
                  </div>
                  <div className="mt-5">
                    <AdvisorBubble text={BUBBLES[phase]} />
                  </div>
                </>
              )}
              {phase === "ciudad" ? (
                <div className="mt-5">
                  <ChoiceCards
                    name="ciudad"
                    legend="¿En qué ciudad está tu casa?"
                    options={CIUDADES}
                    icons={{}}
                    value={city}
                    disabled={submitting}
                    onPick={(value) => void pickCity(value)}
                  />
                </div>
              ) : null}
              {phase === "recibo" ? (
                <div className="mt-5">
                  <ChoiceCards
                    name="recibo"
                    legend="¿Cuánto pagas de luz al bimestre?"
                    options={RANGOS_LUZ_RESIDENCIAL}
                    icons={RANGO_ICON}
                    value={recibo}
                    disabled={submitting}
                    onPick={(value) => void pickMapped("recibo", value)}
                  />
                  <button type="button" disabled={submitting} onClick={() => go("ciudad")} className="mt-4 text-sm font-semibold underline-offset-2 hover:underline disabled:opacity-40">
                    Atrás
                  </button>
                </div>
              ) : null}
              {phase === "interes" ? (
                <div className="mt-5">
                  <ChoiceCards
                    name="interes"
                    legend="¿Qué te interesa?"
                    options={INTERES_CASA}
                    icons={INTERES_ICON}
                    value={interes}
                    disabled={submitting}
                    onPick={(value) => void pickMapped("interes", value)}
                  />
                  <button type="button" disabled={submitting} onClick={() => go("recibo")} className="mt-4 text-sm font-semibold underline-offset-2 hover:underline disabled:opacity-40">
                    Atrás
                  </button>
                </div>
              ) : null}
              {phase === "paneles" ? (
                <CardStep title="¿Ya tienes paneles solares?" name="paneles" options={SI_NO} value={paneles} disabled={submitting} onPick={(value) => { setPaneles(value); go("motivo"); }} onBack={() => go("interes")} />
              ) : null}
              {phase === "motivo" ? (
                <CardStep title="¿Qué te motiva más?" name="motivo" options={MOTIVOS} value={motivo} disabled={submitting} onPick={(value) => { setMotivo(value); go("propietario"); }} onBack={() => go("paneles")} />
              ) : null}
              {phase === "propietario" ? (
                <CardStep title="¿Eres dueño de la casa?" name="propietario" options={SI_NO} value={propietario} disabled={submitting} onPick={(value) => void finishProfile(value)} onBack={() => go("motivo")} />
              ) : null}
              {phase === "cita" && token ? (
                <div className="mt-5">
                  <BookingScheduler
                    resumeToken={token}
                    guestName={name}
                    trackingPage={PAGE}
                    onBack={() => go("propietario")}
                    onScheduled={() => {
                      setBooked(true);
                      pushDataLayer("schedule_appointment", { pagina: PAGE, ciudad: city === "Otro" ? "" : city });
                    }}
                  />
                </div>
              ) : null}
              {error && open ? <p className="mt-4 text-sm text-red-600" role="alert">{error}</p> : null}
            </div>
          </div>
        </div>
      </dialog>
    </article>
  );
}
