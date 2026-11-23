import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

type Rec = Record<string, unknown> & { id: number };

type MockDb = {
  version: number;
  nextId: number;
  records: Record<string, Rec[]>;
};

const MOCK_VERSION = 1;
const MOCK_FILE = join(tmpdir(), "lukx-odoo-mock.json");

function seed(): MockDb {
  const slots: Rec[] = [];
  let slotId = 1;
  for (const weekday of ["1", "2", "3", "4", "5"]) {
    slots.push({
      id: slotId,
      weekday,
      start_hour: 10,
      end_hour: 12,
      appointment_type_id: 10,
    });
    slotId += 1;
    slots.push({
      id: slotId,
      weekday,
      start_hour: 15,
      end_hour: 17,
      appointment_type_id: 10,
    });
    slotId += 1;
  }
  return {
    version: MOCK_VERSION,
    nextId: 1000,
    records: {
      "appointment.slot": slots,
      "appointment.type": [
        {
          id: 10,
          name: "Asesoría Lukx · Sitio web",
          appointment_duration: 0.5,
          appointment_tz: "America/Mexico_City",
          staff_user_ids: [47],
          min_schedule_hours: 1,
          max_schedule_days: 15,
          slot_ids: slots.map((slot) => slot.id),
        },
      ],
      "res.partner": [
        {
          id: 10879,
          name: "Fernanda Salinas",
          email: false,
          phone: false,
          mobile: false,
          user_ids: [47],
          active: true,
        },
      ],
      "crm.lead": [],
      "crm.tag": [],
      "calendar.event": [],
    },
  };
}

function db(): MockDb {
  try {
    const parsed = JSON.parse(readFileSync(MOCK_FILE, "utf8")) as MockDb;
    if (parsed.version === MOCK_VERSION && parsed.records) return parsed;
  } catch {
    // A missing or stale file is seeded below.
  }
  const seeded = seed();
  writeFileSync(MOCK_FILE, JSON.stringify(seeded));
  return seeded;
}

function save(store: MockDb): void {
  writeFileSync(MOCK_FILE, JSON.stringify(store));
}

function eq(left: unknown, right: unknown): boolean {
  return left === right;
}

function compare(record: Rec, field: string, op: string, value: unknown): boolean {
  const left = record[field];
  if (op === "=" || op === "==") {
    if (value === false || value === null) return left === false || left === null || left === undefined;
    return eq(left, value);
  }
  if (op === "!=") return !eq(left, value);
  if (op === "=ilike") {
    return String(left ?? "").toLowerCase() === String(value ?? "").toLowerCase();
  }
  if (op === "ilike") {
    const needle = String(value ?? "").replace(/%/g, "").toLowerCase();
    return String(left ?? "").toLowerCase().includes(needle);
  }
  if (op === "in") {
    const list = Array.isArray(value) ? value : [value];
    if (Array.isArray(left)) return left.some((item) => list.includes(item));
    return list.includes(left);
  }
  if (op === "<" || op === ">" || op === "<=" || op === ">=") {
    if (typeof left !== "string" && typeof left !== "number") return false;
    if (typeof value !== "string" && typeof value !== "number") return false;
    if (op === "<") return left < value;
    if (op === ">") return left > value;
    if (op === "<=") return left <= value;
    return left >= value;
  }
  return false;
}

export function matchDomain(record: Rec, domain: unknown[]): boolean {
  const stack: Array<(row: Rec) => boolean> = [];
  for (let index = domain.length - 1; index >= 0; index -= 1) {
    const token = domain[index];
    if (token === "&" || token === "|") {
      const left = stack.pop();
      const right = stack.pop();
      if (!left || !right) return false;
      stack.push((row) => (token === "&" ? left(row) && right(row) : left(row) || right(row)));
    } else if (token === "!") {
      const inner = stack.pop();
      if (!inner) return false;
      stack.push((row) => !inner(row));
    } else if (Array.isArray(token)) {
      const [field, op, value] = token;
      stack.push((row) => compare(row, String(field), String(op), value));
    }
  }
  return stack.every((test) => test(record));
}

