export type BookingPageId = "general" | "residencial" | "comercial" | "industrial";

export type BookingNeed = { value: string; label: string };

export type BookingExtra = {
  name: "tipoNegocio" | "tipoPlanta";
  label: string;
  placeholder: string;
  note: string;
};

export type BookingPage = {
  id: BookingPageId;
  path: "/agendar" | "/agendar/residencial" | "/agendar/comercial" | "/agendar/industrial";
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  bullets: string[];
  storyTitle: string;
  storyBody: string;
  storyImage: string;
  storyImageAlt: string;
  bannerLine: string;
  closeBody: string;
  needs: BookingNeed[];
  city: boolean;
  extra?: BookingExtra;
};

const GENERAL_NEEDS: BookingNeed[] = [
  { value: "paneles-solares", label: "Paneles solares" },
  { value: "sistemas-de-respaldo-de-energia-en-baterias", label: "Sistemas de respaldo" },
  { value: "iluminacion", label: "Iluminación" },
  { value: "estaciones-de-carga", label: "Estaciones de carga" },
  { value: "no-seguro", label: "No estoy seguro" },
];

export const bookingPages: Record<BookingPageId, BookingPage> = {
  general: {
    id: "general",
    path: "/agendar",
    title: "Agenda tu asesoría",
    description:
      "Cuéntanos qué quieres resolver y lo vemos en una llamada o videollamada.",
    h1: "Agenda tu asesoría",
    subtitle:
      "Cuéntanos qué quieres resolver y lo vemos en una llamada o videollamada, sin costo.",
    bullets: [
      "Tú eliges la necesidad, o nos dices que aún no estás seguro",
      "Revisamos tu casa, negocio o planta",
      "Definimos juntos el siguiente paso",
    ],
    storyTitle: "Qué vemos en la asesoría",
    storyBody:
      "No tienes que llegar con el proyecto decidido. Nos cuentas el caso y te orientamos.",
    storyImage: "/images/2025-12-Paneles-solares-carrusel-1-1.jpg",
    storyImageAlt: "Proyecto de energía e iluminación de Lukx",
    bannerLine: "Un proyecto a la medida de tu espacio.",
    closeBody: "Elige un horario para la llamada o videollamada.",
    needs: GENERAL_NEEDS,
    city: true,
  },
  residencial: {
    id: "residencial",
    path: "/agendar/residencial",
    title: "Asesoría para tu casa",
    description: "Vemos paneles solares, respaldo con baterías o ambos para tu casa.",
    h1: "Asesoría para tu casa",
    subtitle: "Vemos paneles solares, respaldo con baterías o los dos. La llamada es sin costo.",
    bullets: [
      "Paneles solares, respaldo con baterías, ambos u otro",
      "Revisamos cómo se vive la casa",
      "Te decimos qué proyecto conviene revisar",
    ],
    storyTitle: "Proyectos para tu casa",
    storyBody:
      "Diseñamos e instalamos paneles solares y sistemas de respaldo con baterías. En la llamada vemos cuál aplica.",
    storyImage: "/images/2025-07-residencial-2.jpg",
    storyImageAlt: "Casa con proyecto de energía de Lukx",
    bannerLine: "Un proyecto de energía para tu casa.",
    closeBody: "Agenda la llamada o videollamada.",
    needs: [
      { value: "paneles-solares", label: "Paneles solares" },
      { value: "respaldo-baterias", label: "Respaldo con baterías" },
      { value: "ambos", label: "Ambos" },
      { value: "otro", label: "Otro" },
    ],
    city: false,
  },
  comercial: {
    id: "comercial",
    path: "/agendar/comercial",
    title: "Asesoría para tu negocio",
    description: "Cuéntanos el tipo de negocio y qué proyecto quieres revisar.",
    h1: "Asesoría para tu negocio",
    subtitle: "Cuéntanos el tipo de negocio y qué proyecto quieres revisar. La llamada es sin costo.",
    bullets: [
      "Paneles, respaldo, iluminación o carga",
      "Nos dices qué tipo de negocio es",
      "Vemos el siguiente paso de tu proyecto",
    ],
    storyTitle: "Proyectos para tu negocio",
    storyBody:
      "Diseñamos e instalamos el proyecto según cómo opera tu local.",
    storyImage: "/images/2025-07-COMERCIAL.jpg",
    storyImageAlt: "Local comercial con proyecto de Lukx",
    bannerLine: "Un proyecto de energía para tu negocio.",
    closeBody: "Agenda la llamada o videollamada.",
    needs: GENERAL_NEEDS,
    city: true,
    extra: {
      name: "tipoNegocio",
      label: "Tipo de negocio",
      placeholder: "Por ejemplo: restaurante, oficina, tienda",
      note: "Tipo de negocio",
    },
  },
  industrial: {
    id: "industrial",
    path: "/agendar/industrial",
    title: "Asesoría para tu planta",
    description: "Cuéntanos el tipo de planta o nave y qué proyecto quieres revisar.",
    h1: "Asesoría para tu planta",
    subtitle: "Cuéntanos el tipo de planta o nave y qué proyecto quieres revisar. La llamada es sin costo.",
    bullets: [
      "Paneles, iluminación de naves, carga o respaldo",
      "Nos dices qué tipo de planta o nave es",
      "Vemos el siguiente paso de tu proyecto",
    ],
    storyTitle: "Proyectos para tu planta",
    storyBody:
      "Diseñamos e instalamos el proyecto según el uso de la nave o la planta.",
    storyImage: "/images/2025-07-INDUSTRIAL-2.jpg",
    storyImageAlt: "Nave industrial con proyecto de Lukx",
    bannerLine: "Un proyecto de energía para tu planta.",
    closeBody: "Agenda la llamada o videollamada.",
    needs: [
      { value: "paneles-solares", label: "Paneles solares" },
      { value: "iluminacion-naves", label: "Iluminación para naves y bodegas" },
      { value: "carga-flotilla", label: "Estaciones de carga/flotilla" },
      { value: "respaldo", label: "Respaldo" },
      { value: "no-seguro", label: "No estoy seguro" },
    ],
    city: true,
    extra: {
      name: "tipoPlanta",
      label: "Tipo de planta o nave",
      placeholder: "Por ejemplo: bodega, planta de producción",
      note: "Tipo de planta/nave",
    },
  },
};

export function isBookingPageId(value: unknown): value is BookingPageId {
  return value === "general" || value === "residencial" || value === "comercial" || value === "industrial";
}
