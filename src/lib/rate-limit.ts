type Bucket = { hits: number[] };

const globalBuckets = globalThis as typeof globalThis & {
  __lukxLeadRate?: Map<string, Bucket>;
};

function buckets(): Map<string, Bucket> {
  if (!globalBuckets.__lukxLeadRate) globalBuckets.__lukxLeadRate = new Map();
  return globalBuckets.__lukxLeadRate;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip.slice(0, 80);
  }
  return request.headers.get("x-real-ip")?.trim().slice(0, 80) || "local";
}

/** Outside development, allow up to 8 writes per IP in 10 minutes. */
export function allowLeadWrite(ip: string, now = Date.now()): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const windowMs = 10 * 60 * 1000;
  const limit = 8;
  const store = buckets();
  const bucket = store.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((hit) => now - hit < windowMs);
  if (bucket.hits.length >= limit) {
    store.set(ip, bucket);
    return false;
  }
  bucket.hits.push(now);
  store.set(ip, bucket);
  if (store.size > 5000) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  return true;
}
