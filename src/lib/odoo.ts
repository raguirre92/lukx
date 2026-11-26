import "server-only";

import { BookingError, MSG, logBookingError, redactSecrets } from "@/lib/booking-error";
import { formatCdmxDate, formatOffsetIso, fromOdooUtc, toOdooUtc } from "@/lib/cdmx";
import {
  COMPANY_ID,
  MEDIUM_SITIO_WEB,
  MEDIUM_WEB_ID,
  SOLUTION_TAG_IDS,
  SOLUCION_RESPALDO,
  SOURCE_BY_ORIGIN,
  SOURCE_WEB_ID,
  TAG_SCHEDULED,
  TAG_UNSCHEDULED,
  TEAM_ID,
  holdPendingFields,
  solutionIncludesRespaldo,
  solutionTagIds,
  tipoVentaFor,
  type PendingLeadFields,
} from "@/lib/lead-mapping";
import { mockExecute } from "@/lib/odoo-mock";
import type { BusyInterval, SlotWindow } from "@/lib/slots";
import { generateSlots } from "@/lib/slots";
import { ANUNCIOS, textToHtml, type Anuncio, type LeadOrigin, type WebFields } from "@/lib/web-answers";
import { encodeMethodCall, parseMethodResponse } from "@/lib/xmlrpc";

const MODELS = new Set([
  "crm.lead",
  "crm.tag",
  "res.partner",
  "calendar.event",
  "appointment.type",
  "appointment.slot",
  "utm.campaign",
  "utm.medium",
  "utm.source",
]);

const METHODS = new Set(["search_read", "create", "write", "fields_get"]);
const FALLBACK_STAFF_USER_ID = 47;
const FALLBACK_STAFF_PARTNER_ID = 10879;
const SLOT_CACHE_MS = 60_000;
const TYPE_CACHE_MS = 60_000;

type OdooRecord = Record<string, unknown> & { id?: number };

type TypeConfig = {
  id: number;
  tz: string;
  durationHours: number;
  minScheduleHours: number;
  maxScheduleDays: number;
  staffUserId: number;
  staffPartnerId: number;
  windows: SlotWindow[];
};

type LeadInput = {
  name: string;
  email: string;
  whatsapp: string;
  city?: string;
  sector?: string;
  comment?: string;
  solution?: string;
  recibo?: string;
  /** This conditional form replaces fields belonging to its previous solution. */
  replaceSolutionDetails?: boolean;
  contact?: boolean;
  /** True when the form sent a city, including Otro, so an empty city clears the field. */
  cityChosen?: boolean;
  pendingFields: PendingLeadFields;
  /** x_web_* values; false clears a field, missing keys are left untouched. */
  webFields?: WebFields;
  /** Raw utm_campaign, matched or created as utm.campaign. */
  utmCampaign?: string;
  /** Odoo UTC datetime when the privacy notice was accepted; written once per lead. */
  privacyAcceptedAt?: string;
  /** First-touch origin → utm.source (Orgánico / Google Ads / ChatGPT Ads). */
  origin?: LeadOrigin;
  /** x_studio_anuncio; only Residencial, Comercial or Industrial are ever sent. */
  anuncio?: Anuncio | "";
};

export type PublicSlot = { start: string; stop: string };

type Memory = {
  slotCache?: { at: number; timezone: string; slots: PublicSlot[] };
  typeCache?: { at: number; config: TypeConfig };
  fields?: { showAs?: boolean; wonStatus?: boolean };
  tags?: { open?: number; booked?: number };
  campaigns?: Record<string, number>;
  utmIds?: Record<string, number>;
  staff?: { userId: number; partnerId: number };
};

const memory = globalThis as typeof globalThis & { __lukxOdooMemory?: Memory };

function mem(): Memory {
  if (!memory.__lukxOdooMemory) memory.__lukxOdooMemory = {};
  return memory.__lukxOdooMemory;
}

export function odooMockEnabled(): boolean {
  if (process.env.ODOO_MOCK !== "1") return false;
  if (process.env.VERCEL) {
    console.error("[odoo] ODOO_MOCK está definido en Vercel y se ignora.");
    return false;
  }
  return true;
}

function appointmentTypeId(): number {
  const raw = process.env.ODOO_APPOINTMENT_TYPE_ID?.trim();
  if (raw) {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) throw new BookingError(503, MSG.calendar);
    return id;
  }
  if (odooMockEnabled()) return 10;
  throw new BookingError(503, MSG.calendar);
}

