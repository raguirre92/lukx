export const BLOG_SERVICE_PAGES = [
  { title: "Paneles solares", value: "/paneles-solares" },
  { title: "Respaldo de energía en baterías (BESS)", value: "/sistemas-de-respaldo-de-energia-en-baterias" },
  { title: "Iluminación", value: "/iluminacion" },
  { title: "Estaciones de carga", value: "/estaciones-de-carga" },
  { title: "Soluciones residenciales", value: "/residencial" },
  { title: "Soluciones comerciales", value: "/comercial" },
  { title: "Soluciones industriales", value: "/industrial" },
] as const;

export function blogServicePage(path?: string | null) {
  if (!path) return undefined;
  return BLOG_SERVICE_PAGES.find((page) => page.value === path);
}
