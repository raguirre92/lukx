import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GONE = new Set([
  "/sample-page",
  "/carrusel-de-inicio",
  "/comments/feed",
  "/category/uncategorized",
  "/wp-content/uploads/2021/05/AURORA-HIGH-BAY-1.pdf",
  "/wp-content/uploads/2021/05/UFO-HIGH-BAY.pdf",
  "/wp-content/uploads/2021/05/Access-Street-Light-A-1.pdf",
]);

const STAGING_REALM = 'Basic realm="Lukx staging", charset="UTF-8"';

function normalize(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

function isGone(pathname: string) {
  const path = normalize(pathname);
  if (GONE.has(path)) return true;
  if (/^\/category\/[^/]+\/feed$/.test(path)) return true;
  if (/^\/[^/]+\/feed$/.test(path)) return true;
  return false;
}

function isAuthExempt(pathname: string) {
  if (pathname === "/api/revalidate" || pathname.startsWith("/api/revalidate/")) return true;
  if (pathname.startsWith("/_next/static/") || pathname === "/_next/static") return true;
  if (pathname.startsWith("/_next/image/") || pathname === "/_next/image") return true;
  if (
    pathname === "/favicon.ico" ||
    pathname === "/icon" ||
    pathname === "/icon.png" ||
    pathname === "/apple-icon" ||
    pathname === "/apple-icon.png" ||
    pathname === "/icon-192.png" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/site.webmanifest" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/icons/")
  ) {
    return true;
  }
  return false;
}

function stagingPassword() {
  if (process.env.VERCEL_ENV === "production") return null;
  const password = process.env.STAGING_PASSWORD;
  if (!password) return null;
  return password;
}

function sameSecret(provided: string, expected: string) {
  const left = createHash("sha256").update(provided, "utf8").digest();
  const right = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(left, right);
}

function unauthorized() {
  return new NextResponse("Autenticación requerida.", {
    status: 401,
    headers: { "WWW-Authenticate": STAGING_REALM },
  });
}

function basicPassword(header: string | null) {
  if (!header) return null;
  const match = /^Basic\s+([A-Za-z0-9+/=]+)$/i.exec(header.trim());
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return decoded.slice(separator + 1);
  } catch {
    return null;
  }
}

function requireStagingAuth(request: NextRequest) {
  const expected = stagingPassword();
  if (!expected) return null;
  const provided = basicPassword(request.headers.get("authorization"));
  if (provided === null || !sameSecret(provided, expected)) return unauthorized();
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isAuthExempt(pathname)) {
    const denied = requireStagingAuth(request);
    if (denied) return denied;
  }
  if (!isGone(pathname)) return NextResponse.next();
  return new NextResponse("Esta página ya no existe.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/revalidate|favicon\\.ico|icon(?:\\.png)?|apple-icon(?:\\.png)?|icon-192\\.png|icons/|manifest\\.webmanifest|site\\.webmanifest|manifest\\.json).*)",
  ],
};
