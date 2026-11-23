import "server-only";

import { BookingError, MSG, logBookingError, redactSecrets } from "@/lib/booking-error";
import { formatOffsetIso, fromOdooUtc, toOdooUtc } from "@/lib/cdmx";
import {
  COMPANY_ID,
  MEDIUM_WEB_ID,
  SOLUCION_RESPALDO,
  SOURCE_WEB_ID,
  TAG_SCHEDULED,
  TAG_UNSCHEDULED,
  TEAM_ID,
  holdPendingFields,
  solutionIncludesRespaldo,
  solutionTagIds,
  type PendingLeadFields,
} from "@/lib/lead-mapping";
import { mockExecute } from "@/lib/odoo-mock";
import type { BusyInterval, SlotWindow } from "@/lib/slots";
import { generateSlots } from "@/lib/slots";
import { encodeMethodCall, parseMethodResponse } from "@/lib/xmlrpc";

const MODELS = new Set([
  "crm.lead",
  "crm.tag",
  "res.partner",
  "calendar.event",
  "appointment.type",
  "appointment.slot",
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
  contact?: boolean;
  pendingFields: PendingLeadFields;
};

export type PublicSlot = { start: string; stop: string };

type Memory = {
  slotCache?: { at: number; timezone: string; slots: PublicSlot[] };
  typeCache?: { at: number; config: TypeConfig };
  fields?: { showAs?: boolean; wonStatus?: boolean };
  tags?: { open?: number; booked?: number };
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

function withoutCustomFields(vals: Record<string, unknown>): Record<string, unknown> {
  const plain: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(vals)) {
    if (!key.startsWith("x_")) plain[key] = value;
  }
  return plain;
}

async function createRecord(model: string, vals: Record<string, unknown>): Promise<number> {
  const run = async (payload: Record<string, unknown>) => {
    const created = await executeKw<number>(model, "create", [payload]);
    const id = asId(created);
    if (!id) throw new BookingError(502, MSG.save);
    return id;
  };
  try {
    return await run(vals);
  } catch (err) {
    const custom = Object.keys(vals).some((key) => key.startsWith("x_"));
    if (!custom || !isCustomFieldFault(faultOf(err))) throw err;
    console.error("[odoo] campos x_ rechazados; se reintenta sin ellos");
    logBookingError("odoo-x", faultOf(err));
    return run(withoutCustomFields(vals));
  }
}

async function writeRecord(model: string, id: number, vals: Record<string, unknown>): Promise<void> {
  const run = async (payload: Record<string, unknown>) => {
    if (!Object.keys(payload).length) return;
    const wrote = await executeKw<boolean>(model, "write", [[id], payload]);
    if (!writeSucceeded(wrote)) throw new BookingError(502, MSG.save);
  };
  try {
    await run(vals);
  } catch (err) {
    const custom = Object.keys(vals).some((key) => key.startsWith("x_"));
    if (!custom || !isCustomFieldFault(faultOf(err))) throw err;
    console.error("[odoo] campos x_ rechazados; se reintenta sin ellos");
    logBookingError("odoo-x", faultOf(err));
    await run(withoutCustomFields(vals));
  }
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

function partnerValues(input: LeadInput): Record<string, unknown> {
  const vals: Record<string, unknown> = {
    name: input.name,
    email: input.email,
    company_id: COMPANY_ID,
  };
  if (input.whatsapp) {
    vals.phone = input.whatsapp;
    vals.mobile = input.whatsapp;
  }
  return vals;
}

function leadValues(input: LeadInput, partnerId: number, at: Date, tagIds: number[]): Record<string, unknown> {
  const comment = input.comment?.trim() ?? "";
  const vals: Record<string, unknown> = {
    name: `${input.contact ? "Mensaje web" : "Cita web"} – ${input.name}`,
    type: "lead",
    company_id: COMPANY_ID,
    team_id: TEAM_ID,
    contact_name: input.name,
    email_from: input.email,
    partner_id: partnerId,
    description: comment,
    source_id: SOURCE_WEB_ID,
    medium_id: MEDIUM_WEB_ID,
    x_studio_de_dnde_llego: "Sitio Web",
    x_studio_tipo_de_campaa: "Sitio Web",
    x_etapa_lead_id: 1,
    x_fecha_hora_recibido: toOdooUtc(at),
    tag_ids: [[6, 0, tagIds]],
  };
  if (input.whatsapp) vals.phone = input.whatsapp;
  if (input.city) vals.city = input.city;
  if (input.sector) vals.x_studio_sector = input.sector;
  if (comment) vals.x_studio_mensaje_del_lead = comment;
  if (input.solution && solutionIncludesRespaldo(input.solution)) {
    vals.x_studio_solucin = SOLUCION_RESPALDO;
  }
  return vals;
}

async function findPartner(email: string, whatsapp: string): Promise<number | null> {
  const domain: unknown[] = whatsapp
    ? ["|", "|", ["email", "=ilike", email], ["phone", "=", whatsapp], ["mobile", "=", whatsapp]]
    : [["email", "=ilike", email]];
  const rows = await executeKw<OdooRecord[]>(
    "res.partner",
    "search_read",
    [domain],
    { fields: ["id"], limit: 1, order: "id asc" },
  );
  return asId(rows[0]?.id);
}

async function findOpenLead(partnerId: number, email: string): Promise<number | null> {
  const wonField = await hasField("crm.lead", "won_status");
  const domain: unknown[] = [
    ["active", "=", true],
    ["source_id", "=", SOURCE_WEB_ID],
    wonField ? ["won_status", "!=", "won"] : ["probability", "<", 100],
    "|",
    ["partner_id", "=", partnerId],
    ["email_from", "=ilike", email],
  ];
  const rows = await executeKw<OdooRecord[]>(
    "crm.lead",
    "search_read",
    [domain],
    { fields: ["id"], limit: 1, order: "id desc" },
  );
  return asId(rows[0]?.id);
}

export async function saveWebLead(input: LeadInput): Promise<{ leadId: number; partnerId: number }> {
  holdPendingFields(input.pendingFields);
  try {
    const at = new Date();
    const solutionTags = solutionTagIds(input.solution ?? "");
    let partnerId = await findPartner(input.email, input.whatsapp);
    const partner = partnerValues(input);
    if (!partnerId) {
      partnerId = await createRecord("res.partner", partner);
    } else {
      await writeRecord("res.partner", partnerId, partner);
    }

    let leadId = await findOpenLead(partnerId, input.email);
    if (!leadId) {
      leadId = await createRecord(
        "crm.lead",
        leadValues(input, partnerId, at, [TAG_UNSCHEDULED, ...solutionTags]),
      );
    } else {
      const current = await executeKw<OdooRecord[]>(
        "crm.lead",
        "search_read",
        [[["id", "=", leadId]]],
        { fields: ["tag_ids"], limit: 1 },
      );
      const existing = asIdList(current[0]?.tag_ids);
      const appointment = existing.includes(TAG_SCHEDULED) ? TAG_SCHEDULED : TAG_UNSCHEDULED;
      await writeRecord(
        "crm.lead",
        leadId,
        leadValues(input, partnerId, at, [appointment, ...solutionTags]),
      );
    }
    return { leadId, partnerId };
  } catch (err) {
    if (err instanceof BookingError) throw err;
    logBookingError("odoo", err);
    throw new BookingError(502, MSG.save);
  }
}

export async function updateLeadSolution(input: {
  leadId: number;
  partnerId: number;
  solution: string;
}): Promise<void> {
  try {
    const leads = await executeKw<OdooRecord[]>(
      "crm.lead",
      "search_read",
      [[["id", "=", input.leadId], ["partner_id", "=", input.partnerId]]],
      { fields: ["id"], limit: 1 },
    );
    if (!leads[0]) throw new BookingError(401, MSG.expired);
    const tags = solutionTagIds(input.solution);
    const commands: unknown[] = [
      [3, 5],
      [3, 16],
      [3, 14],
      [3, 19],
      [4, TAG_UNSCHEDULED],
      ...tags.map((id) => [4, id]),
    ];
    await writeRecord("crm.lead", input.leadId, {
      company_id: COMPANY_ID,
      tag_ids: commands,
    });
    if (solutionIncludesRespaldo(input.solution)) {
      await writeRecord("crm.lead", input.leadId, {
        company_id: COMPANY_ID,
        x_studio_solucin: SOLUCION_RESPALDO,
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
      [[["id", "=", input.leadId], ["partner_id", "=", input.partnerId]]],
      { fields: ["contact_name", "partner_id"], limit: 1 },
    );
    const lead = leads[0];
    const leadPartner = asId(lead?.partner_id);
    if (!lead || leadPartner !== input.partnerId) throw new BookingError(401, MSG.expired);
    const name = asText(lead.contact_name) || "Cliente";
    const partners = [...new Set([config.staffPartnerId, input.partnerId])];
    const eventId = asId(
      await executeKw<number>("calendar.event", "create", [
        {
          name: `Asesoría Lukx – ${name}`,
          start: toOdooUtc(new Date(chosen.start)),
          stop: toOdooUtc(new Date(chosen.stop)),
          duration: config.durationHours,
          user_id: config.staffUserId,
          partner_ids: [[6, 0, partners]],
          appointment_type_id: config.id,
          appointment_booker_id: input.partnerId,
          opportunity_id: input.leadId,
          company_id: COMPANY_ID,
          description: "Llamada o videollamada",
        },
      ]),
    );
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