function requireConfig(): { url: string; db: string; uid: number; apiKey: string } {
  const url = process.env.ODOO_URL?.trim().replace(/\/+$/, "");
  const db = process.env.ODOO_DB?.trim();
  const apiKey = process.env.ODOO_API_KEY?.trim();
  const uid = Number(process.env.ODOO_UID);
  if (!url || !db || !apiKey || !Number.isInteger(uid) || uid <= 0) {
    throw new BookingError(503, MSG.calendar);
  }
  return { url, db, uid, apiKey };
}

async function executeKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  if (!MODELS.has(model) || !METHODS.has(method)) {
    console.error("[odoo] modelo o método fuera de la lista permitida");
    throw new BookingError(502, MSG.connect);
  }
  const callKwargs: Record<string, unknown> = {
    ...kwargs,
    context: {
      ...(kwargs.context && typeof kwargs.context === "object" ? kwargs.context : {}),
      allowed_company_ids: [COMPANY_ID],
      default_company_id: COMPANY_ID,
    },
  };
  if (odooMockEnabled()) {
    return mockExecute(model, method, args, callKwargs) as T;
  }
  const cfg = requireConfig();
  const xml = encodeMethodCall("execute_kw", [
    cfg.db,
    cfg.uid,
    cfg.apiKey,
    model,
    method,
    args,
    callKwargs,
  ]);
  let response: Response;
  try {
    response = await fetch(`${cfg.url}/xmlrpc/2/object`, {
      method: "POST",
      headers: { "Content-Type": "text/xml" },
      body: xml,
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch (err) {
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.connect);
  }
  const text = await response.text();
  if (!response.ok) {
    const fault = redactSecrets(text).slice(0, 500);
    console.error("[odoo] HTTP", response.status, fault);
    throw new BookingError(502, MSG.connect, fault);
  }
  try {
    return parseMethodResponse(text) as T;
  } catch (err) {
    const fault = err instanceof Error ? err.message : String(err);
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.connect, fault);
  }
}

function faultOf(err: unknown): string {
  if (err instanceof BookingError) return err.fault ?? "";
  return err instanceof Error ? err.message : String(err);
}

function isCustomFieldFault(fault: string): boolean {
  return /x_[a-z0-9_]+/i.test(fault) || /invalid field|unknown field|does not exist|unexpected keyword/i.test(fault);
}

function withoutFields(vals: Record<string, unknown>, prefix: string): Record<string, unknown> {
  const plain: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(vals)) {
    if (!key.startsWith(prefix)) plain[key] = value;
  }
  return plain;
}

/**
 * Payloads to try in order when Odoo rejects custom fields: first without the
 * newer x_web_* fields so the core x_studio_* data survives, then without any x_.
 */
function customFallbacks(vals: Record<string, unknown>): Record<string, unknown>[] {
  const keys = Object.keys(vals);
  const steps: Record<string, unknown>[] = [];
  if (keys.some((key) => key.startsWith("x_web_"))) steps.push(withoutFields(vals, "x_web_"));
  if (keys.some((key) => key.startsWith("x_") && !key.startsWith("x_web_"))) steps.push(withoutFields(vals, "x_"));
  return steps;
}

async function withCustomFallback<T>(vals: Record<string, unknown>, run: (payload: Record<string, unknown>) => Promise<T>): Promise<T> {
  const fallbacks = customFallbacks(vals);
  let payload = vals;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await run(payload);
    } catch (err) {
      const next = fallbacks[attempt];
      if (!next || !isCustomFieldFault(faultOf(err))) throw err;
      const keepsCore = Object.keys(next).some((key) => key.startsWith("x_"));
      console.error(`[odoo] campos ${keepsCore ? "x_web_" : "x_"} rechazados; se reintenta sin ellos`);
      logBookingError("odoo-x", faultOf(err));
      payload = next;
    }
  }
}

async function createRecord(model: string, vals: Record<string, unknown>): Promise<number> {
  return withCustomFallback(vals, async (payload) => {
    const created = await executeKw<number>(model, "create", [payload]);
    const id = asId(created);
    if (!id) throw new BookingError(502, MSG.save);
    return id;
  });
}

