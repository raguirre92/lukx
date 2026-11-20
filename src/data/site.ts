export const site = {
  name: "Lukx",
  tagline: "Soluciones energéticas e iluminación",
  url: "https://lukx.com.mx",
  phoneOffice: "+52 81 8340 1975",
  phoneOfficeTel: "+528183401975",
  phoneMobile: "+52 81 1524 9123",
  phoneMobileTel: "+528115249123",
  email: "hola@lukx.com.mx",
  address: "Miguel Nieto#306, Nuevas colonias, Monterrey Nuevo León",
  whatsapp: "https://wa.me/528115249123",
  social: {
    instagram: "https://www.instagram.com/lukx.mexico/",
    facebook: "https://www.facebook.com/lukx.mexico/",
    linkedin: "https://www.linkedin.com/company/lukx-m%C3%A9xico/?originalSubdomain=mx",
  },
  privacyPdf: "/Aviso-de-Privacidad-LUKX.pdf",
  logos: {
    horizontalWhite: "/images/2025-05-LOGO-LUKX-BLANC-1.png",
    verticalWhite: "/images/2025-05-logo-vertical-blanco.png",
  },
};

export const navSolutions = [
  {
    label: "Paneles solares",
    href: "/paneles-solares",
    image: "/images/2025-12-Paneles-solares-carrusel-1-1.jpg",
    summary: "Sistemas a la medida para generar energía y bajar el recibo.",
  },
  {
    label: "Sistemas de respaldo",
    href: "/sistemas-de-respaldo-de-energia-en-baterias",
    image: "/images/2025-12-GSL-Liquid-Cooling-BESS-Container-Battery-Storage-1.jpg",
    summary: "Baterías y respaldo para que la operación no se detenga.",
  },
  {
    label: "Iluminación",
    href: "/iluminacion",
    image: "/images/2025-12-BODEGA-ILUMINACION-CARRUSEL-1-1-scaled.jpg",
    summary: "Proyectos que resuelven el uso, el diseño y el consumo.",
  },
  {
    label: "Estaciones de carga",
    href: "/estaciones-de-carga",
    image: "/images/2025-12-Estaciones-de-carga-carrusel-2-1-scaled.jpg",
    summary: "Carga para autos eléctricos en casa, negocio o planta.",
  },
];

export const navMain = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Soluciones", href: "#", children: navSolutions },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contacto", href: "/contacto" },
];

export const heroSlides = [
  {
    title: ["Soluciones energéticas", "e iluminación."],
    image: "/images/2025-12-Paneles-solares-carrusel-1-1.jpg",
    href: "/contacto",
  },
  {
    title: ["Soluciones energéticas", "e iluminación."],
    image: "/images/2025-12-Estaciones-de-carga-carrusel-2-1-scaled.jpg",
    href: "/estaciones-de-carga",
  },
  {
    title: ["Soluciones energéticas", "e iluminación."],
    image: "/images/2025-12-BODEGA-ILUMINACION-CARRUSEL-1-1-scaled.jpg",
    href: "/iluminacion",
  },
  {
    title: ["Soluciones energéticas", "e iluminación."],
    image: "/images/2025-12-GSL-Liquid-Cooling-BESS-Container-Battery-Storage-1.jpg",
    href: "/sistemas-de-respaldo-de-energia-en-baterias",
  },
  {
    title: ["Soluciones energéticas", "e iluminación."],
    image: "/images/2025-12-WhatsApp-Image-2025-07-07-at-3.58.27-PM-1.jpeg",
    href: "/contacto",
  },
];

export const solutions = [
  {
    id: "paneles-solares",
    title: "Paneles Solares",
    href: "/paneles-solares",
    image: "/images/2025-05-847925520_241513079_1706x960.webp",
    description:
      "Sistemas fotovoltaicos diseñados para reducir el consumo eléctrico y generar energía limpia de forma eficiente y sostenible. Conoce sobre paneles solares precio Monterrey",
  },
  {
    id: "sistemas-de-respaldo-de-energia-en-baterias",
    title: "Energía en baterías",
    href: "/sistemas-de-respaldo-de-energia-en-baterias",
    image: "/images/2025-10-baterias.jpg",
    description:
      "Impulsamos el futuro energético con soluciones integrales de almacenamiento de energía y baterías (BESS).",
  },
  {
    id: "iluminacion",
    title: "Iluminación",
    href: "/iluminacion",
    image: "/images/2025-07-Office-Design-_-UFFICIO-HIGHCOMMERCE.jpg",
    description:
      "Soluciones de iluminación que combinan tecnología, diseño y funcionalidad para realzar espacios residenciales, comerciales e industriales.",
  },
  {
    id: "estaciones-de-carga",
    title: "Cargadores Eléctricos",
    href: "/estaciones-de-carga",
    image: "/images/2025-07-cargador-electrico.jpg",
    description:
      "Instalación de estaciones de carga para vehículos eléctricos, pensadas para facilitar la transición a la movilidad sustentable.",
  },
];

export const industries = [
  {
    title: "Residencial",
    image: "/images/2025-07-residencial-2.jpg",
  },
  {
    title: "Industrial",
    image: "/images/2025-07-INDUSTRIAL-2.jpg",
  },
  {
    title: "Comercial",
    image: "/images/2025-07-COMERCIAL.jpg",
  },
];


export type SpaceId = "residencial" | "comercial" | "industrial";

