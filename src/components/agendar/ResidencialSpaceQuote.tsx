"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import BookingScheduler from "@/components/BookingScheduler";
import FaqAccordion from "@/components/FaqAccordion";
import HeroScrim from "@/components/HeroScrim";
import QuoteOptionIcon from "@/components/agendar/QuoteOptionIcon";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectsCarousel from "@/components/home/ProjectsCarousel";
import ExitIntentLead from "@/components/agendar/ExitIntentLead";
import { site } from "@/data/site";
import { EMPTY_QUOTE_ANSWERS, getQuoteQuestions, updateQuoteAnswers, quoteResponses, type QuoteAnswers, type QuestionId, type QuotePhase, type QuoteQuestion } from "@/lib/quote-flow";
import { captureAttribution, pushDataLayer, type Attribution } from "@/lib/attribution";
import type { Pag } from "@/content/agendar-copys-v2";
import type { SectorQuote } from "@/content/sector-quotes";

const SOLUTIONS = [
  ["Paneles solares", "Genera tu propia energía y reduce lo que pagas a CFE. Dimensionamos el sistema según tu consumo y el espacio disponible en tu techo."],
  ["Sistemas de respaldo", "Con baterías, tus equipos esenciales, como el refrigerador, el internet y la iluminación, siguen funcionando cuando se va la luz."],
] as const;

const PROCESS = [
  ["Asesoría", "Analizamos tu consumo y lo que necesitas respaldar.", "solar:chat-round-dots-linear"],
  ["Propuesta", "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión.", "solar:document-text-linear"],
  ["Visita técnica", "Revisamos tu domicilio para confirmar el diseño y la instalación.", "solar:map-point-linear"],
  ["Instalación y supervisión", "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo.", "solar:settings-linear"],
] as const;