async function writeRecord(model: string, id: number, vals: Record<string, unknown>): Promise<void> {
  await withCustomFallback(vals, async (payload) => {
    if (!Object.keys(payload).length) return;
    const wrote = await executeKw<boolean>(model, "write", [[id], payload]);
    if (!writeSucceeded(wrote)) throw new BookingError(502, MSG.save);
  });
}

function asId(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (Array.isArray(value) && typeof value[0] === "number") return value[0];
  return null;
}

function asIdList(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  if (value.length === 2 && typeof value[0] === "number" && typeof value[1] === "string") {
    return [value[0]];
  }
  return value.map((item) => asId(item)).filter((id): id is number => id !== null);
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function writeSucceeded(value: unknown): boolean {
  return value === true || value === 1;
}

async function hasField(model: string, field: string): Promise<boolean> {
  const box = mem();
  box.fields ??= {};
  if (field === "show_as" && box.fields.showAs !== undefined) return box.fields.showAs;
  if (field === "won_status" && box.fields.wonStatus !== undefined) return box.fields.wonStatus;
  const info = await executeKw<Record<string, { type?: string }>>(
    model,
    "fields_get",
    [[field]],
    { attributes: ["type"] },
  );
  const present = Boolean(info?.[field]);
  if (field === "show_as") box.fields.showAs = present;
  if (field === "won_status") box.fields.wonStatus = present;
  return present;
}

async function loadTypeConfig(): Promise<TypeConfig> {
  const box = mem();
  if (box.typeCache && Date.now() - box.typeCache.at < TYPE_CACHE_MS) {
    return box.typeCache.config;
  }
  const typeId = appointmentTypeId();
  const rows = await executeKw<OdooRecord[]>(
    "appointment.type",
    "search_read",
    [[["id", "=", typeId]]],
    {
      fields: [
        "appointment_duration",
        "appointment_tz",
        "staff_user_ids",
        "min_schedule_hours",
        "max_schedule_days",
        "slot_ids",
      ],
      limit: 1,
    },
  );
  const row = rows[0];
  if (!row) throw new BookingError(502, MSG.calendar);
  const durationHours = asNumber(row.appointment_duration);
  const minScheduleHours = asNumber(row.min_schedule_hours);
  const maxScheduleDays = asNumber(row.max_schedule_days);
  const tz = asText(row.appointment_tz);
  const staffIds = asIdList(row.staff_user_ids);
  if (
    durationHours === null ||
    durationHours <= 0 ||
    minScheduleHours === null ||
    minScheduleHours < 0 ||
    maxScheduleDays === null ||
    maxScheduleDays <= 0 ||
    !tz
  ) {
    console.error("[odoo] appointment.type incompleto");
    throw new BookingError(502, MSG.calendar);
  }
  const staffUserId = staffIds[0] ?? FALLBACK_STAFF_USER_ID;
  if (!staffIds[0]) console.error("[odoo] appointment.type sin staff_user_ids; se usa el asesor conocido");
  const slotIds = asIdList(row.slot_ids);
  const slotRows = slotIds.length
    ? await executeKw<OdooRecord[]>(
        "appointment.slot",
        "search_read",
        [[["id", "in", slotIds]]],
        { fields: ["weekday", "start_hour", "end_hour"], limit: 100 },
      )
    : [];
  const windows: SlotWindow[] = [];
  for (const slot of slotRows) {
    const startHour = asNumber(slot.start_hour);
    const endHour = asNumber(slot.end_hour);
    const weekday = String(slot.weekday ?? "");
    if (startHour === null || endHour === null || !/^[1-7]$/.test(weekday)) continue;
    windows.push({ weekday, startHour, endHour });
  }
  if (!windows.length) throw new BookingError(502, MSG.calendar);
  const staffPartnerId = await staffPartner(staffUserId);
  const config: TypeConfig = {
    id: typeId,
    tz,
    durationHours,
    minScheduleHours,
    maxScheduleDays,
    staffUserId,
    staffPartnerId,
    windows,
  };
  box.typeCache = { at: Date.now(), config };
  return config;
}

async function staffPartner(userId: number): Promise<number> {
  const box = mem();
  if (box.staff?.userId === userId) return box.staff.partnerId;
  const rows = await executeKw<OdooRecord[]>(
    "res.partner",
    "search_read",
    [[["user_ids", "in", [userId]]]],
    { fields: ["id"], limit: 1 },
  );
  const found = asId(rows[0]?.id);
  const partnerId = found ?? FALLBACK_STAFF_PARTNER_ID;
  if (!found) {
    console.error("[odoo] no se encontró el contacto del asesor; se usa el id conocido");
  }
  box.staff = { userId, partnerId };
  return partnerId;
}

type FoundPartner = {
  id: number;
  internal: boolean;
  name: string;
  email: string;
  mobile: string;
  companyId: number | null;
};

function partnerIsInternal(row: OdooRecord): boolean {
  return asIdList(row.user_ids).length > 0;
}

function newPartnerValues(input: LeadInput): Record<string, unknown> {
  const vals: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    company_id: COMPANY_ID,
  };
  if (input.whatsapp) vals.mobile = input.whatsapp;
  return vals;
}

