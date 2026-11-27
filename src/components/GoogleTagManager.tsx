"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pushDataLayer } from "@/lib/attribution";

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-KR2SSZKV";

type ClickEvent = "click_telefono" | "click_whatsapp" | "click_email";

function classify(href: string): ClickEvent | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "click_telefono";
  if (h.startsWith("mailto:")) return "click_email";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(h) || h.startsWith("whatsapp:")) {
    return "click_whatsapp";
  }
  return null;
}

/**
 * Escucha clics en todo el sitio y manda `click_telefono`, `click_whatsapp`
 * o `click_email` al dataLayer. `pagina` sale de `data-track-pagina` en el
 * enlace o en un contenedor; si no hay, de la ruta actual. `ubicacion`
 * (footer, contacto_cta, boton_flotante…) sale de `data-track-ubicacion`.
 */
function useContactClickTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const event = classify(link.getAttribute("href") || "");
      if (!event) return;
      const tagged = link.closest("[data-track-pagina]") as HTMLElement | null;
      const pagina = tagged?.dataset.trackPagina || window.location.pathname;
      const zone = link.closest("[data-track-ubicacion]") as HTMLElement | null;
      const ubicacion = zone?.dataset.trackUbicacion || "";
      pushDataLayer(event, ubicacion ? { pagina, ubicacion } : { pagina });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);
}

export default function GoogleTagManager() {
  const pathname = usePathname() || "";
  const enabled = Boolean(GTM_ID) && !pathname.startsWith("/studio");
  useContactClickTracking(enabled);
  if (!enabled) return null;
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`}
      </Script>
    </>
  );
}
