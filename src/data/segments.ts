import type { FaqItem } from "@/components/FaqAccordion";
import { solutions, type SpaceId } from "@/data/site";

export type SegmentSolution = {
  id: string;
  title: string;
  text: string;
  href: string;
  image: string;
};

export type SegmentPage = {
  id: SpaceId;
  path: `/${SpaceId}`;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  image: string;
  solutions: SegmentSolution[];
  faqs: FaqItem[];
};

const solutionById = new Map(solutions.map((item) => [item.id, item]));

function card(id: string, title: string, text: string): SegmentSolution {
  const source = solutionById.get(id);
  if (!source) throw new Error(`Solución desconocida: ${id}`);
  return { id, title, text, href: source.href, image: source.image };
}

export const segmentPages: Record<SpaceId, SegmentPage> = {
  residencial: {
    id: "residencial",
    path: "/residencial",
    title: "Proyectos de energía para tu casa",
    description:
      "Lukx diseña e instala proyectos de paneles solares, respaldo, iluminación y carga para casas en Monterrey.",
    h1: "Energía e iluminación para tu casa",
    subtitle:
      "Diseñamos e instalamos el proyecto que tu hogar necesita. Cuéntanos cómo vives la casa y vemos qué conviene.",
    image: "/images/2025-07-residencial-2.jpg",
    solutions: [
      card(
        "paneles-solares",
        "Paneles solares",
        "Proyecto fotovoltaico para tu casa, del diseño a la instalación.",
      ),
      card(
        "sistemas-de-respaldo-de-energia-en-baterias",
        "Sistemas de respaldo",
        "Proyecto de respaldo para que lo esencial de tu casa siga en marcha.",
      ),
      card(
        "iluminacion",
        "Proyecto de iluminación",
        "Diseño e instalación de la luz de tu casa, según cada espacio.",
      ),
      card(
        "estaciones-de-carga",
        "Estaciones de carga",
        "Proyecto de carga para el auto eléctrico en casa.",
      ),
    ],
    faqs: [
      {
        question: "¿Qué proyectos hacen para una casa?",
        answer:
          "Diseñamos e instalamos paneles solares, respaldo, iluminación y carga para auto eléctrico. El proyecto se arma según cómo se vive la casa.",
      },
      {
        question: "¿Tengo que saber qué solución quiero?",
        answer:
          "No. En la asesoría revisamos tu casa y te decimos qué proyecto conviene. No hace falta llegar con la solución decidida.",
      },
      {
        question: "¿La asesoría me obliga a contratar?",
        answer: "No. Sirve para entender tu caso y definir el siguiente paso contigo.",
      },
    ],
  },
  comercial: {
    id: "comercial",
    path: "/comercial",
    title: "Proyectos de energía para tu negocio",
    description:
      "Lukx diseña e instala proyectos de paneles solares, iluminación, carga y respaldo para comercios en Monterrey.",
    h1: "Energía e iluminación para tu negocio",
    subtitle:
      "Diseñamos e instalamos el proyecto que acompaña la operación de tu local, sin detener lo que ya funciona.",
    image: "/images/2025-07-COMERCIAL.jpg",
    solutions: [
      card(
        "paneles-solares",
        "Paneles solares",
        "Proyecto fotovoltaico pensado para el consumo y el horario de tu negocio.",
      ),
      card(
        "iluminacion",
        "Proyecto de iluminación",
        "Diseño e instalación de la luz del local, según el uso de cada área.",
      ),
      card(
        "estaciones-de-carga",
        "Estaciones de carga",
        "Proyecto de carga para clientes o flotilla en tu negocio.",
      ),
      card(
        "sistemas-de-respaldo-de-energia-en-baterias",
        "Sistemas de respaldo",
        "Proyecto de respaldo para que la operación no se detenga.",
      ),
    ],
    faqs: [
      {
        question: "¿Qué proyectos hacen para un negocio?",
        answer:
          "Paneles solares, iluminación, estaciones de carga y respaldo. Lo definimos según cómo opera tu local.",
      },
      {
        question: "¿Sirve si el negocio ya está operando?",
        answer:
          "Sí. Revisamos la operación actual y proponemos el proyecto a partir de eso.",
      },
      {
        question: "¿Tengo que saber qué solución quiero?",
        answer: "No. Cuéntanos qué quieres resolver y lo vemos juntos en la asesoría.",
      },
    ],
  },
  industrial: {
    id: "industrial",
    path: "/industrial",
    title: "Proyectos de energía para tu planta",
    description:
      "Lukx diseña e instala proyectos de paneles solares, iluminación para naves y bodegas, carga y respaldo en Monterrey.",
    h1: "Energía e iluminación para tu planta",
    subtitle:
      "Diseñamos e instalamos el proyecto para naves, bodegas y plantas, según el uso del espacio y la operación.",
    image: "/images/2025-07-INDUSTRIAL-2.jpg",
    solutions: [
      card(
        "paneles-solares",
        "Paneles solares",
        "Proyecto fotovoltaico para el consumo de tu planta o bodega.",
      ),
      card(
        "iluminacion",
        "Iluminación para naves y bodegas",
        "Proyecto de iluminación según la altura, el trabajo y el recorrido del espacio.",
      ),
      card(
        "estaciones-de-carga",
        "Estaciones de carga",
        "Proyecto de carga para vehículos de la operación o de quien visita la planta.",
      ),
      card(
        "sistemas-de-respaldo-de-energia-en-baterias",
        "Sistemas de respaldo",
        "Proyecto de respaldo para lo que no puede parar en tu operación.",
      ),
    ],
    faqs: [
      {
        question: "¿Qué proyectos hacen para una planta o bodega?",
        answer:
          "Paneles solares, iluminación para naves y bodegas, estaciones de carga y respaldo. El alcance sale de cómo se usa el espacio.",
      },
      {
        question: "¿Trabajan espacios grandes?",
        answer:
          "Sí. El proyecto se arma a partir del uso del espacio y de la operación, no de un modelo único.",
      },
      {
        question: "¿Tengo que llegar con la solución definida?",
        answer: "No. En la asesoría revisamos la planta contigo y vemos el siguiente paso.",
      },
    ],
  },
};

// Sanity publicó estos proyectos sin categoría. La clasificación vive en el contenido local.
const LOCAL_SEGMENTS: Record<string, SpaceId[]> = {
  "rinconada-patos": ["residencial"],
  noho: ["residencial", "comercial"],
  "bodegas-gp": ["industrial"],
};

export function projectsForSegment<T extends { slug: string; category?: string }>(
  projects: T[],
  segment: SpaceId,
) {
  return projects.filter((project) => {
    const category = (project.category || "").toLowerCase();
    if (category && category !== "proyecto" && category.includes(segment)) return true;
    return LOCAL_SEGMENTS[project.slug]?.includes(segment) ?? false;
  });
}