function emptyPartnerFill(input: LeadInput, row: FoundPartner): Record<string, unknown> {
  const vals: Record<string, unknown> = {};
  if (!row.name && input.name) vals.name = input.name;
  if (!row.email && input.email) vals.email = input.email;
  if (!row.mobile && input.whatsapp) vals.mobile = input.whatsapp;
  if (!row.companyId) vals.company_id = COMPANY_ID;
  return vals;
}

function leadValues(
  input: LeadInput,
  partnerId: number | null,
  at: Date,
  tagIds: number[],
  clearSalesperson: boolean,
): Record<string, unknown> {
  const comment = input.comment?.trim() ?? "";
  const tipo = input.solution ? tipoVentaFor(input.solution) : "";
  const vals: Record<string, unknown> = {
    name: input.name,
    type: "lead",
    company_id: COMPANY_ID,
    team_id: TEAM_ID,
    contact_name: input.name,
    email_from: input.email,
    x_studio_de_dnde_llego: "Sitio Web",
    x_studio_tipo_de_campaa: "Sitio Web",
    x_etapa_lead_id: 1,
    x_fecha_hora_recibido: toOdooUtc(at),
    x_studio_fecha_recibido: formatCdmxDate(at),
    tag_ids: [[6, 0, tagIds]],
  };
  if (clearSalesperson) vals.user_id = false;
  if (partnerId) vals.partner_id = partnerId;
  else vals.partner_id = false;
  if (input.whatsapp) vals.mobile = input.whatsapp;
  if (input.city) vals.city = input.city;
  else if (input.cityChosen) vals.city = false;
  if (input.sector) vals.x_studio_sector = input.sector;
  if (comment) {
    // Without a comment the description is left alone, so a later short form never wipes it.
    vals.description = textToHtml(comment);
    vals.x_studio_mensaje_del_lead = comment;
  }
  if (input.recibo) vals.x_studio_gasto_en_recibo_de_luz = input.recibo;
  else if (input.replaceSolutionDetails) vals.x_studio_gasto_en_recibo_de_luz = false;
  if (tipo) vals.x_studio_tipo_venta = tipo;
  if (input.solution && solutionIncludesRespaldo(input.solution)) {
    vals.x_studio_solucin = SOLUCION_RESPALDO;
  } else if (input.replaceSolutionDetails) {
    vals.x_studio_solucin = false;
  }
  for (const [key, value] of Object.entries(input.webFields ?? {})) {
    if (key.startsWith("x_web_") && (value === false || value)) vals[key] = value;
  }
  return vals;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/** Finds utm.campaign by name (case-insensitive) or creates it. Never blocks the lead. */
async function campaignFor(raw: string | undefined): Promise<number | null> {
  const name = raw?.trim().slice(0, 100) ?? "";
  if (!name) return null;
  const box = mem();
  box.campaigns ??= {};
  const cacheKey = name.toLowerCase();
  if (box.campaigns[cacheKey]) return box.campaigns[cacheKey];
  try {
    const rows = await executeKw<OdooRecord[]>(
      "utm.campaign",
      "search_read",
      [[["name", "=ilike", escapeLike(name)]]],
      { fields: ["id"], limit: 1, order: "id asc" },
    );
    let id = asId(rows[0]?.id);
    if (!id) id = asId(await executeKw<number>("utm.campaign", "create", [{ name, title: name }]));
    if (id) box.campaigns[cacheKey] = id;
    return id;
  } catch (err) {
    logBookingError("odoo-utm", faultOf(err));
    return null;
  }
}

async function findPartner(email: string, whatsapp: string): Promise<FoundPartner | null> {
  const domain: unknown[] = whatsapp
    ? ["|", "|", ["email", "=ilike", email], ["phone", "=", whatsapp], ["mobile", "=", whatsapp]]
    : [["email", "=ilike", email]];
  const rows = await executeKw<OdooRecord[]>(
    "res.partner",
    "search_read",
    [domain],
    { fields: ["id", "name", "email", "mobile", "user_ids", "company_id"], limit: 20, order: "id asc" },
  );
  const mapped = rows
    .map((row) => {
      const id = asId(row.id);
      if (!id) return null;
      return {
        id,
        internal: partnerIsInternal(row),
        name: asText(row.name),
        email: asText(row.email),
        mobile: asText(row.mobile),
        companyId: asId(row.company_id),
      };
    })
    .filter((row): row is FoundPartner => row !== null);
  return mapped.find((row) => !row.internal) ?? mapped[0] ?? null;
}

async function findOpenLead(partnerId: number | null, email: string): Promise<number | null> {
  const wonField = await hasField("crm.lead", "won_status");
  const mediumId = await utmIdByName("utm.medium", MEDIUM_SITIO_WEB);
  const domain: unknown[] = [
    ["active", "=", true],
    // Site leads: the new «Sitio Web» medium, the old «Website» medium, or the old «Sitio Web» source.
    "|",
    "|",
    ["medium_id", "=", mediumId],
    ["medium_id", "=", MEDIUM_WEB_ID],
    ["source_id", "=", SOURCE_WEB_ID],
    wonField ? ["won_status", "!=", "won"] : ["probability", "<", 100],
    ["email_from", "=ilike", email],
  ];
  if (partnerId) domain.push(["partner_id", "=", partnerId]);
  else domain.push(["partner_id", "=", false]);
  const rows = await executeKw<OdooRecord[]>(
    "crm.lead",
    "search_read",
    [domain],
    { fields: ["id"], limit: 1, order: "id desc" },
  );
  return asId(rows[0]?.id);
}

/** First-touch custom fields already on the lead; if they can't be read, they are not overwritten. */
async function customAlreadySet(leadId: number): Promise<{ privacy: boolean; anuncio: boolean }> {
  try {
    const rows = await executeKw<OdooRecord[]>(
      "crm.lead",
      "search_read",
      [[["id", "=", leadId]]],
      { fields: ["x_web_aviso_privacidad", "x_studio_anuncio"], limit: 1 },
    );
    return { privacy: Boolean(rows[0]?.x_web_aviso_privacidad), anuncio: Boolean(rows[0]?.x_studio_anuncio) };
  } catch (err) {
    logBookingError("odoo-x", faultOf(err));
    return { privacy: true, anuncio: true };
  }
}

/** utm.medium / utm.source id by exact name, cached; falls back to the known id. */
async function utmIdByName(model: "utm.medium" | "utm.source", ref: { name: string; id: number }): Promise<number> {
  const box = mem();
  box.utmIds ??= {};
  const key = `${model}:${ref.name}`;
  if (box.utmIds[key]) return box.utmIds[key];
  try {
    const rows = await executeKw<OdooRecord[]>(model, "search_read", [[["name", "=", ref.name]]], {
      fields: ["id"],
      limit: 1,
      order: "id asc",
    });
    const id = asId(rows[0]?.id);
    if (id) {
      box.utmIds[key] = id;
      return id;
    }
    console.error(`[odoo] ${model} «${ref.name}» no encontrado; se usa el id conocido`);
  } catch (err) {
    logBookingError("odoo-utm", faultOf(err));
  }
  return ref.id;
}

export async function saveWebLead(input: LeadInput): Promise<{ leadId: number; partnerId: number }> {
  holdPendingFields(input.pendingFields);
  try {
    const at = new Date();
    const solutionTags = solutionTagIds(input.solution ?? "");
    const found = await findPartner(input.email, input.whatsapp);
    let partnerId: number | null = null;
    if (found?.internal) {
      partnerId = null;
    } else if (!found) {
      partnerId = await createRecord("res.partner", newPartnerValues(input));
    } else {
      partnerId = found.id;
      const fill = emptyPartnerFill(input, found);
      if (Object.keys(fill).length) await writeRecord("res.partner", found.id, fill);
    }

    const campaignId = await campaignFor(input.utmCampaign);
    const mediumId = await utmIdByName("utm.medium", MEDIUM_SITIO_WEB);
    const sourceId = await utmIdByName("utm.source", SOURCE_BY_ORIGIN[input.origin ?? "organico"]);
    const anuncio = input.anuncio && (ANUNCIOS as readonly string[]).includes(input.anuncio) ? input.anuncio : "";
    let leadId = await findOpenLead(partnerId, input.email);
    if (!leadId) {
      const vals = leadValues(input, partnerId, at, [TAG_UNSCHEDULED, ...solutionTags], true);
      vals.medium_id = mediumId;
      vals.source_id = sourceId;
      if (anuncio) vals.x_studio_anuncio = anuncio;
      if (campaignId) vals.campaign_id = campaignId;
      if (input.privacyAcceptedAt) vals.x_web_aviso_privacidad = input.privacyAcceptedAt;
      leadId = await createRecord("crm.lead", vals);
    } else {
      const current = await executeKw<OdooRecord[]>(
        "crm.lead",
        "search_read",
        [[["id", "=", leadId]]],
        { fields: ["tag_ids", "source_id"], limit: 1 },
      );
      const existing = asIdList(current[0]?.tag_ids);
      const appointment = existing.includes(TAG_SCHEDULED) ? TAG_SCHEDULED : TAG_UNSCHEDULED;
      const vals = leadValues(input, partnerId, at, [appointment, ...solutionTags], false);
      vals.medium_id = mediumId;
      // First touch wins: origin and ad are only filled when empty.
      if (!asId(current[0]?.source_id)) vals.source_id = sourceId;
      const filled = await customAlreadySet(leadId);
      if (anuncio && !filled.anuncio) vals.x_studio_anuncio = anuncio;
      if (campaignId) vals.campaign_id = campaignId;
      if (input.privacyAcceptedAt && !filled.privacy) vals.x_web_aviso_privacidad = input.privacyAcceptedAt;
      await writeRecord("crm.lead", leadId, vals);
    }
    return { leadId, partnerId: partnerId ?? 0 };
  } catch (err) {
    if (err instanceof BookingError) throw err;
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.save);
  }
}

