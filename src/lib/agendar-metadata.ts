import type { Metadata } from "next";
import { paginas, type Pag } from "@/content/agendar-copys-v2";
import { brandedPage } from "@/lib/seo";

export function findPag(url: string): Pag {
  const pag = paginas.find((item) => item.url === url);
  if (!pag) throw new Error(`No hay copy para ${url}`);
  return pag;
}

export function agendarMetadata(pag: Pag): Metadata {
  return {
    ...brandedPage({
      title: pag.title,
      description: pag.meta,
      path: pag.url,
      absolute: true,
    }),
    robots: pag.url === "/agendar" ? { index: true, follow: true } : { index: false, follow: true },
  };
}
