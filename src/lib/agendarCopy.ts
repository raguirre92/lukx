export const SEGMENT_LABELS: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  industrial: "Industrial",
};

export const SOLUTION_LABELS: Record<string, string> = {
  "paneles-solares": "Paneles solares",
  iluminacion: "Iluminación",
  "estaciones-de-carga": "Estaciones de carga",
  "sistemas-de-respaldo-de-energia-en-baterias": "Sistemas de respaldo",
};

export type AgendarCopy = {
  interest: string;
  intro: string;
  bullets: string[];
  storyTitle: string;
  storyBody: string;
  storyImage: string;
  storyImageAlt: string;
  bannerLine: string;
  alliesBody: string;
  closeBody: string;
  isHomeSolar: boolean;
};

const HOME_IMAGE = "/images/2025-07-residencial-2.jpg";
const SOLAR_IMAGE = "/images/2025-12-Paneles-solares-carrusel-1-1.jpg";

function placePhrase(segmento?: string) {
  if (segmento === "residencial") return "tu casa";
  if (segmento === "comercial") return "tu negocio";
  if (segmento === "industrial") return "tu planta";
  return "tu proyecto";
}

export function getAgendarCopy(
  segmento?: string | null,
  solucion?: string | null,
): AgendarCopy {
  const seg = segmento && SEGMENT_LABELS[segmento] ? segmento : undefined;
  const sol = solucion && SOLUTION_LABELS[solucion] ? solucion : undefined;
  const place = placePhrase(seg);
  const interest = [seg && SEGMENT_LABELS[seg], sol && SOLUTION_LABELS[sol]]
    .filter(Boolean)
    .join(" · ");

  const isHomeSolar =
    (!seg && !sol) ||
    (sol === "paneles-solares" && (!seg || seg === "residencial")) ||
    (seg === "residencial" && !sol);

  if (isHomeSolar) {
    return {
      interest: interest || "Residencial · Paneles solares",
      intro:
        "Videollamada para revisar tu recibo de CFE y diseñar paneles solares a la medida de tu casa.",
      bullets: [
        "Diagnóstico de consumo residencial",
        "Estimación de ahorro y tamaño de sistema",
        "Siguiente paso claro: visita o propuesta",
      ],
      storyTitle: "PANELES SOLARES PARA TU CASA",
      storyBody:
        "Menos dependencia de la tarifa eléctrica, más control sobre tu consumo. Pensado para hogares en Monterrey y área metropolitana.",
      storyImage: HOME_IMAGE,
      storyImageAlt: "Casa con solución energética residencial Lukx",
      bannerLine: "Energía limpia en tu techo. Ahorro que se nota en el recibo.",
      alliesBody:
        "Trabajamos con marcas y equipos de confianza para proyectos residenciales sólidos y de larga vida útil.",
      closeBody:
        "Agenda tu videollamada y revisamos juntos si los paneles solares convienen para tu casa.",
      isHomeSolar: true,
    };
  }

  if (sol === "iluminacion") {
    return {
      interest: interest || SOLUTION_LABELS.iluminacion,
      intro: `Videollamada para revisar el proyecto de iluminación de ${place} y proponerte una solución a la medida.`,
      bullets: [
        "Revisamos el espacio, el uso y lo que quieres lograr",
        "Te decimos qué tipo de iluminación conviene",
        "Siguiente paso claro: visita o propuesta",
      ],
      storyTitle: "QUÉ INCLUYE LA ASESORÍA",
      storyBody:
        "Hablamos de tu espacio, del resultado que buscas y de cómo aterrizarlo en un proyecto de iluminación claro, sin compromiso de compra.",
      storyImage: "/images/2025-12-BODEGA-ILUMINACION-CARRUSEL-1-1-scaled.jpg",
      storyImageAlt: "Proyecto de iluminación Lukx",
      bannerLine: "Una asesoría clara para decidir con información, no a ciegas.",
      alliesBody:
        "Trabajamos con marcas y equipos de confianza para proyectos sólidos y de larga vida útil.",
      closeBody: `Agenda tu videollamada y revisamos juntos la iluminación de ${place}.`,
      isHomeSolar: false,
    };
  }

  if (sol === "estaciones-de-carga") {
    return {
      interest: interest || SOLUTION_LABELS["estaciones-de-carga"],
      intro: `Videollamada para revisar cómo preparar ${place} para la carga de vehículos eléctricos.`,
      bullets: [
        "Revisamos el tipo de uso y el espacio disponible",
        "Te decimos qué estación de carga conviene",
        "Siguiente paso claro: visita o propuesta",
      ],
      storyTitle: "QUÉ INCLUYE LA ASESORÍA",
      storyBody:
        "Platicamos del uso previsto, la instalación y el siguiente paso para dejar lista la carga eléctrica, sin compromiso de compra.",
      storyImage: "/images/2025-12-Estaciones-de-carga-carrusel-2-1-scaled.jpg",
      storyImageAlt: "Estación de carga Lukx",
      bannerLine: "Una asesoría clara para decidir con información, no a ciegas.",
      alliesBody:
        "Trabajamos con marcas y equipos de confianza para proyectos sólidos y de larga vida útil.",
      closeBody: `Agenda tu videollamada y revisamos juntos la carga eléctrica para ${place}.`,
      isHomeSolar: false,
    };
  }

  if (sol === "sistemas-de-respaldo-de-energia-en-baterias") {
    return {
      interest: interest || SOLUTION_LABELS["sistemas-de-respaldo-de-energia-en-baterias"],
      intro: `Videollamada para revisar el respaldo energético de ${place} y la continuidad de tu operación.`,
      bullets: [
        "Revisamos qué necesitas respaldar y por cuánto tiempo",
        "Te decimos qué tipo de sistema conviene",
        "Siguiente paso claro: visita o propuesta",
      ],
      storyTitle: "QUÉ INCLUYE LA ASESORÍA",
      storyBody:
        "Hablamos de continuidad operativa, del tipo de carga crítica y de cómo aterrizar un respaldo claro, sin compromiso de compra.",
      storyImage: "/images/2025-12-GSL-Liquid-Cooling-BESS-Container-Battery-Storage-1.jpg",
      storyImageAlt: "Sistema de respaldo energético Lukx",
      bannerLine: "Una asesoría clara para decidir con información, no a ciegas.",
      alliesBody:
        "Trabajamos con marcas y equipos de confianza para proyectos sólidos y de larga vida útil.",
      closeBody: `Agenda tu videollamada y revisamos juntos el respaldo energético de ${place}.`,
      isHomeSolar: false,
    };
  }

  if (sol === "paneles-solares") {
    return {
      interest: interest || SOLUTION_LABELS["paneles-solares"],
      intro: `Videollamada para revisar el consumo de ${place} y diseñar un sistema de paneles solares a la medida.`,
      bullets: [
        `Diagnóstico de consumo para ${place}`,
        "Estimación de ahorro y tamaño de sistema",
        "Siguiente paso claro: visita o propuesta",
      ],
      storyTitle: "QUÉ INCLUYE LA ASESORÍA",
      storyBody: `Revisamos tu recibo o historial de consumo y te decimos qué sistema solar conviene para ${place}, sin compromiso de compra.`,
      storyImage: SOLAR_IMAGE,
      storyImageAlt: "Instalación de paneles solares Lukx",
      bannerLine: "Una asesoría clara para decidir con información, no a ciegas.",
      alliesBody:
        "Trabajamos con marcas y equipos de confianza para proyectos sólidos y de larga vida útil.",
      closeBody: `Agenda tu videollamada y revisamos juntos si los paneles solares convienen para ${place}.`,
      isHomeSolar: false,
    };
  }

  // Segment only (comercial / industrial without a product)
  return {
    interest: interest || (seg ? SEGMENT_LABELS[seg] : "Asesoría"),
    intro: `Videollamada para revisar las necesidades de ${place} y decirte qué solución de energía o iluminación conviene.`,
    bullets: [
      `Revisamos tu caso: consumo, espacio o proyecto de ${place}`,
      "Te decimos qué solución conviene (solar, iluminación u otra)",
      "Siguiente paso claro: visita o propuesta",
    ],
    storyTitle: "QUÉ INCLUYE LA ASESORÍA",
    storyBody:
      "No tienes que llegar sabiendo el producto exacto. Revisamos tu caso y te orientamos a la solución que sí aplica, sin compromiso de compra.",
    storyImage: seg === "industrial" ? "/images/2025-07-INDUSTRIAL-2.jpg" : "/images/2025-07-COMERCIAL.jpg",
    storyImageAlt: `Proyecto ${seg ? SEGMENT_LABELS[seg].toLowerCase() : ""} Lukx`,
    bannerLine: "Una asesoría clara para decidir con información, no a ciegas.",
    alliesBody:
      "Trabajamos con marcas y equipos de confianza para proyectos sólidos y de larga vida útil.",
    closeBody: `Agenda tu videollamada y revisamos juntos qué conviene para ${place}.`,
    isHomeSolar: false,
  };
}