export async function updateLeadSolution(input: {
  leadId: number;
  partnerId: number;
  solution?: string;
  recibo?: string;
}): Promise<void> {
  try {
    const leads = await executeKw<OdooRecord[]>(
      "crm.lead",
      "search_read",
      [[["id", "=", input.leadId]]],
      { fields: ["id", "partner_id"], limit: 1 },
    );
    const leadPartner = asId(leads[0]?.partner_id);
    if (!leads[0] || (input.partnerId ? leadPartner !== input.partnerId : leadPartner !== null)) {
      throw new BookingError(401, MSG.expired);
    }
    const tags = input.solution ? solutionTagIds(input.solution) : [];
    const tipo = input.solution ? tipoVentaFor(input.solution) : "";
    if (input.solution) {
      const commands: unknown[] = [
        ...SOLUTION_TAG_IDS.map((id) => [3, id]),
        [4, TAG_UNSCHEDULED],
        ...tags.map((id) => [4, id]),
      ];
      await writeRecord("crm.lead", input.leadId, {
        company_id: COMPANY_ID,
        tag_ids: commands,
      });
      const custom: Record<string, unknown> = { company_id: COMPANY_ID };
      if (tipo) custom.x_studio_tipo_venta = tipo;
      if (solutionIncludesRespaldo(input.solution)) custom.x_studio_solucin = SOLUCION_RESPALDO;
      if (Object.keys(custom).length > 1) await writeRecord("crm.lead", input.leadId, custom);
    }
    if (input.recibo) {
      await writeRecord("crm.lead", input.leadId, {
        company_id: COMPANY_ID,
        x_studio_gasto_en_recibo_de_luz: input.recibo,
      });
    }
  } catch (err) {
    if (err instanceof BookingError) throw err;
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.save);
  }
}

