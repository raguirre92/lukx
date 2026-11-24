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

const SOLUTIONS = [
  ["Paneles solares", "Genera tu propia energía y reduce lo que pagas a CFE. Dimensionamos el sistema según tu consumo y el espacio disponible en tu techo."],
  ["Sistemas de respaldo", "Con baterías, tus equipos esenciales, como el refrigerador, el internet y la iluminación, siguen funcionando cuando se va la luz."],
  ["Sistema integral", "Combina paneles y baterías: generas energía durante el día y la almacenas para usarla cuando la necesites."],
] as const;

const PROCESS = [
  ["Asesoría", "Analizamos tu consumo y lo que necesitas respaldar.", "solar:chat-round-dots-linear"],
  ["Propuesta", "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión.", "solar:document-text-linear"],
  ["Visita técnica", "Revisamos tu domicilio para confirmar el diseño y la instalación.", "solar:map-point-linear"],
  ["Instalación y supervisión", "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo.", "solar:settings-linear"],
  ["Trámite con CFE", "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma.", "solar:bolt-linear"],
] as const;

const REVIEW_EXAMPLES = [
  { image: "/images/residencial-casa-paneles.webp", topic: "Paneles solares", quote: "Con mi recibo pude entender cuántos paneles necesitaba y qué esperar del sistema." },
  { image: "/images/residencial-respaldo-detalle.webp", topic: "Sistemas de respaldo", quote: "En la asesoría vimos qué equipos quería mantener encendidos cuando se va la luz." },
  { image: "/images/residencial-tecnico-lukx.webp", topic: "Instalación", quote: "Me explicaron por dónde pasaría el cableado y cómo revisar la producción desde mi teléfono." },
] as const;

function DemoReviews() {
  const trackRef = useRef<HTMLUListElement>(null);

  function move(direction: number) {
    const track = trackRef.current;
    const tile = track?.firstElementChild;
    if (!track || !tile) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * (tile.getBoundingClientRect().width + gap), behavior: reduceMotion ? "instant" : "smooth" });
  }

  return (
    <section aria-labelledby="demo-reviews-title" className="bg-white py-16 text-lukx-charcoal md:py-24">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-black/15 pb-6">
          <div>
            <p className="mb-2 text-xs font-semibold text-lukx-muted">Reseñas ficticias · Vista previa</p>
            <h2 id="demo-reviews-title" className="font-display text-4xl leading-none md:text-6xl">Experiencias en casa</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Desplazar reseñas a la izquierda" onClick={() => move(-1)} className="grid size-11 place-items-center border border-black/20 hover:border-lukx-green-btn">←</button>
            <button type="button" aria-label="Desplazar reseñas a la derecha" onClick={() => move(1)} className="grid size-11 place-items-center border border-black/20 hover:border-lukx-green-btn">→</button>
          </div>
        </div>
      </div>
      <ul ref={trackRef} tabIndex={0} aria-label="Reseñas de ejemplo con fotos" className="mt-6 flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 pr-4 pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:scroll-pl-8 md:pr-8 md:pl-8 lg:scroll-pl-[max(4rem,calc(50%-656px))] lg:pr-16 lg:pl-[max(4rem,calc(50%-656px))]">
        {REVIEW_EXAMPLES.flatMap((item) => [
          <li key={item.topic} className="flex aspect-square w-[min(78vw,20rem)] shrink-0 snap-start flex-col border border-black/10 bg-lukx-light p-5 sm:p-6">
            <span aria-hidden className="font-display text-5xl leading-none text-lukx-green-btn">“</span>
            <blockquote className="mt-2 flex-1 text-base leading-relaxed sm:text-lg">{item.quote}</blockquote>
            <p className="mt-4 border-t border-black/10 pt-3 text-xs font-semibold text-lukx-muted">{item.topic} · Reseña ficticia</p>
          </li>,
          <li key={item.image} aria-hidden className="relative aspect-square w-[min(78vw,20rem)] shrink-0 snap-start overflow-hidden">
            <Image src={item.image} alt="" fill sizes="(max-width: 410px) 78vw, 320px" className="object-cover" />
          </li>,
        ])}
      </ul>
    </section>
  );
}


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

const MOTIVOS = ["Pagar menos de luz", "Tener respaldo cuando se va la luz", "Ambos"] as const;

const STEPS = ["ciudad", "recibo", "interes", "motivo", "comentarios", "cita"] as const;

type Phase = (typeof STEPS)[number];

