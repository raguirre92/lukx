import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GONE = new Set(["/sample-page", "/carrusel-de-inicio", "/comments/feed", "/category/uncategorized"]);

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

export function proxy(request: NextRequest) {
  if (!isGone(request.nextUrl.pathname)) return NextResponse.next();
  return new NextResponse("Esta página ya no existe.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/sample-page",
    "/sample-page/",
    "/carrusel-de-inicio",
    "/carrusel-de-inicio/",
    "/comments/feed",
    "/comments/feed/",
    "/category/uncategorized",
    "/category/uncategorized/",
    "/category/:slug/feed",
    "/category/:slug/feed/",
    "/:slug/feed",
    "/:slug/feed/",
  ],
};