async function busyIntervals(config: TypeConfig, from: Date, to: Date): Promise<BusyInterval[]> {
  const showAs = await hasField("calendar.event", "show_as");
  const domain: unknown[] = [
    ["active", "=", true],
    ["start", "<", toOdooUtc(to)],
    ["stop", ">", toOdooUtc(from)],
  ];
  if (showAs) domain.push(["show_as", "!=", "free"]);
  domain.push(
    "|",
    ["user_id", "=", config.staffUserId],
    ["partner_ids", "in", [config.staffPartnerId]],
  );
  const rows = await executeKw<OdooRecord[]>(
    "calendar.event",
    "search_read",
    [domain],
    { fields: ["start", "stop"], limit: 500 },
  );
  const intervals: BusyInterval[] = [];
  for (const row of rows) {
    if (typeof row.start !== "string" || typeof row.stop !== "string") continue;
    intervals.push({ start: fromOdooUtc(row.start), stop: fromOdooUtc(row.stop) });
  }
  return intervals;
}

async function freeSlots(config: TypeConfig, now = new Date()): Promise<PublicSlot[]> {
  const horizon = new Date(now.getTime() + (config.maxScheduleDays + 1) * 86_400_000);
  const busy = await busyIntervals(config, now, horizon);
  return generateSlots({
    now,
    timeZone: config.tz,
    durationHours: config.durationHours,
    minScheduleHours: config.minScheduleHours,
    maxScheduleDays: config.maxScheduleDays,
    windows: config.windows,
    busy,
  }).map((slot) => ({
    start: formatOffsetIso(slot.start, config.tz),
    stop: formatOffsetIso(slot.stop, config.tz),
  }));
}

