export type BlogSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  category?: string;
  sections: BlogSection[];
};

export const blogPostsFull: BlogPost[] = [
  {
    slug: "como-mejorar-la-eficiencia-energetica-en-industrias-y-oficinas",
    category: "Paneles solares",
    title: "¿Cómo mejorar la eficiencia energética en industrias y oficinas?",
    date: "2025-07-17",
    image: "/images/luz-1.jpg",
    excerpt:
      "La eficiencia energética no solo es una cuestión ambiental, también representa una estrategia clave para reducir costos operativos y mejorar la competitividad de empresas e industrias.",
    sections: [
      {
        paragraphs: [
          "La eficiencia energética no solo es una cuestión ambiental, también representa una estrategia clave para reducir costos operativos y mejorar la competitividad de empresas e industrias. Afortunadamente, existen múltiples formas de optimizar el uso de la energía sin sacrificar rendimiento ni comodidad.",
        ],
      },
      {
        heading: "Aquí te presentamos las más efectivas:",
      },
      {
        heading: "1. Diagnóstico energético: el primer paso",
        paragraphs: [
          "Antes de hacer cambios, es vital conocer cómo y dónde se consume la energía. Un diagnóstico o auditoría energética permite:",
        ],
        bullets: [
          "Identificar áreas de alto consumo.",
          "Detectar fugas o desperdicio energético.",
          "Priorizar mejoras con mayor impacto.",
        ],
      },
      {
        heading: "2. Iluminación eficiente",
        paragraphs: [
          "La iluminación representa hasta el 30% del consumo energético en oficinas. Para mejorarla:",
        ],
        bullets: [
          "Sustituye focos convencionales por tecnología LED.",
          "Implementa sensores de presencia y temporizadores.",
          "Aprovecha al máximo la luz natural.",
        ],
      },
      {
        heading: "3. Automatización y control",
        paragraphs: ["Instalar sistemas de gestión energética permite:"],
        bullets: [
          "Monitorear el consumo en tiempo real.",
          "Programar equipos según horarios productivos.",
          "Reducir el uso de aire acondicionado, calefacción o maquinaria fuera de horario.",
        ],
      },
      {
        heading: "4. Equipos eficientes",
        paragraphs: [
          "Renovar equipos antiguos por versiones de bajo consumo energético puede hacer una gran diferencia:",
        ],
        bullets: [
          "Motores eléctricos de alta eficiencia.",
          "Aires acondicionados con certificaciones.",
          "Computadoras, impresoras y electrodomésticos con etiqueta energética.",
        ],
      },
      {
        heading: "5. Paneles solares",
        paragraphs: ["Una de las inversiones más rentables a mediano plazo:"],
        bullets: [
          "Reduce drásticamente la factura de luz.",
          "Protege contra aumentos de tarifa.",
          "Mejora la huella ambiental de la empresa.",
        ],
      },
      {
        heading: "6. Fomentar una cultura de ahorro",
        paragraphs: ["Los pequeños hábitos también cuentan:"],
        bullets: [
          "Apagar luces y equipos cuando no se usan.",
          "Capacitar al personal sobre eficiencia energética.",
          "Establecer metas internas de ahorro y sostenibilidad.",
        ],
      },
      {
        paragraphs: [
          "La eficiencia energética es una decisión estratégica. Al implementar medidas adecuadas, las empresas no solo ahorran dinero, también construyen una operación más sustentable, responsable y preparada para el futuro. Cada kilowatt que no se desperdicia es una inversión que vuelve.",
        ],
      },
    ],
  },
  {
    slug: "como-preparar-tu-negocio-para-la-era-de-los-autos-electricos",
    category: "Cargadores electricos",
    title: "Cómo preparar tu negocio para la era de los autos eléctricos",
    date: "2025-07-17",
    image: "/images/estacion-de-carga.jpg",
    excerpt:
      "La movilidad eléctrica ya no es una promesa del futuro, es una realidad del presente. Cada vez más personas y empresas optan por vehículos eléctricos por sus beneficios económicos, operativos y ambientales.",
    sections: [
      {
        paragraphs: [
          "La movilidad eléctrica ya no es una promesa del futuro, es una realidad del presente. Cada vez más personas y empresas optan por vehículos eléctricos (EV) por sus beneficios económicos, operativos y ambientales. Pero, ¿está tu negocio listo para esta transformación?",
          "Prepararse para esta nueva era no solo es una decisión inteligente, también representa una oportunidad de crecimiento, modernización y liderazgo sostenible.",
        ],
      },
      {
        heading: "1. Instala estaciones de carga en tu negocio",
        paragraphs: [
          "La infraestructura de carga es el primer paso. Contar con cargadores eléctricos en tu empresa:",
        ],
        bullets: [
          "Aumenta el valor y atractivo de tus instalaciones.",
          "Mejora la experiencia de empleados, clientes o visitantes con EV.",
          "Puede convertirse en una fuente adicional de ingresos si ofreces el servicio al público.",
        ],
      },
      {
        heading: "2. Adapta tu flota empresarial",
        paragraphs: [
          "Si tu negocio usa vehículos para entregas, logística o transporte interno, cambiar a una flota eléctrica puede generar:",
        ],
        bullets: [
          "Reducción de costos en combustible y mantenimiento.",
          "Imagen innovadora y ecológica.",
          "Beneficios fiscales o incentivos según la región.",
        ],
      },
      {
        heading: "3. Educa a tu equipo",
        paragraphs: ["Adoptar nuevas tecnologías implica capacitar a tu personal:"],
        bullets: [
          "Sobre el uso y mantenimiento de EV.",
          "En temas de seguridad eléctrica.",
          "En prácticas sostenibles relacionadas con la movilidad.",
        ],
      },
      {
        heading: "4. Moderniza tu imagen corporativa",
        paragraphs: [
          "Mostrar que tu empresa se alinea con la transición energética:",
        ],
        bullets: [
          "Mejora tu reputación.",
          "Atrae a consumidores conscientes y socios estratégicos.",
          "Demuestra compromiso con el medio ambiente.",
        ],
      },
      {
        heading: "5. Aprovecha incentivos y financiamiento",
        paragraphs: [
          "Consulta los apoyos locales o federales disponibles para:",
        ],
        bullets: [
          "Adquisición de cargadores.",
          "Conversión de flotas.",
          "Certificaciones de sostenibilidad.",
        ],
      },
      {
        paragraphs: [
          "Adaptarse a la movilidad eléctrica es una decisión que posiciona a tu empresa a la vanguardia. Ya sea con estaciones de carga, flotas eléctricas o estrategias sostenibles, invertir hoy en infraestructura para EV es asegurar la competitividad del mañana.",
        ],
      },
    ],
  },
  {
    slug: "como-una-buena-iluminacion-mejora-la-eficiencia-y-estetica-de-un-edificio",
    category: "Iluminación",
    title: "Cómo una buena iluminación mejora la eficiencia y estética de un edificio",
    date: "2025-07-17",
    image: "/images/il.jpg",
    excerpt:
      "La iluminación no solo es funcional: también transforma espacios, optimiza el uso de la energía y genera bienestar.",
    sections: [
      {
        paragraphs: [
          "La iluminación no solo es funcional: también transforma espacios, optimiza el uso de la energía y genera bienestar. Una iluminación bien planificada puede hacer que un edificio sea más eficiente, seguro y visualmente atractivo. Pero, ¿cómo logra esto exactamente?",
        ],
      },
      {
        heading: "1. Eficiencia energética desde el diseño",
        paragraphs: [
          "Una buena iluminación considera la distribución estratégica de luminarias, el uso de sensores de movimiento y la tecnología LED. Esto permite:",
        ],
        bullets: [
          "Reducir el consumo eléctrico hasta en un 70%.",
          "Aprovechar mejor la luz natural.",
          "Disminuir la necesidad de mantenimiento por mayor durabilidad.",
        ],
      },
      {
        heading: "2. Impacto en el rendimiento y bienestar",
        paragraphs: [
          "En oficinas, escuelas, hospitales o industrias, una iluminación adecuada mejora:",
        ],
        bullets: [
          "La productividad y concentración del personal.",
          "El estado de ánimo y la salud visual.",
          "La percepción de seguridad y confort en cada espacio.",
        ],
      },
      {
        heading: "3. Estética que agrega valor",
        paragraphs: [
          "La iluminación arquitectónica puede destacar la identidad de un edificio:",
        ],
        bullets: [
          "Resalta texturas, formas y materiales.",
          "Aporta elegancia, modernidad o personalidad, según el proyecto.",
          "Mejora la percepción del inmueble, tanto de día como de noche.",
        ],
      },
      {
        heading: "4. Tecnología y automatización",
        paragraphs: [
          "Hoy en día, es posible integrar sistemas de iluminación inteligente que:",
        ],
        bullets: [
          "Se adaptan a la luz natural.",
          "Se controlan por horarios o apps móviles.",
          "Brindan escenarios distintos según el uso del espacio.",
        ],
      },
      {
        heading: "Conclusión",
        paragraphs: [
          "Invertir en una buena iluminación no solo embellece un edificio, sino que también reduce costos operativos y mejora la experiencia de quienes lo habitan o trabajan en él. La combinación entre eficiencia, estética y tecnología hace de la iluminación un factor clave en cualquier proyecto arquitectónico moderno.",
        ],
      },
    ],
  },
  {
    slug: "retorno-de-inversion-vale-la-pena-instalar-paneles-solares",
    category: "Paneles solares",
    title: "Retorno de inversión: ¿vale la pena instalar paneles solares?",
    date: "2025-07-16",
    image: "/images/5-4.jpg",
    excerpt:
      "La energía solar se ha convertido en una de las alternativas más inteligentes para quienes buscan reducir sus costos energéticos y apostar por la sostenibilidad.",
    sections: [
      {
        paragraphs: [
          "La energía solar se ha convertido en una de las alternativas más inteligentes para quienes buscan reducir sus costos energéticos y apostar por la sostenibilidad. Pero una de las preguntas más frecuentes es: ¿realmente vale la pena la inversión en paneles solares? La respuesta está en el retorno de inversión (ROI), y aquí te lo explicamos.",
        ],
      },
      {
        heading: "Factores que afectan el retorno de inversión",
        bullets: [
          "Consumo energético: Mientras mayor sea tu consumo, más rápido verás el retorno.",
          "Costo de la electricidad: En regiones con tarifas elevadas, como algunas zonas de México, el ahorro mensual es considerable.",
          "Incentivos gubernamentales: Algunos programas pueden reducir el costo inicial.",
          "Calidad de los equipos: Sistemas eficientes tienen mejor rendimiento y mayor vida útil.",
        ],
      },
      {
        heading: "¿En cuánto tiempo se recupera la inversión?",
        paragraphs: [
          "En promedio, el retorno de inversión se da entre 3 a 6 años, dependiendo del tamaño del sistema y tu patrón de consumo. Considerando que los paneles tienen una vida útil de 25 años o más, los beneficios económicos a largo plazo son evidentes.",
        ],
      },
      {
        heading: "Ahorro real y valor agregado",
        paragraphs: [
          "Instalar paneles solares no solo reduce tus facturas, también:",
        ],
        bullets: [
          "Aumenta el valor de tu propiedad.",
          "Te protege contra el alza de tarifas eléctricas.",
          "Contribuye al medio ambiente.",
        ],
      },
      {
        paragraphs: [
          "Instalar paneles solares sí vale la pena. Es una inversión inteligente que te ofrece independencia energética, ahorros sustanciales y beneficios sostenibles. Con un buen análisis previo y un proveedor confiable, el retorno de inversión está prácticamente garantizado.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPostsFull.find((p) => p.slug === slug);
}

export function getAllBlogSlugs() {
  return blogPostsFull.map((p) => p.slug);
}