function isCommandList(value: unknown): value is unknown[][] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        Array.isArray(item) &&
        typeof item[0] === "number" &&
        [0, 1, 2, 3, 4, 5, 6].includes(item[0]),
    )
  );
}

function applyCommands(current: number[], commands: unknown[]): number[] {
  let ids = [...current];
  for (const command of commands) {
    if (!Array.isArray(command)) continue;
    const op = command[0];
    if (op === 6) {
      ids = Array.isArray(command[2])
        ? command[2].filter((id): id is number => typeof id === "number")
        : [];
    } else if (op === 4 && typeof command[1] === "number" && !ids.includes(command[1])) {
      ids.push(command[1]);
    } else if (op === 3 && typeof command[1] === "number") {
      ids = ids.filter((id) => id !== command[1]);
    } else if (op === 5) {
      ids = [];
    }
  }
  return ids;
}

function materialize(vals: Record<string, unknown>, id: number): Rec {
  const rec: Rec = { id, active: true };
  for (const [key, value] of Object.entries(vals)) {
    rec[key] = isCommandList(value) ? applyCommands([], value) : value;
  }
  return rec;
}

const FIELD_CATALOG: Record<string, Record<string, { type: string }>> = {
  "calendar.event": {
    show_as: { type: "selection" },
    appointment_status: { type: "selection" },
  },
  "crm.lead": {
    won_status: { type: "selection" },
    probability: { type: "float" },
  },
};

export function mockExecute(model: string, method: string, args: unknown[], kwargs: Record<string, unknown>): unknown {
  const store = db();
  const table = store.records[model] ?? [];
  store.records[model] = table;
  const finish = <T>(value: T): T => {
    save(store);
    return value;
  };

  if (method === "fields_get") {
    const names = Array.isArray(args[0]) ? (args[0] as string[]) : [];
    const known = FIELD_CATALOG[model] ?? {};
    const out: Record<string, { type: string }> = {};
    for (const name of names) {
      if (known[name]) out[name] = known[name];
    }
    return finish(out);
  }

  if (method === "search_read") {
    const domain = Array.isArray(args[0]) ? (args[0] as unknown[]) : [];
    let rows = table.filter((row) => matchDomain(row, domain));
    const order = typeof kwargs.order === "string" ? kwargs.order : "";
    rows = [...rows].sort((a, b) => (order.includes("desc") ? b.id - a.id : a.id - b.id));
    const limit = typeof kwargs.limit === "number" ? kwargs.limit : rows.length;
    rows = rows.slice(0, limit);
    const fields = Array.isArray(kwargs.fields) ? (kwargs.fields as string[]) : null;
    return finish(
      rows.map((row) => {
        if (!fields) return structuredClone(row);
        const projected: Record<string, unknown> = { id: row.id };
        for (const field of fields) projected[field] = row[field];
        return projected;
      }),
    );
  }

  if (method === "create") {
    const vals = (args[0] ?? {}) as Record<string, unknown>;
    const rec = materialize(vals, store.nextId);
    store.nextId += 1;
    table.push(rec);
    return finish(rec.id);
  }

  if (method === "write") {
    const ids = Array.isArray(args[0]) ? (args[0] as number[]) : [];
    const vals = (args[1] ?? {}) as Record<string, unknown>;
    for (const row of table) {
      if (!ids.includes(row.id)) continue;
      for (const [key, value] of Object.entries(vals)) {
        if (isCommandList(value)) {
          const current = Array.isArray(row[key])
            ? (row[key] as unknown[]).filter((id): id is number => typeof id === "number")
            : [];
          row[key] = applyCommands(current, value);
        } else {
          row[key] = value;
        }
      }
    }
    return finish(true);
  }

  throw new Error(`Método mock no soportado: ${method}`);
}