function interestIcon(option: string) {
  const value = option.toLowerCase();
  if (value.includes("iluminación")) return "solar:lightbulb-linear";
  if (value.includes("carga")) return "solar:bolt-linear";
  if (value.includes("ambos") || value.includes("las dos")) return "solar:layers-linear";
  if (value.includes("respaldo") || value.includes("bater")) return "solar:battery-charge-linear";
  if (value.includes("panel") || value.includes("generaci") || value.includes("solar")) return "solar:sun-linear";
  if (value.includes("no ") || value.includes("aún") || value.includes("aun")) return "solar:question-circle-linear";
  return "solar:map-point-linear";
}

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
                {option === "Estaciones de carga" ? <QuoteOptionIcon option={option} className="size-7 shrink-0 text-lukx-green-btn" /> : <Icon icon={icons[option] ?? "solar:map-point-linear"} className="size-7 shrink-0 text-lukx-green-btn" aria-hidden />}
                <span className="text-base font-semibold text-lukx-charcoal">{option}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function QuestionStep({ question, value, disabled, onPick, onBack }: { question: QuoteQuestion; value: string; disabled: boolean; onPick: (value: string) => void; onBack?: () => void }) {
  const [draft, setDraft] = useState(value);
  const selected = draft ? draft.split("; ") : [];
  const back = onBack ? <button type="button" disabled={disabled} onClick={onBack} className="cursor-pointer text-sm font-semibold hover:underline disabled:opacity-40">Atrás</button> : null;
  if (question.options && !question.multiple) return <div className="mt-5"><ChoiceCards name={question.id} legend={question.title} options={question.options} icons={Object.fromEntries(question.options.map((option) => [option, interestIcon(option)]))} value={value} disabled={disabled} onPick={onPick} /><div className="mt-4">{back}</div></div>;
  return (
    <form className="mt-5" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) onPick(draft.trim()); }}>
      {question.multiple && question.options ? (
        <fieldset disabled={disabled} aria-describedby="quote-selection-hint" className="min-w-0 border-0 p-0">
          <legend className="font-display text-3xl leading-none md:text-4xl">{question.title}</legend>
          <p id="quote-selection-hint" className="mt-3 text-sm text-lukx-muted">{question.id === "area_iluminacion" ? "Puedes seleccionar varias áreas." : question.id === "uso_carga" ? "Puedes seleccionar varios usos." : "Puedes seleccionar varios equipos."}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {question.options.map((option) => (
              <label key={option} className="cursor-pointer">
                <input type="checkbox" name={question.id} value={option} checked={selected.includes(option)} onChange={(event) => setDraft((event.target.checked ? [...selected, option] : selected.filter((item) => item !== option)).join("; "))} className="peer sr-only" />
                <span className="relative flex min-h-32 flex-col items-center justify-center gap-3 border-2 border-black/10 bg-white px-3 py-5 text-center hover:border-lukx-green-btn hover:bg-[#f3faf4] peer-checked:border-lukx-green-btn peer-checked:bg-[#f3faf4] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lukx-green motion-safe:transition motion-safe:duration-150">
                  <span aria-hidden className={`absolute right-2 top-2 grid size-5 place-items-center rounded-sm border ${selected.includes(option) ? "border-lukx-green-btn bg-lukx-green-btn text-white" : "border-black/20"}`}>{selected.includes(option) ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block size-3.5"><path d="m3.5 8 3 3 6-6" /></svg> : null}</span>
                  <QuoteOptionIcon option={option} className="size-10 text-lukx-green-btn" />
                  <span className="text-sm font-semibold leading-snug">{option}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <>
          <label htmlFor={`quote-${question.id}`} className="font-display text-3xl leading-none md:text-4xl">{question.title}</label>
          {question.inputType === "text" ? <input id={`quote-${question.id}`} type="text" aria-describedby={`quote-${question.id}-count`} required maxLength={question.maxLength ?? 300} value={draft} disabled={disabled} placeholder={question.placeholder} onChange={(event) => setDraft(event.target.value)} className={`${fieldClass} mt-4`} /> : <textarea id={`quote-${question.id}`} aria-describedby={`quote-${question.id}-count`} required maxLength={question.maxLength ?? 300} rows={3} value={draft} disabled={disabled} placeholder={question.placeholder} onChange={(event) => setDraft(event.target.value)} className={`${fieldClass} mt-4`} />}
          <p id={`quote-${question.id}-count`} className="mt-1 text-xs text-lukx-muted">{(question.maxLength ?? 300) - draft.length} caracteres disponibles</p>
        </>
      )}
      <div className="mt-4 flex items-center gap-5">{back}<button type="submit" disabled={disabled || !draft.trim()} className="btn-green disabled:opacity-40">Continuar</button></div>
    </form>
  );
}

type PortfolioSlide = {
  imageAlt?: string;
  gallery?: string[];
  galleryAlts?: string[];
  title: string;
  slug: string;
  image: string;
  category?: string;
};

export default function ResidencialSpaceQuote({
  pag,
  pagePath,
  content,
  projects = [],
}: {
  pag?: Pag;
  pagePath: string;
  content?: SectorQuote;
  projects?: PortfolioSlide[];
}) {
  if (!content && !pag) throw new Error("Falta el contenido de la landing.");
  const h1 = content?.h1 ?? pag!.h1;
  const sub = content?.sub ?? pag!.sub;
  const faqs = content?.faqs ?? pag!.faq;
  const solutions = content?.solutions ?? SOLUTIONS;
  const processSteps = content?.process ?? PROCESS;
  const sector = content?.linea ?? "residencial";
  const [answers, setAnswers] = useState<QuoteAnswers>({ ...EMPTY_QUOTE_ANSWERS });
  const questions = getQuoteQuestions(sector, answers);
  const phases: QuotePhase[] = [...questions.map((question) => question.id), "comentarios", "cita"];
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [phase, setPhase] = useState<QuotePhase>("interes");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const city = answers.ciudad;
  const question = questions.find((item) => item.id === phase);
  const resumePhase = () => questions.find((item) => !answers[item.id])?.id ?? "comentarios";
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
  const contactDialogRef = useRef<HTMLDialogElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const captured = captureAttribution();
    // Attribution only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(captured);
  }, []);

  useEffect(() => {
    const dialog = contactDialogRef.current;
    if (!dialog) return;
    if (contactOpen && !dialog.open) dialog.showModal();
    if (!contactOpen && dialog.open) dialog.close();
  }, [contactOpen]);

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
    document.body.style.overflow = open || contactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, contactOpen]);

  useEffect(() => {
    if (open) questionRef.current?.focus();
  }, [phase, open]);

  function markStart() {
    if (tracked.current.start) return;
    tracked.current.start = true;
    pushDataLayer("form_start", { pagina: pagePath });
  }

  function closeModal() {
    setOpen(false);
    setError(null);
    nameRef.current?.focus();
  }

  function openQuote() {
    if (token) {
      setContactOpen(false);
      setPhase(resumePhase());
      setOpen(true);
      return;
    }
    setContactOpen(true);
  }

  function profileAnswers(extra: Partial<QuoteAnswers> = {}, currentComment = comment) {
    const current = { ...answers, ...extra };
    const respuestas = { Nombre: name, WhatsApp: whatsapp, "Correo electrónico": email, ...quoteResponses(sector, current, currentComment) };
    return { respuestas, chosenCity: current.ciudad, chosenRecibo: current.recibo, chosenInteres: current.interes };
  }

  async function postLead(extra: Partial<QuoteAnswers> = {}, currentComment = comment) {
    const attribution = attr ?? captureAttribution();
    const { respuestas, chosenCity, chosenRecibo, chosenInteres } = profileAnswers(extra, currentComment);
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
        ciudad: chosenCity,
        recibo: chosenRecibo,
        necesidad: chosenInteres,
        replaceSolutionDetails: Boolean(chosenInteres),
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
        pushDataLayer("form_step_2", { pagina: pagePath });
      }
      setPhase(resumePhase());
      setContactOpen(false);
      setOpen(true);
      return;
    }
    setSubmitting(true);
    try {
      const leadToken = await postLead({});
      setToken(leadToken);
      if (!tracked.current.step2) {
        tracked.current.step2 = true;
        pushDataLayer("form_step_2", { pagina: pagePath });
      }
      if (!tracked.current.lead) {
        tracked.current.lead = true;
        pushDataLayer("generate_lead", {
          linea: content?.linea ?? "residencial",
          necesidad: "",
          ciudad: "",
          tiene_paneles: "",
          pagina: pagePath,
        });
      }
      setPhase("interes");
      setContactOpen(false);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tus datos.");
    } finally {
      setSubmitting(false);
    }
  }

  function go(next: QuotePhase) {
    setError(null);
    setPhase(next);
  }

  async function pickQuestion(id: QuestionId, value: string) {
    if (busy.current || !token) return;
    const updated = updateQuoteAnswers(sector, answers, id, value);
    setAnswers(updated);
    if (id === "interes" && answers.interes !== value) setComment("");
    setError(null);
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead(updated, id === "interes" && answers.interes !== value ? "" : comment);
      setToken(leadToken);
      const nextQuestions = getQuoteQuestions(sector, updated);
      const index = nextQuestions.findIndex((item) => item.id === id);
      go(nextQuestions[index + 1]?.id ?? "comentarios");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta. Intenta de nuevo.");
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

  const stepNumber = Math.max(1, phases.indexOf(phase) + 1);
  const stepCount = phases.length;

  const contactForm = (id: string, modal = false) => (
    <form id={id} onSubmit={onContact} onFocus={markStart} className={modal ? "p-6 sm:p-8" : "scroll-mt-20 bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:p-8"}>
            {modal ? (
              <>
                <span className="mb-5 block h-0.5 w-10 bg-lukx-green-btn" aria-hidden />
                <div className="flex items-start justify-between gap-4">
                  <h2 id={id + "-title"} data-no-split className="text-balance font-display text-4xl leading-none">Agenda tu asesoría</h2>
                  <button type="button" onClick={() => setContactOpen(false)} aria-label="Cerrar" className="px-1 text-2xl leading-none text-lukx-charcoal">×</button>
                </div>
                <p className="mt-4 text-base leading-relaxed text-lukx-muted">Deja tus datos para continuar.</p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lukx-muted">Agenda tu asesoría</p>
                <h2 className="mt-1 font-display text-2xl leading-none text-lukx-charcoal">Tus datos</h2>
              </>
            )}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor={id + "-hp"}>Sitio web</label>
              <input id={id + "-hp"} tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            {attr ? Object.entries(attr).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} readOnly />) : null}
            <div className={modal ? "mt-4 grid gap-3" : "mt-3 grid gap-2.5"}>
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
      <section className="relative flex min-h-[42rem] flex-col justify-end bg-lukx-black md:min-h-[46rem]">
        <div className={content ? "absolute inset-0" : "absolute inset-x-0 top-[72px] bottom-0"}>
          <Image
            src={content?.heroImage ?? "/images/residencial-hero-fachada.webp"}
            alt={content?.heroAlt ?? "Imagen ilustrativa de una casa de dos pisos con fachada, cochera y paneles solares en la azotea"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <HeroScrim />
        </div>
        <div className="site-container relative z-10 grid items-end gap-8 pt-28 pb-12 lg:grid-cols-[1.1fr_minmax(0,26rem)] lg:gap-12 lg:pb-16">
          <div className="max-w-xl text-white lg:self-end">
            <h1 className="font-display text-balance text-[2.5rem] leading-[0.95] sm:text-[3.5rem] lg:text-[4rem]">{h1}</h1>
            <p className="mt-2 max-w-md text-sm leading-snug text-white/90">{sub}</p>
          </div>
          {contactForm("agenda")}
        </div>
      </section>

      <section className="bg-white pt-10 pb-4 text-lukx-charcoal md:pt-14 md:pb-6">
        <div className="site-container">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="relative col-span-2 min-h-64 md:col-span-1 md:row-span-2 md:min-h-[440px]">
              <Image src={content?.mosaicA ?? "/images/residencial-tecnico-lukx.webp"} alt={content?.mosaicAAlt ?? "Imagen recreada a partir de una foto de un técnico junto a inversores solares"} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-1">
              <Image src={content?.mosaicB ?? "/images/residencial-respaldo-detalle.webp"} alt={content?.mosaicBAlt ?? "Imagen recreada a partir de una instalación de respaldo de Lukx"} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-center" />
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

      <section className="bg-white pt-12 pb-16 text-lukx-charcoal md:pt-16 md:pb-20">
        <div className="site-container">
          <div className="grid gap-5 border-b border-black/15 pb-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12">
            <h2 data-no-split className="max-w-xl text-balance font-display text-4xl leading-none md:text-5xl">{content?.solutionsTitle ?? "Soluciones para tu hogar"}</h2>
            <p className="max-w-md text-sm leading-relaxed text-lukx-muted md:text-base">{content?.solutionsIntro ?? "Reduce tu consumo de CFE o protege tus equipos esenciales cuando se va la luz."}</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <Image src={content?.solutionImage ?? "/images/2025-07-proyecto-rinconada-patos.jpg"} alt={content?.solutionAlt ?? "Paneles solares instalados sobre la azotea de una casa"} width={1448} height={1086} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full self-start object-cover" />
            <ul className={content ? "divide-y divide-black/15 border-y border-black/15" : "divide-y divide-black/15 border-t border-black/15"}>
              {solutions.map(([title, copy]) => (
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
          <div className="site-gutter flex flex-col items-start justify-center py-12 lg:py-16">
            <h2 data-no-split className="text-balance font-display text-4xl leading-none md:text-5xl">{content?.backupTitle ?? "Que tu casa siga funcionando cuando se va la luz"}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/85">{content?.backupText ?? "Piensa en lo que no puede apagarse en tu casa. Con esa lista puedes saber qué necesitas respaldar y por cuánto tiempo."}</p>
            <button type="button" onClick={openQuote} className="btn-green mt-7">Más información</button>
          </div>
          <div className="relative aspect-video lg:aspect-auto">
            <Image src={content?.backupImage ?? "/images/residencial-respaldo-nocturno.webp"} alt={content?.backupAlt ?? "Escena ilustrativa de una casa iluminada cuando se va la luz"} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-lukx-light py-16 text-lukx-charcoal md:py-20">
        <div className="site-container">
          <h2 data-no-split className="max-w-2xl text-balance font-display text-4xl leading-none md:text-5xl">De tu asesoría a la instalación</h2>
          <ol className="relative mt-9 grid gap-7 before:absolute before:bottom-8 before:left-6 before:top-6 before:w-px before:bg-lukx-green-btn/35 lg:grid-cols-4 lg:gap-5 lg:before:inset-x-6 lg:before:bottom-auto lg:before:h-px lg:before:w-auto">
            {processSteps.map(([title, copy, icon], index) => (
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

      {projects.length ? (pagePath.startsWith("/lp/") ? <ProjectGallery projects={projects} /> : <ProjectsCarousel projects={projects} tone="light" />) : null}

      <section className="bg-white py-16 md:py-20">
        <div className="site-container grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:gap-12">
          <div className="flex flex-col items-start justify-between gap-8">
            <h2 data-no-split className="text-balance font-display text-4xl leading-none text-lukx-charcoal md:text-5xl">Preguntas frecuentes</h2>
          </div>
          <FaqAccordion items={faqs.map((item) => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>

      <section id="agenda-final" className="relative isolate overflow-hidden bg-lukx-charcoal px-4 py-20 text-center text-white md:py-32">
        <Image src={content?.closeImage ?? "/images/residencial-paneles-detalle-concreto.webp"} alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden />
        <div className="mx-auto max-w-2xl">
          <h2 data-no-split className="text-balance font-display text-4xl leading-none md:text-6xl">{content?.closeTitle ?? "Diseñemos la energía de tu casa"}</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">{content?.closeText ?? "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu hogar."}</p>
          <button type="button" onClick={openQuote} className="btn-green mt-7">Agendar asesoría</button>
        </div>
      </section>

      {showMobileCta && !open && !contactOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <button type="button" onClick={openQuote} className="btn-green w-full">Agendar asesoría</button>
        </div>
      ) : null}


      {pagePath.startsWith("/lp/") ? (
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
      ) : null}

      <dialog
        ref={contactDialogRef}
        className="quote-contact bg-white text-lukx-charcoal"
        aria-labelledby="agenda-modal-title"
        onCancel={(event) => {
          event.preventDefault();
          setContactOpen(false);
        }}
        onClick={(event) => {
          if (event.target === contactDialogRef.current) setContactOpen(false);
        }}
      >
        {contactForm("agenda-modal", true)}
      </dialog>

      <dialog
        ref={dialogRef}
        data-lenis-prevent
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
                    <AdvisorBubble text={question?.bubble ?? (phase === "cita" ? "Elige el día y la hora. La asesoría es por llamada o videollamada." : "Si tienes dudas o algo más que contarnos, puedes dejarlo aquí.")} />
                  </div>
                </>
              )}
              <div key={phase} ref={questionRef} tabIndex={-1} role="group" aria-label={question?.title ?? (phase === "cita" ? "Agenda tu asesoría" : "Comentarios")} className="quote-step outline-none" style={{ outline: "none" }}>
                {question ? <QuestionStep key={phase} question={question} value={answers[question.id]} disabled={submitting} onPick={(value) => void pickQuestion(question.id, value)} onBack={stepNumber > 1 ? () => go(phases[stepNumber - 2]) : undefined} /> : null}
                {phase === "comentarios" ? (
                  <form className="mt-5" onSubmit={(event) => { event.preventDefault(); void finishProfile(); }}>
                    <label htmlFor="lp-residential-comment" className="font-display text-4xl">¿Tienes alguna pregunta o comentario adicional?</label>
                    <textarea id="lp-residential-comment" className={`${fieldClass} mt-4`} rows={4} maxLength={500} placeholder="Escribe aquí (opcional)" value={comment} disabled={submitting} onChange={(event) => setComment(event.target.value)} />
                    <div className="mt-4 flex items-center gap-5">
                      <button type="button" disabled={submitting} onClick={() => go(questions[questions.length - 1].id)} className="text-sm font-semibold hover:underline disabled:opacity-40">Atrás</button>
                      <button type="submit" disabled={submitting} className="btn-green disabled:opacity-40">Continuar</button>
                    </div>
                  </form>
                ) : null}
                {phase === "cita" && token ? (
                  <div className="mt-5">
                    <BookingScheduler
                      resumeToken={token}
                      guestName={name}
                      trackingPage={pagePath}
                      onBack={() => go("comentarios")}
                      onScheduled={() => {
                        setBooked(true);
                        pushDataLayer("schedule_appointment", { pagina: pagePath, ciudad: city === "Otro" ? answers.ciudad_otra : city });
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
      {pagePath.startsWith("/lp/") ? (
        <ExitIntentLead pagePath={pagePath} linea={content?.linea ?? "residencial"} suspended={open || contactOpen || Boolean(token)} />
      ) : null}
    </article>
  );
}
