function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function encodeXmlRpcValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "<value><boolean>0</boolean></value>";
  }
  if (typeof value === "boolean") {
    return `<value><boolean>${value ? 1 : 0}</boolean></value>`;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Número XML-RPC no finito.");
    }
    if (Number.isInteger(value)) {
      return `<value><int>${value}</int></value>`;
    }
    return `<value><double>${value}</double></value>`;
  }
  if (typeof value === "string") {
    return `<value><string>${xmlEscape(value)}</string></value>`;
  }
  if (Array.isArray(value)) {
    return `<value><array><data>${value.map((item) => encodeXmlRpcValue(item)).join("")}</data></array></value>`;
  }
  if (typeof value === "object") {
    const members = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .map(
        ([key, entry]) =>
          `<member><name>${xmlEscape(key)}</name>${encodeXmlRpcValue(entry)}</member>`,
      )
      .join("");
    return `<value><struct>${members}</struct></value>`;
  }
  throw new Error("Tipo XML-RPC no soportado.");
}

export function encodeMethodCall(method: string, params: unknown[]): string {
  const body = params
    .map((param) => `<param>${encodeXmlRpcValue(param)}</param>`)
    .join("");
  return `<?xml version="1.0"?><methodCall><methodName>${xmlEscape(method)}</methodName><params>${body}</params></methodCall>`;
}

function decodeXml(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

class Reader {
  private index = 0;

  constructor(private readonly source: string) {}

  skipWs(): void {
    while (this.index < this.source.length && /\s/.test(this.source[this.index] ?? "")) {
      this.index += 1;
    }
  }

  starts(token: string): boolean {
    return this.source.startsWith(token, this.index);
  }

  expect(token: string): void {
    this.skipWs();
    if (!this.starts(token)) {
      throw new Error(`XML-RPC inválido cerca de ${this.index}.`);
    }
    this.index += token.length;
  }

  readUntil(token: string): string {
    const at = this.source.indexOf(token, this.index);
    if (at < 0) throw new Error("XML-RPC truncado.");
    const text = this.source.slice(this.index, at);
    this.index = at + token.length;
    return text;
  }

  readValue(): unknown {
    this.skipWs();
    this.expect("<value>");
    this.skipWs();
    let result: unknown = "";
    if (this.starts("<")) {
      result = this.readTyped();
    } else {
      const text = this.readUntil("</value>");
      return decodeXml(text);
    }
    this.skipWs();
    this.expect("</value>");
    return result;
  }

  private readTyped(): unknown {
    this.skipWs();
    const match = /^<([A-Za-z0-9.:]+)(\s[^>]*)?(\/)?>/.exec(this.source.slice(this.index));
    if (!match) throw new Error("XML-RPC sin tipo.");
    const tag = match[1];
    this.index += match[0].length;
    if (match[3] === "/") {
      return tag === "nil" || tag === "ex:nil" ? null : "";
    }
    if (tag === "struct") return this.readStruct();
    if (tag === "array") return this.readArray();
    const text = this.readUntil(`</${tag}>`);
    if (tag === "string") return decodeXml(text);
    if (tag === "int" || tag === "i4" || tag === "i8") return Number.parseInt(text.trim(), 10);
    if (tag === "double") return Number(text.trim());
    if (tag === "boolean") return text.trim() === "1" || text.trim().toLowerCase() === "true";
    if (tag === "nil" || tag === "ex:nil") return null;
    if (tag === "dateTime.iso8601" || tag === "base64") return decodeXml(text);
    return decodeXml(text);
  }

  private readStruct(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    while (true) {
      this.skipWs();
      if (this.starts("</struct>")) {
        this.expect("</struct>");
        return out;
      }
      this.expect("<member>");
      this.skipWs();
      this.expect("<name>");
      const name = decodeXml(this.readUntil("</name>"));
      const value = this.readValue();
      this.skipWs();
      this.expect("</member>");
      out[name] = value;
    }
  }

  private readArray(): unknown[] {
    this.skipWs();
    this.expect("<data>");
    const items: unknown[] = [];
    while (true) {
      this.skipWs();
      if (this.starts("</data>")) {
        this.expect("</data>");
        this.skipWs();
        this.expect("</array>");
        return items;
      }
      items.push(this.readValue());
    }
  }
}

export function parseMethodResponse(xml: string): unknown {
  const reader = new Reader(xml.trim());
  reader.skipWs();
  if (reader.starts("<?xml")) reader.readUntil("?>");
  reader.expect("<methodResponse>");
  reader.skipWs();
  if (reader.starts("<fault>")) {
    reader.expect("<fault>");
    const fault = reader.readValue() as { faultString?: unknown; faultCode?: unknown };
    const message =
      typeof fault?.faultString === "string" && fault.faultString
        ? fault.faultString
        : "Error de Odoo.";
    throw new Error(message);
  }
  reader.expect("<params>");
  reader.skipWs();
  reader.expect("<param>");
  return reader.readValue();
}
