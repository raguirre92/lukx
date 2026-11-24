"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import BookingScheduler from "@/components/BookingScheduler";
import FaqAccordion from "@/components/FaqAccordion";
import HeroScrim from "@/components/HeroScrim";
import { site } from "@/data/site";
import { CIUDADES } from "@/lib/agendar-config";
import { captureAttribution, pushDataLayer, type Attribution } from "@/lib/attribution";
import { landingForPath, type LandingStep } from "@/content/space-landings";

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
  onBack?: () => void;
}) {
  return (
    <div className="mt-5">
      <ChoiceCards name={name} legend={title} options={options} icons={{}} value={value} disabled={disabled} onPick={onPick} />
      {onBack ? (
        <button type="button" disabled={disabled} onClick={onBack} className="mt-4 text-sm font-semibold underline-offset-2 hover:underline disabled:opacity-40">
          Atrás
        </button>
      ) : null}
    </div>
  );
}

export default function SpaceQuote({ pagePath }: { pagePath: string }) {
  const landing = landingForPath(pagePath);
  const steps = landing.steps;
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState(steps[0]?.id ?? "ciudad");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [honeypot, setHoneypot] = useState("");
  const [recibo, setRecibo] = useState("");
  const [interes, setInteres] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef<Record<string, string>>({});
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
    pushDataLayer("form_start", { pagina: pagePath });
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
  } = {}) {
    const respuestas: Record<string, string> = {
      Nombre: name,
      WhatsApp: whatsapp,
      "Correo electrónico": email,
    };
    const chosenCity = extra.city ?? city;
    const chosenRecibo = extra.recibo ?? recibo;
    const chosenInteres = extra.interes ?? interes;
    if (chosenCity) respuestas["Ciudad o municipio"] = chosenCity;
    if (chosenRecibo) respuestas["¿Cuánto pagas de luz al bimestre, aproximadamente?"] = chosenRecibo;
    if (chosenInteres) respuestas["¿Qué te interesa?"] = chosenInteres;
    for (const step of landing.steps) {
      const value = answersRef.current[step.id] ?? answers[step.id];
      if (value && step.respuesta && !respuestas[step.respuesta]) respuestas[step.respuesta] = value;
    }
    return { respuestas, chosenCity, chosenRecibo, chosenInteres };
  }

  async function postLead(extra: {
    city?: string;
    recibo?: string;
    interes?: string;
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
        pagina: pagePath,
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
        pushDataLayer("form_step_2", { pagina: pagePath });
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
        pushDataLayer("form_step_2", { pagina: pagePath });
      }
      if (!tracked.current.lead) {
        tracked.current.lead = true;
        pushDataLayer("generate_lead", {
          linea: pagePath.includes("comercial") ? "comercial" : pagePath.includes("industrial") ? "industrial" : pagePath.includes("asesoria") ? "general" : "residencial",
          necesidad: "",
          ciudad: "",
          tiene_paneles: "",
          pagina: pagePath,
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
      go(nextStepId("ciudad"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu ciudad.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  function nextStepId(current: string) {
    const index = steps.findIndex((step) => step.id === current);
    return steps[Math.min(index + 1, steps.length - 1)]?.id ?? current;
  }

  function prevStepId(current: string) {
    const index = steps.findIndex((step) => step.id === current);
    return steps[Math.max(index - 1, 0)]?.id ?? current;
  }

  function go(next: string) {
    setError(null);
    setPhase(next);
  }

  function preselectSpace(space: string) {
    answersRef.current = { ...answersRef.current, espacio: space };
    setAnswers({ ...answersRef.current });
    document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth", block: "start" });
    nameRef.current?.focus();
  }

  async function pickChoice(step: LandingStep, value: string) {
    if (busy.current || !token) return;
    answersRef.current = { ...answersRef.current, [step.id]: value };
    setAnswers(answersRef.current);
    if (step.commit === "interes") setInteres(value);
    if (step.commit === "recibo") setRecibo(value);
    setError(null);
    const next = nextStepId(step.id);
    if (!step.commit) {
      go(next);
      return;
    }
    busy.current = true;
    setSubmitting(true);
    try {
      const leadToken = await postLead(
        step.commit === "recibo" ? { recibo: value } : step.commit === "interes" ? { interes: value } : {},
      );
      setToken(leadToken);
      go(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar tu respuesta.");
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  }

  const stepNumber = Math.max(1, steps.findIndex((step) => step.id === phase) + 1);
  const stepCount = steps.length;
  const activeStep = steps.find((step) => step.id === phase);

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
                {submitting ? "Guardando…" : landing.cta}
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
            src={landing.heroImage}
            alt={landing.heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <HeroScrim />
        </div>
        <div className="relative z-10 mx-auto grid max-w-[1180px] items-start gap-8 px-4 pt-28 pb-10 md:px-8 lg:grid-cols-[1.1fr_minmax(0,26rem)] lg:gap-12 lg:pt-32 lg:pb-16">
          <div className="max-w-xl text-white lg:self-end">
            <h1 className="font-display text-balance text-[2rem] leading-[0.95] lg:text-[3.2rem]">{landing.h1}</h1>
            <p className="mt-2 max-w-md text-sm leading-snug text-white/90">{landing.sub}</p>
            {landing.bullets.length ? (
              <ul className="mt-3 space-y-1.5">
                {landing.bullets.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-snug text-white">
                    <Icon icon="solar:check-circle-bold" className="mt-0.5 size-5 shrink-0 text-lukx-green" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {contactForm("agenda")}
        </div>
      </section>

      <section className="bg-white pt-14 pb-4 text-lukx-charcoal md:pt-20 md:pb-8">
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="relative col-span-2 min-h-64 md:col-span-1 md:row-span-2 md:min-h-[440px]">
              <Image src="/images/residencial-tecnico-lukx.webp" alt="Imagen recreada a partir de una foto de un técnico junto a inversores solares" fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-1">
              <Image src="/images/residencial-respaldo-detalle.webp" alt="Imagen recreada a partir de una instalación de respaldo de Lukx" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-center" />
            </div>
            <dl className="col-span-2 grid grid-cols-2 gap-2 md:col-span-1 md:gap-3">
              <div className="flex flex-col-reverse justify-end bg-lukx-green-btn p-4 text-white sm:p-6">
                <dt className="mt-1 text-sm font-semibold">{landing.statsNote ?? "años de experiencia"}</dt>
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
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <div className="grid gap-5 border-b border-black/15 pb-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-12">
            <h2 className="max-w-xl text-balance font-display text-4xl leading-none md:text-6xl">{landing.solutionsTitle}</h2>
            <p className="max-w-md text-sm leading-relaxed text-lukx-muted md:text-base">{landing.solutionsIntro}</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <Image src={landing.solutionImage} alt={landing.solutionAlt} width={1448} height={1086} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/3] w-full self-start object-cover" />
            <ul className="divide-y divide-black/15 border-y border-black/15">
              {(landing.spaceLinks ?? landing.solutions.map((item) => ({ href: "", label: item.title, text: item.text, space: undefined }))).map((item) => (
                <li key={item.label} className="py-5 md:py-6">
                  <h3 className="text-lg font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-lukx-muted">{item.text}</p>
                  {item.space || item.href ? (
                    <p className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                      {item.space ? (
                        <button type="button" onClick={() => preselectSpace(item.space!)} className="underline-offset-2 hover:underline">
                          Agendar para este espacio
                        </button>
                      ) : null}
                      {item.href ? (
                        <a href={item.href} className="underline-offset-2 hover:underline">Ver esta landing</a>
                      ) : null}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          {landing.quienes ? <p className="mt-6 max-w-3xl text-sm leading-relaxed text-lukx-muted">{landing.quienes}</p> : null}
          {landing.extra ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-lukx-muted">{landing.extra}</p> : null}
          {landing.why ? (
            <>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {landing.why.map((item) => (
                  <li key={item.title} className="border border-black/10 p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-lukx-muted">{item.text}</p>
                  </li>
                ))}
              </ul>
              {landing.footnote ? <p className="mt-3 text-xs text-lukx-muted">{landing.footnote}</p> : null}
            </>
          ) : null}
          <div className="mt-10 border-t border-black/10 pt-8">
            <h3 className="font-display text-3xl leading-none">{landing.financingTitle}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lukx-muted">{landing.financingText}</p>
            <a href="#agenda" className="btn-green mt-6">Agendar asesoría</a>
          </div>
        </div>
      </section>

      <section className="bg-lukx-charcoal text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-center px-4 py-14 md:px-8 lg:px-16 lg:py-20">
            <h2 className="text-balance font-display text-4xl leading-none md:text-6xl">{landing.backupTitle}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/85">{landing.backupText}</p>
            <a href={landing.backupHref} className="btn-green mt-7">{landing.backupCta}</a>
          </div>
          <Image src={landing.backupImage} alt={landing.backupAlt} width={1672} height={941} sizes="(min-width: 1024px) 60vw, 100vw" className="aspect-video h-full w-full object-cover lg:aspect-auto" />
        </div>
      </section>

      <section className="bg-lukx-light py-16 text-lukx-charcoal md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <h2 className="max-w-2xl text-balance font-display text-4xl leading-none md:text-6xl">{landing.processTitle}</h2>
          <ol className="relative mt-9 grid gap-7 before:absolute before:bottom-8 before:left-6 before:top-6 before:w-px before:bg-lukx-green-btn/35 lg:grid-cols-5 lg:gap-5 lg:before:inset-x-6 lg:before:bottom-auto lg:before:h-px lg:before:w-auto">
            {landing.process.map(({ title, text, icon }, index) => (
              <li key={title} className="relative grid grid-cols-[3rem_1fr] items-start gap-4 lg:grid-cols-1 lg:grid-rows-[3rem_1fr] lg:gap-5">
                <span className="grid size-12 place-items-center border border-lukx-green-btn bg-lukx-light text-lukx-green-btn" aria-hidden>
                  <Icon icon={icon} className="size-6" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-lukx-green-btn" aria-hidden>{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-lg leading-tight font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-lukx-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="demo-reviews-title" className="bg-white py-16 text-lukx-charcoal md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 md:px-8">
          <h2 className="font-display text-4xl leading-none md:text-6xl">{landing.projectsTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm text-lukx-muted">{landing.projectsText}</p>
          {landing.teamNote ? <p className="mt-4 max-w-2xl text-sm text-lukx-muted">{landing.teamNote}</p> : null}
          <p className="mt-8 text-xs font-semibold text-lukx-muted">Reseñas ficticias · Vista previa. No son testimonios de clientes.</p>
          <h3 id="demo-reviews-title" className="mt-2 font-display text-3xl leading-none md:text-5xl">{landing.reviewsTitle}</h3>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {landing.reviews.map((item) => (
              <li key={item.topic} className="border border-black/10 bg-lukx-light p-5">
                <blockquote className="text-base leading-relaxed">“{item.quote}”</blockquote>
                <p className="mt-4 border-t border-black/10 pt-3 text-xs font-semibold text-lukx-muted">{item.topic} · Reseña ficticia</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 md:grid-cols-[0.75fr_1.25fr] md:gap-12 md:px-8">
          <div className="flex flex-col items-start justify-between gap-8">
            <h2 className="text-balance font-display text-4xl leading-none text-lukx-charcoal md:text-6xl">Preguntas frecuentes</h2>
          </div>
          <FaqAccordion items={landing.faqs.map((item) => ({ question: item.q, answer: item.a }))} />
        </div>
      </section>

      <section id="agenda-final" className="relative isolate overflow-hidden bg-lukx-charcoal px-4 py-20 text-center text-white md:py-32">
        <Image src={landing.closeImage} alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden />
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance font-display text-4xl leading-none md:text-6xl">{landing.closeTitle}</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">{landing.closeText}</p>
          <a href="#agenda" className="btn-green mt-7">Agendar asesoría</a>
        </div>
      </section>

      {showMobileCta && !open ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <a href="#agenda" className="btn-green w-full">Agendar asesoría</a>
        </div>
      ) : null}


      <footer className="bg-lukx-charcoal px-4 py-8 text-sm text-white/85 md:px-10 md:py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
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
                    <AdvisorBubble text={activeStep?.bubble ?? ""} />
                  </div>
                </>
              )}
              <div key={phase} className="quote-step">
                {activeStep && activeStep.id !== "cita" && (activeStep.commit === "city" || activeStep.options) ? (
                  <CardStep
                    title={activeStep.legend}
                    name={activeStep.id}
                    options={activeStep.commit === "city" ? CIUDADES : activeStep.options ?? []}
                    value={activeStep.commit === "city" ? city : answers[activeStep.id] ?? ""}
                    disabled={submitting}
                    onPick={(value) => {
                      if (activeStep.commit === "city") void pickCity(value);
                      else void pickChoice(activeStep, value);
                    }}
                    onBack={activeStep.id === steps[0]?.id ? undefined : () => go(prevStepId(activeStep.id))}
                  />
                ) : null}
                {activeStep?.id === "cita" && token ? (
                  <div className="mt-5">
                    <BookingScheduler
                      resumeToken={token}
                      guestName={name}
                      trackingPage={pagePath}
                      onBack={() => go(prevStepId("cita"))}
                      onScheduled={() => {
                        setBooked(true);
                        pushDataLayer("schedule_appointment", { pagina: pagePath, ciudad: city === "Otro" ? "" : city });
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
