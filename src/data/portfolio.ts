import { scrapedPortfolio } from "@/lib/content";

export type PortfolioProject = {
  slug: string;
  title: string;
  image: string;
  imageAlt?: string;
  gallery: string[];
  galleryAlts?: string[];
  category: string;
  location?: string;
  summary: string;
  description: string[];
  services: string[];
  body?: unknown[];
  noindex?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

const meta: Record<
  string,
  { category: string; summary: string; description: string[]; services: string[] }
> = {
  "grand-park": {
    category: "Iluminación",
    summary: "Proyecto Grand Park — solución de iluminación y eficiencia energética.",
    description: [
      "Proyecto Grand Park desarrollado por Lukx, integrando soluciones de iluminación de alto rendimiento para realzar la arquitectura y mejorar la experiencia del espacio.",
      "Trabajamos con un enfoque integral: selección de luminarias, diseño fotométrico e instalación profesional para lograr eficiencia, estética y durabilidad.",
    ],
    services: ["Diseño de iluminación", "Proyecto de iluminación LED", "Instalación"],
  },
  "bodegas-gp": {
    category: "Industrial",
    summary: "Proyecto Bodegas GP — iluminación industrial y eficiencia operativa.",
    description: [
      "En Bodegas GP implementamos soluciones energéticas e iluminación pensadas para entornos industriales de alto tráfico y operación continua.",
      "El objetivo: reducir costos de energía y mantenimiento, mejorar niveles de luz y garantizar un entorno de trabajo más seguro y productivo.",
    ],
    services: ["Iluminación industrial LED", "Asesoría técnica", "Eficiencia energética"],
  },
  "colegio-excelsior": {
    category: "Institucional",
    summary: "Proyecto Colegio Excelsior — iluminación funcional y confort visual.",
    description: [
      "Proyecto Colegio Excelsior, donde la iluminación se diseñó para apoyar el aprendizaje, la seguridad y el confort visual en espacios educativos.",
      "Combinamos funcionalidad y eficiencia para crear ambientes adecuados a cada área del campus.",
    ],
    services: ["Iluminación arquitectónica", "Iluminación LED", "Proyecto integral"],
  },
  ifpp: {
    category: "Institucional",
    summary: "Proyecto IFPP — soluciones energéticas e iluminación a la medida.",
    description: [
      "En el proyecto IFPP, Lukx aportó soluciones energéticas e iluminación adaptadas a las necesidades del inmueble y su operación diaria.",
      "Priorizamos eficiencia, calidad de luz y un resultado visual que fortalece la identidad del espacio.",
    ],
    services: ["Diseño de iluminación", "Eficiencia energética", "Instalación"],
  },
  noho: {
    category: "Residencial",
    summary: "Proyecto Noho — iluminación que destaca arquitectura y atmósfera.",
    description: [
      "Proyecto Noho, orientado a potenciar la estética y atmósfera del espacio mediante un diseño de iluminación estratégico.",
      "Seleccionamos luminarias y esquemas de luz que equilibran funcionalidad, estética y eficiencia energética.",
    ],
    services: ["Iluminación arquitectónica", "Selección de luminarias", "Instalación"],
  },
  "parroquia-goretti": {
    category: "Institucional",
    summary: "Proyecto Parroquia Goretti — luz que acompaña y realza el espacio.",
    description: [
      "En Parroquia Goretti desarrollamos una propuesta de iluminación respetuosa con la arquitectura y el carácter del lugar.",
      "El resultado busca confort visual, presencia nocturna y eficiencia operativa a largo plazo.",
    ],
    services: ["Diseño de iluminación", "Suministro LED", "Instalación"],
  },
  "rinconada-patos": {
    category: "Residencial",
    summary: "Proyecto Rinconada Patos — iluminación residencial de alto valor.",
    description: [
      "Proyecto Rinconada Patos, enfocado en crear ambientes residenciales atractivos, seguros y eficientes a través de la luz.",
      "Integramos diseño, producto y ejecución para un resultado duradero y con identidad.",
    ],
    services: ["Iluminación residencial", "Diseño personalizado", "Instalación"],
  },
};

export const portfolioProjects: PortfolioProject[] = scrapedPortfolio.map((item) => {
  const extra = meta[item.slug] ?? {
    category: "Proyecto",
    summary: `Proyecto ${item.title}`,
    description: [item.contentText || `Proyecto ${item.title} desarrollado por Lukx.`],
    services: ["Diseño", "Suministro", "Instalación"],
  };
  const gallery = item.gallery?.length
    ? item.gallery
    : item.images?.length
      ? item.images
      : item.featuredImage
        ? [item.featuredImage]
        : [];

  return {
    slug: item.slug,
    title: item.title,
    image: item.featuredImage || gallery[0] || "/images/2025-09-3.jpg",
    gallery,
    ...extra,
  };
});

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}

export function getAllPortfolioSlugs() {
  return portfolioProjects.map((p) => p.slug);
}