export const spaces = [
  {
    id: "residencial" as const,
    title: "Residencial",
    image: "/images/2025-07-residencial-2.jpg",
    blurb: "Para tu casa: un proyecto de energía e iluminación a tu medida.",
    solutionIds: [
      "paneles-solares",
      "sistemas-de-respaldo-de-energia-en-baterias",
      "iluminacion",
      "estaciones-de-carga",
    ],
  },
  {
    id: "comercial" as const,
    title: "Comercial",
    image: "/images/2025-07-COMERCIAL.jpg",
    blurb: "Para tu negocio: el proyecto que acompaña la operación de tu local.",
    solutionIds: [
      "paneles-solares",
      "iluminacion",
      "estaciones-de-carga",
      "sistemas-de-respaldo-de-energia-en-baterias",
    ],
  },
  {
    id: "industrial" as const,
    title: "Industrial",
    image: "/images/2025-07-INDUSTRIAL-2.jpg",
    blurb: "Para tu planta: energía, iluminación de naves y bodegas, carga y respaldo.",
    solutionIds: [
      "paneles-solares",
      "iluminacion",
      "estaciones-de-carga",
      "sistemas-de-respaldo-de-energia-en-baterias",
    ],
  },
];

export function isSpaceId(value: string | undefined): value is SpaceId {
  return value === "residencial" || value === "comercial" || value === "industrial";
}

export function agendarHref(opts?: { segmento?: string; solucion?: string }) {
  const params = new URLSearchParams();
  if (opts?.segmento) params.set("segmento", opts.segmento);
  if (opts?.solucion) params.set("solucion", opts.solucion);
  const query = params.toString();
  return query ? `/agendar?${query}` : "/agendar";
}

export const benefitTabs = [
  {
    id: "paneles",
    label: "Paneles Solares",
    image: "/images/2025-12-Paneles-solares-carrusel-1-1.jpg",
    video: "/videos/WhatsApp-Video-2024-09-10-at-4.39.13-PM.mp4",
    body: "Somos expertos en asesoramiento de proyectos fotovoltaicos para generar una alta rentabilidad en su inversión, buscando el ahorro energético y acompañarte durante todo el proceso, realizamos proyectos llave en mano para que nuestros clientes no tengan que preocuparse de nada hasta que les entreguemos la instalación completamente funcionando.",
  },
  {
    id: "respaldo",
    label: "Sistema de Respaldo",
    image: "/images/elementor-thumbs-baterias-rcxbh93cyxjj83clldkyayzj3n8p0at94vwsztzfp0.jpg",
    body: "Diseñamos soluciones integrales de respaldo energético con tecnología BESS y Generadores Eléctricos, garantizando continuidad operativa, seguridad industrial, eficiencia energética y máxima confiabilidad para tu empresa.",
  },
  {
    id: "led",
    label: "Iluminación LED",
    image:
      "/images/elementor-thumbs-WhatsApp-Image-2025-07-02-at-9.54.02-AM-rf046vxcuputdc0zw7b3a3idh1zbawi1hmn2r7l5pw.jpeg",
    body: "Además de la comercialización de muchas marcas nacionales e internacionales de las cuales contamos con más de 1500 m2 de productos de entrega inmediata. Contamos con nuestro departamento de proyectos capaz de desarrollar propuestas de iluminación desde su concepto, hasta verlo cobrar vida.",
  },
  {
    id: "carga",
    label: "Estación de Carga",
    image: "/images/2025-07-estacion-de-carga.jpg",
    body: "Realizamos los proyectos (comercialización e instalación) de acuerdo a las necesidades de nuestro cliente siempre buscando eficiencia y sostenibilidad.",
    bullets: [
      "Eficiencia: Carga rápida y segura",
      "Sostenibilidad: Contribuye a un futuro más verde y reduce tu huella de carbono.",
    ],
  },
];

export const projects = [
  { title: "Grand Park", slug: "grand-park", image: "/images/2025-07-3-4.jpg" },
  { title: "Bodegas GP", slug: "bodegas-gp", image: "/images/2025-07-1-3.jpg" },
  { title: "Colegio Excelsior", slug: "colegio-excelsior", image: "/images/2025-07-3-4.jpg" },
  { title: "IFPP", slug: "ifpp", image: "/images/2025-07-7-3.jpg" },
  { title: "Noho", slug: "noho", image: "/images/2025-07-1-3.jpg" },
  { title: "Parroquia Goretti", slug: "parroquia-goretti", image: "/images/2025-07-8-1.jpg" },
  { title: "Rinconada Patos", slug: "rinconada-patos", image: "/images/2025-07-1-2.jpg" },
];

export const blogPosts = [
  {
    slug: "como-mejorar-la-eficiencia-energetica-en-industrias-y-oficinas",
    title: "¿Cómo mejorar la eficiencia energética en industrias y oficinas?",
    image: "/images/2025-07-luz-1.jpg",
    date: "2025-07-17",
  },
  {
    slug: "como-preparar-tu-negocio-para-la-era-de-los-autos-electricos",
    title: "Cómo preparar tu negocio para la era de los autos eléctricos",
    image: "/images/2025-07-estacion-de-carga.jpg",
    date: "2025-07-17",
  },
  {
    slug: "como-una-buena-iluminacion-mejora-la-eficiencia-y-estetica-de-un-edificio",
    title: "Cómo una buena iluminación mejora la eficiencia y estética de un edificio",
    image: "/images/2025-07-il.jpg",
    date: "2025-07-17",
  },
  {
    slug: "retorno-de-inversion-vale-la-pena-instalar-paneles-solares",
    title: "Retorno de inversión: ¿vale la pena instalar paneles solares?",
    image: "/images/2025-07-5-4.jpg",
    date: "2025-07-16",
  },
];