export async function listFreeSlots(): Promise<{ timezone: string; slots: PublicSlot[] }> {
  try {
    const box = mem();
    if (box.slotCache && Date.now() - box.slotCache.at < SLOT_CACHE_MS) {
      return { timezone: box.slotCache.timezone, slots: box.slotCache.slots };
    }
    const config = await loadTypeConfig();
    const slots = await freeSlots(config);
    box.slotCache = { at: Date.now(), timezone: config.tz, slots };
    return { timezone: config.tz, slots };
  } catch (err) {
    if (err instanceof BookingError) throw err;
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.slots);
  }
}

export function clearSlotCache(): void {
  const box = mem();
  box.slotCache = undefined;
}

export async function bookWebSlot(input: {
  leadId: number;
  partnerId: number;
  startIso: string;
}): Promise<{ eventId: number; start: string; stop: string }> {
  try {
    const requested = new Date(input.startIso);
    if (Number.isNaN(requested.getTime())) throw new BookingError(400, MSG.badSlot);
    clearSlotCache();
    const config = await loadTypeConfig();
    const slots = await freeSlots(config);
    const chosen = slots.find((slot) => new Date(slot.start).getTime() === requested.getTime());
    if (!chosen) throw new BookingError(409, MSG.taken);
    const clash = await busyIntervals(config, new Date(chosen.start), new Date(chosen.stop));
    if (clash.length) throw new BookingError(409, MSG.taken);

    const leads = await executeKw<OdooRecord[]>(
      "crm.lead",
      "search_read",
      [[["id", "=", input.leadId]]],
      { fields: ["contact_name", "partner_id"], limit: 1 },
    );
    const lead = leads[0];
    const leadPartner = asId(lead?.partner_id);
    const tokenPartner = input.partnerId > 0 ? input.partnerId : null;
    if (!lead || leadPartner !== tokenPartner) throw new BookingError(401, MSG.expired);
    const name = asText(lead.contact_name) || "Cliente";
    const attendees = [config.staffPartnerId];
    if (tokenPartner) attendees.push(tokenPartner);
    const eventVals: Record<string, unknown> = {
      name: `Asesoría Lukx – ${name}`,
      start: toOdooUtc(new Date(chosen.start)),
      stop: toOdooUtc(new Date(chosen.stop)),
      duration: config.durationHours,
      user_id: config.staffUserId,
      partner_ids: [[6, 0, [...new Set(attendees)]]],
      appointment_type_id: config.id,
      opportunity_id: input.leadId,
      description: "Llamada o videollamada",
    };
    if (tokenPartner) eventVals.appointment_booker_id = tokenPartner;
    const eventId = asId(await executeKw<number>("calendar.event", "create", [eventVals]));
    if (!eventId) throw new BookingError(502, MSG.book);

    await writeRecord("crm.lead", input.leadId, {
      company_id: COMPANY_ID,
      tag_ids: [[3, TAG_UNSCHEDULED], [4, TAG_SCHEDULED]],
    });
    clearSlotCache();
    return { eventId, start: chosen.start, stop: chosen.stop };
  } catch (err) {
    clearSlotCache();
    if (err instanceof BookingError) throw err;
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.book);
  }
}
