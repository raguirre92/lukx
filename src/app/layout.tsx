import type { Metadata } from "next";
import localFont from "next/font/local";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

/*
  Self-hosted fonts: next/font/google + Turbopack was corrupting the latin
  unicode-range for á/é/í/ó/ú/ñ, so glyphs fell back to another face.
*/
const montserrat = localFont({
  src: "../fonts/montserrat-latin-400.woff2",
  weight: "400 700",
  variable: "--font-montserrat",
  display: "swap",
  adjustFontFallback: false,
});

const bebas = localFont({
  src: "../fonts/bebas-neue-latin.woff2",
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "Paneles solares precio Monterrey - Lukx",
    template: "%s - Lukx",
  },
  description:
    "Lukx: soluciones energéticas e iluminación en Monterrey. Paneles solares, LED, estaciones de carga, coolers y sistemas de respaldo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className={`${montserrat.className} flex min-h-full flex-col`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