const BUBBLES: Record<Phase, string> = {
  ciudad: "Con tu ciudad confirmamos que podemos atender tu casa.",
  recibo: "Con esto calculamos el tamaño aproximado de tu sistema.",
  interes: "Así te asignamos al especialista correcto.",
  motivo: "Así vemos qué quieres resolver.",
  comentarios: "Si tienes dudas o algo más que contarnos, puedes dejarlo aquí.",
  cita: "Elige el día y la hora. La asesoría es por llamada o videollamada.",
};

const fieldClass =
  "lp-residential-field w-full border border-black/15 bg-white px-3 py-3 text-base text-lukx-charcoal outline-none transition focus:border-lukx-green";

function AdvisorBubble({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-lukx-charcoal text-xs font-semibold tracking-wide text-white" aria-hidden>
        LX
      </div>
      <div className="quote-bubble min-w-0">
        <p className="rounded-2xl rounded-tl-md bg-lukx-light px-4 py-3 text-sm leading-relaxed text-lukx-charcoal">{text}</p>
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
              <span className="flex min-h-[4.5rem] items-center gap-3 border-2 border-black/10 bg-white px-4 py-3 hover:border-lukx-green-btn hover:bg-[#f3faf4] motion-safe:transition motion-safe:duration-150 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 peer-checked:border-lukx-green-btn peer-checked:bg-[#f3faf4] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lukx-green">
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
  const [privacy, setPrivacy] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [recibo, setRecibo] = useState("");
  const [interes, setInteres] = useState("");
  const [motivo, setMotivo] = useState("");
  const [comment, setComment] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [attr, setAttr] = useState<Attribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("agenda");
    const final = document.getElementById("agenda-final");
    if (!hero || !final) return;

    let pastHero = false;
    let finalVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = entry.boundingClientRect.bottom <= 72;
        if (entry.target === final) finalVisible = entry.isIntersecting;
      }
      setShowMobileCta(pastHero && !finalVisible);
    }, { rootMargin: "-72px 0px 0px" });
    observer.observe(hero);
    observer.observe(final);
    return () => observer.disconnect();
  }, []);
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
    if (!open || !booked) return;

    const timeout = window.setTimeout(() => setOpen(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [open, booked]);

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
    if (chosenCity) respuestas["Ciudad o municipio"] = chosenCity;
    if (chosenRecibo) respuestas["¿Cuánto pagas de luz al bimestre, aproximadamente?"] = chosenRecibo;
    if (chosenInteres) respuestas["¿Qué te interesa?"] = chosenInteres;
    if (comment.trim()) respuestas.Comentarios = comment.trim();
    if (chosenMotivo) respuestas["¿Qué te motiva más?"] = chosenMotivo;
    return { respuestas, chosenCity, chosenRecibo, chosenInteres };
  }

  async function postLead(extra: {
    city?: string;
    recibo?: string;
    interes?: string;
    motivo?: string;
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
      go(kind === "recibo" ? "interes" : "motivo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  async function finishProfile() {
    if (busy.current || !token) return;
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead();
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

  const contactForm = (id: string) => (
    <form id={id} onSubmit={onContact} onFocus={markStart} className="scroll-mt-20 bg-white p-6 sm:p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-muted">Agenda tu asesoría</p>
            <h2 className="mt-1 font-display text-2xl leading-none text-lukx-charcoal">Tus datos</h2>
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor={id + "-hp"}>Sitio web</label>
              <input id={id + "-hp"} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            {attr ? Object.entries(attr).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} readOnly />) : null}
            <div className="mt-3 grid gap-2.5">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Nombre</span>
                <input ref={id === "agenda" ? nameRef : undefined} required autoComplete="name" value={name} onFocus={markStart} onChange={(event) => setName(event.target.value)} className={fieldClass} style={{ outline: "none" }} />
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
                  className={fieldClass} style={{ outline: "none" }}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-lukx-charcoal">Correo</span>
                <input required type="email" autoComplete="email" value={email} onFocus={markStart} onChange={(event) => setEmail(event.target.value)} className={fieldClass} style={{ outline: "none" }} />
              </label>

              {error && !open ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className="btn-green w-full disabled:opacity-50">
                {submitting ? "Guardando…" : "Agendar asesoría"}
              </button>
              <label className="flex items-start gap-3 text-sm text-lukx-charcoal">
                <input type="checkbox" required checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} className="mt-1 size-4 accent-lukx-green-btn" />
                <span>
                  Acepto el{" "}
                  <a href={site.privacyPdf} target="_blank" rel="noreferrer" className="text-lukx-green-btn underline">
                    aviso de privacidad
                  </a>
                </span>
              </label>
            </div>
          </form>
  );

  return (
    <article className={showMobileCta && !open ? "pb-20 md:pb-0" : undefined}>
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
        <div className="site-container relative z-10 grid items-start gap-8 pt-28 pb-10 lg:grid-cols-[1.1fr_minmax(0,26rem)] lg:gap-12 lg:pt-32 lg:pb-16">
          <div className="max-w-xl text-white lg:self-end">
            <h1 className="font-display text-balance text-[2.5rem] leading-[0.95] sm:text-[3.5rem] lg:text-[4rem]">{pag.h1}</h1>
            <p className="mt-2 max-w-md text-sm leading-snug text-white/90">{pag.sub}</p>
          </div>
          {contactForm("agenda")}
        </div>
      </section>

      <section className="bg-white pt-14 pb-4 text-lukx-charcoal md:pt-20 md:pb-8">
        <div className="site-container">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="relative col-span-2 min-h-64 md:col-span-1 md:row-span-2 md:min-h-[440px]">
              <Image src="/images/residencial-tecnico-lukx.webp" alt="Imagen recreada a partir de una foto de un técnico junto a inversores solares" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-1">
              <Image src="/images/residencial-respaldo-detalle.webp" alt="Imagen recreada a partir de una instalación de respaldo de Lukx" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-center" />
            </div>
            <dl className="col-span-2 grid grid-cols-2 gap-2 md:col-span-1 md:gap-3">
              <div className="flex flex-col-reverse justify-end bg-lukx-green-btn p-4 text-white sm:p-6">
                <dt className="mt-1 text-sm font-semibold">años de experiencia</dt>
                <dd className="font-display text-4xl leading-none sm:text-5xl">+15</dd>
              </div>
              <div className="flex min-h-32 flex-col-reverse justify-end bg-black p-4 text-white sm:p-6">
                <dt className="mt-1 text-sm font-semibold">proyectos</dt>
                <dd className="font-display text-4xl leading-none sm:text-5xl">+5,000</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>


      <section className="bg-white py-16 text-lukx-charcoal md:py-24">
        <div className="site-container">
          <div className="grid gap-5 border-b border-black/15 pb-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12">
            <h2 className="max-w-xl text-balance font-display text-4xl leading-none md:text-6xl">Soluciones para tu hogar</h2>
            <p className="max-w-md text-sm leading-relaxed text-lukx-muted md:text-base">Reduce tu consumo de CFE, protege tus equipos esenciales cuando se va la luz o integra ambas soluciones en un solo sistema.</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <Image src="/images/residencial-casa-paneles.webp" alt="Imagen ilustrativa de una casa con paneles solares visibles en el techo" width={1448} height={1086} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full self-start object-cover" />
            <ul className="divide-y divide-black/15 border-y border-black/15">
              {SOLUTIONS.map(([title, copy]) => (
                <li key={title} className="py-5 md:py-6">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-lukx-muted">{copy}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-lukx-muted">Pregunta por nuestras opciones de financiamiento.</p>
        </div>
      </section>

      <section className="bg-lukx-charcoal text-white">
        <div className="site-frame grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="site-gutter flex flex-col items-start justify-center py-14 lg:py-20">
            <h2 className="text-balance font-display text-4xl leading-none md:text-6xl">Que tu casa siga funcionando cuando se va la luz</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/85">Piensa en lo que no puede apagarse en tu casa. Con esa lista puedes saber qué necesitas respaldar y por cuánto tiempo.</p>
            <a href="/sistemas-de-respaldo-de-energia-en-baterias" className="btn-green mt-7">Más información</a>
          </div>
          <Image src="/images/residencial-respaldo-nocturno.webp" alt="Escena ilustrativa de una casa iluminada cuando se va la luz" width={1672} height={941} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video h-full w-full object-cover lg:aspect-auto" />
        </div>
      </section>

      <section className="bg-lukx-light py-16 text-lukx-charcoal md:py-24">
        <div className="site-container">
          <h2 className="max-w-2xl text-balance font-display text-4xl leading-none md:text-6xl">De tu asesoría a la instalación</h2>
          <ol className="relative mt-9 grid gap-7 before:absolute before:bottom-8 before:left-6 before:top-6 before:w-px before:bg-lukx-green-btn/35 lg:grid-cols-5 lg:gap-5 lg:before:inset-x-6 lg:before:bottom-auto lg:before:h-px lg:before:w-auto">
            {PROCESS.map(([title, copy, icon], index) => (
              <li key={title} className="relative grid grid-cols-[3rem_1fr] items-start gap-4 lg:grid-cols-1 lg:grid-rows-[3rem_1fr] lg:gap-5">
                <span className="grid size-12 place-items-center border border-lukx-green-btn bg-lukx-light text-lukx-green-btn" aria-hidden>
                  <Icon icon={icon} className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-lukx-green-btn" aria-hidden>{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-lg leading-tight font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-lukx-muted">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {process.env.NODE_ENV === "development" ? <DemoReviews /> : null}

      <section className="bg-white py-16 md:py-24">
        <div className="site-container grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:gap-12">
          <div className="flex flex-col items-start justify-between gap-8">
            <h2 className="text-balance font-display text-4xl leading-none text-lukx-charcoal md:text-6xl">Preguntas frecuentes</h2>
          </div>
          <FaqAccordion items={pag.faq.map((item) => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>

      <section id="agenda-final" className="relative isolate overflow-hidden bg-lukx-charcoal px-4 py-20 text-center text-white md:py-32">
        <Image src="/images/residencial-paneles-detalle-concreto.webp" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden />
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance font-display text-4xl leading-none md:text-6xl">Diseñemos la energía de tu casa</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu hogar.</p>
          <a href="#agenda" className="btn-green mt-7">Agendar asesoría</a>
        </div>
      </section>

      {showMobileCta && !open ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <a href="#agenda" className="btn-green w-full">Agendar asesoría</a>
        </div>
      ) : null}


      <footer className="bg-lukx-charcoal py-8 text-sm text-white/85 md:py-10">
        <div className="site-container flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <address className="flex flex-col items-start gap-2 not-italic">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href={`tel:${site.phoneOfficeTel}`} className="underline">{site.phoneOffice}</a>
              <a href={`mailto:${site.email}`} className="underline">{site.email}</a>
            </div>
            <span>{site.address}</span>
          </address>
          <div className="flex flex-col items-start gap-2 border-t border-white/15 pt-4 md:items-end md:border-0 md:pt-0">
            <a href={site.privacyPdf} className="underline">Aviso de privacidad</a>
            <span>© 2026 Lukx</span>
          </div>
        </div>
      </footer>

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
            <button ref={closeRef} type="button" onClick={closeModal} aria-label="Cerrar" className="group grid cursor-pointer place-items-center px-3 py-2 text-sm font-semibold text-lukx-charcoal">
              <span aria-hidden className="col-start-1 row-start-1 group-hover:invisible">Cerrar</span>
              <span aria-hidden className="pointer-events-none col-start-1 row-start-1 text-3xl leading-none opacity-0 group-hover:opacity-100 motion-safe:scale-75 motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-out motion-safe:group-hover:scale-100">×</span>
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
              <div key={phase} className="quote-step">
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
                {phase === "motivo" ? (
                  <CardStep title="¿Qué te motiva más?" name="motivo" options={MOTIVOS} value={motivo} disabled={submitting} onPick={(value) => { setMotivo(value); go("comentarios"); }} onBack={() => go("interes")} />
                ) : null}
                {phase === "comentarios" ? (
                  <form className="mt-5" onSubmit={(event) => { event.preventDefault(); void finishProfile(); }}>
                    <label htmlFor="lp-residential-comment" className="font-display text-4xl">¿Tienes alguna pregunta o comentario adicional?</label>
                    <textarea id="lp-residential-comment" className={`${fieldClass} mt-4`} rows={4} maxLength={500} placeholder="Escribe aquí (opcional)" value={comment} disabled={submitting} onChange={(event) => setComment(event.target.value)} />
                    <div className="mt-4 flex items-center gap-5">
                      <button type="button" disabled={submitting} onClick={() => go("motivo")} className="text-sm font-semibold hover:underline disabled:opacity-40">Atrás</button>
                      <button type="submit" disabled={submitting} className="btn-green disabled:opacity-40">Continuar</button>
                    </div>
                  </form>
                ) : null}
                {phase === "cita" && token ? (
                  <div className="mt-5">
                    <BookingScheduler
                      resumeToken={token}
                      guestName={name}
                      trackingPage={PAGE}
                      onBack={() => go("comentarios")}
                      onScheduled={() => {
                        setBooked(true);
                        pushDataLayer("schedule_appointment", { pagina: PAGE, ciudad: city === "Otro" ? "" : city });
                      }}
                    />
                  </div>
                ) : null}
              </div>
              {error && open ? <p className="mt-4 text-sm text-red-600" role="alert">{error}</p> : null}
            </div>
          </div>
        </div>
      </dialog>
    </article>
  );
}
