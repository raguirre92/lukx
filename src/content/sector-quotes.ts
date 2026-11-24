export type SectorQuote = {
  h1: string;
  sub: string;
  linea: "comercial" | "industrial" | "asesoria";
  heroImage: string;
  heroAlt: string;
  mosaicA: string;
  mosaicAAlt: string;
  mosaicB: string;
  mosaicBAlt: string;
  solutionsTitle: string;
  solutionsIntro: string;
  solutions: readonly (readonly [string, string])[];
  solutionImage: string;
  solutionAlt: string;
  backupTitle: string;
  backupText: string;
  backupImage: string;
  backupAlt: string;
  process: readonly (readonly [string, string, string])[];
  reviewsTitle: string;
  reviews: readonly { image: string; topic: string; quote: string }[];
  faqs: readonly { q: string; a: string }[];
  closeTitle: string;
  closeText: string;
  closeImage: string;
  cityLegend: string;
  cityBubble: string;
  reciboLegend: string;
  reciboBubble: string;
  interests: readonly string[];
  motives: readonly string[];
};

const ICONS = [
  "solar:chat-round-dots-linear",
  "solar:document-text-linear",
  "solar:map-point-linear",
  "solar:settings-linear",
  "solar:bolt-linear",
] as const;

function steps(items: readonly (readonly [string, string])[]): SectorQuote["process"] {
  return items.map(([title, text], index) => [title, text, ICONS[index]] as const);
}

export const comercialQuote: SectorQuote = {
  h1: "Energía a la medida para tu negocio",
  sub: "Diseñamos e instalamos la solución energética que tu negocio necesita: paneles solares para reducir tu costo de energía y sistemas de respaldo para que tus equipos esenciales sigan operando cuando se va la luz.",
  linea: "comercial",
  heroImage: "/images/comercial-hero-hq.webp",
  heroAlt: "Espacio comercial con iluminación natural",
  mosaicA: "/images/2025-07-estacion-comercial-1.jpg",
  mosaicAAlt: "Instalación comercial de Lukx",
  mosaicB: "/images/baterias.jpg",
  mosaicBAlt: "Sistema de almacenamiento de energía en baterías (BESS)",
  solutionsTitle: "Soluciones para tu negocio",
  solutionsIntro: "Paneles solares, respaldo, iluminación y estaciones de carga. Lo definimos según cómo opera tu negocio.",
  solutions: [
    ["Paneles solares", "Genera tu propia energía y reduce lo que pagas a CFE. Dimensionamos el sistema según tu consumo, tu tarifa [validar PDBT o GDMTO] y el espacio disponible en tu azotea o estacionamiento."],
    ["Sistemas de respaldo", "Con baterías, los equipos esenciales de tu negocio, como punto de venta, refrigeración, internet e iluminación, siguen funcionando cuando se va la luz."],
    ["Iluminación", "Diseñamos e instalamos la luz de tu local según el uso de cada área: atención, trabajo, circulación y fachada."],
    ["Estaciones de carga", "Instalamos cargadores para clientes o para la flotilla de tu negocio, según cuántos vehículos necesitas atender."],
  ],
  solutionImage: "/images/comercial-paneles.webp",
  solutionAlt: "Imagen ilustrativa de paneles solares sobre la azotea de un edificio comercial",
  backupTitle: "Que tu negocio siga operando cuando se va la luz",
  backupText: "Piensa en lo que no puede detenerse en tu negocio. Con esa lista puedes saber qué necesitas respaldar y por cuánto tiempo.",
  backupImage: "/images/comercial-respaldo-v2.webp",
  backupAlt: "Imagen ilustrativa de un comercio con iluminación, refrigeración y punto de venta en operación al anochecer",
  process: steps([
    ["Asesoría", "Analizamos tu consumo y tu horario de operación y lo que necesitas respaldar."],
    ["Propuesta", "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión."],
    ["Visita técnica", "Revisamos tu inmueble para confirmar el diseño y la instalación."],
    ["Instalación y supervisión", "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo."],
    ["Trámite con CFE", "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma."],
  ]),
  reviewsTitle: "Experiencias en negocios",
  reviews: [
    { image: "/images/comercial-hero.webp", topic: "Paneles solares", quote: "Con mi recibo pude entender cuántos paneles necesitaba mi negocio y qué esperar del sistema." },
    { image: "/images/residencial-respaldo-detalle.webp", topic: "Sistemas de respaldo", quote: "En la asesoría vimos qué equipos debían seguir encendidos cuando se va la luz." },
    { image: "/images/residencial-tecnico-lukx.webp", topic: "Instalación", quote: "Me explicaron cómo se haría la instalación y cómo revisar la producción desde mi teléfono." },
  ],
  faqs: [
    { q: "¿Los paneles solares funcionan si se va la luz?", a: "Para mantener equipos encendidos cuando se va la luz, revisamos si tu negocio necesita un sistema con respaldo y qué equipos quieres cubrir." },
    { q: "¿Cuántos paneles solares necesita mi negocio?", a: "Depende de tu consumo, que viene en tu recibo de CFE, y del espacio disponible. En la asesoría lo revisamos contigo y te proponemos el tamaño del sistema." },
    { q: "¿Cuánto cuestan los paneles solares para un negocio?", a: "El precio cambia según el tamaño del sistema, si lleva baterías y cómo se instala. Lo calculamos con tu recibo y con lo que necesitas mantener encendido." },
    { q: "¿Cómo funcionan los paneles solares para un negocio?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu local u oficina." },
    { q: "¿Puedo tener paneles sin baterías?", a: "Sí. Puedes instalar paneles interconectados a CFE sin incluir baterías en el proyecto." },
    { q: "¿Qué significa la tarifa PDBT de CFE?", a: "Es una de las tarifas de CFE para servicio general en baja tensión [validar alcance: demanda de hasta 25 kW]. Tu recibo indica qué tarifa tienes y con ella dimensionamos tu sistema." },
    { q: "¿Cómo funcionan los paneles solares con CFE?", a: "Un medidor bidireccional registra la energía que tomas de la red y la que le envías. Gestionamos tu trámite de interconexión." },
    { q: "¿Cómo es el esquema de pago?", a: "El pago se divide en tres partes: 50% como anticipo, 40% al concluir la instalación y 10% al terminar el trámite con CFE e instalar tu medidor bidireccional. También puedes preguntar por nuestras opciones de financiamiento en tu asesoría." },
    { q: "¿Qué garantía tiene el sistema?", a: "El sistema de tu negocio cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
  ],
  closeTitle: "Diseñemos la energía de tu negocio",
  closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu negocio.",
  closeImage: "/images/comercial-cierre-v2.webp",
  cityLegend: "¿En qué ciudad está tu negocio?",
  cityBubble: "Con tu ciudad confirmamos que podemos atender tu negocio.",
  reciboLegend: "¿Cuánto pagas de luz al mes, aproximadamente?",
  reciboBubble: "[validar] rangos por definir. Mientras tanto se usan los 4 rangos del formulario de casa.",
  interests: ["Paneles solares", "Sistema de respaldo", "Ambos"],
  motives: ["Reducir mi costo de energía", "Que mi operación siga cuando se va la luz", "Ambos"],
};

export const industrialQuote: SectorQuote = {
  h1: "Energía a la medida para tu industria",
  sub: "Diseñamos e instalamos la solución energética que tu operación industrial necesita: generación solar para reducir tu costo de energía y respaldo para los procesos que no pueden detenerse cuando se va la luz.",
  linea: "industrial",
  heroImage: "/images/industrial-hero-hq.webp",
  heroAlt: "Imagen ilustrativa de una nave con maquinaria y áreas de producción",
  mosaicA: "/images/industrial-hero.webp",
  mosaicAAlt: "Personal en una nave de mantenimiento industrial",
  mosaicB: "/images/baterias.jpg",
  mosaicBAlt: "Sistema de almacenamiento de energía en baterías (BESS)",
  solutionsTitle: "Soluciones para tu operación",
  solutionsIntro: "Paneles solares, respaldo, iluminación y estaciones de carga. Lo definimos según cómo opera tu planta.",
  solutions: [
    ["Generación solar", "Genera energía para tu nave o planta y reduce lo que pagas a CFE. Analizamos tu consumo, tu demanda y tu tarifa [validar GDMTH] antes de dimensionar el sistema."],
    ["Respaldo para procesos críticos", "Con baterías, los equipos que no pueden detenerse, como control, comunicaciones o refrigeración, siguen funcionando cuando se va la luz [validar alcance y capacidad con ingeniería]."],
    ["Iluminación", "Diseñamos la luz de naves y bodegas según la altura, el trabajo y el recorrido del espacio."],
    ["Estaciones de carga", "Instalamos cargadores para los vehículos de la operación o de quien visita la planta."],
  ],
  solutionImage: "/images/industrial-paneles.webp",
  solutionAlt: "Imagen ilustrativa de paneles solares sobre la cubierta de una nave industrial",
  backupTitle: "Que tus procesos sigan operando cuando se va la luz",
  backupText: "Identifica qué equipos y procesos no pueden detenerse en tu planta. Con esa lista puedes saber qué necesitas respaldar y por cuánto tiempo.",
  backupImage: "/images/industrial-respaldo.webp",
  backupAlt: "Imagen ilustrativa de una línea de empaque industrial en operación al anochecer",
  process: steps([
    ["Asesoría", "Analizamos tu consumo, tu demanda y lo que necesitas respaldar."],
    ["Propuesta", "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión."],
    ["Visita técnica", "Revisamos tu planta o nave para confirmar el diseño y la instalación."],
    ["Instalación y supervisión", "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo."],
    ["Trámite con CFE", "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma."],
  ]),
  reviewsTitle: "Experiencias en la industria",
  reviews: [
    { image: "/images/industrial-hero.webp", topic: "Generación solar", quote: "Con nuestro recibo y nuestra demanda entendimos qué esperar del sistema." },
    { image: "/images/residencial-respaldo-detalle.webp", topic: "Respaldo", quote: "En la asesoría definimos qué procesos debían tener respaldo cuando se va la luz." },
    { image: "/images/residencial-tecnico-lukx.webp", topic: "Instalación", quote: "Nos explicaron cómo se coordinaría la instalación y cómo revisar la producción." },
  ],
  faqs: [
    { q: "¿Cómo funcionan los paneles solares industriales?", a: "Los paneles convierten la luz del sol en electricidad y los inversores la adaptan a la instalación de tu planta. Un medidor bidireccional registra lo que tomas de la red y lo que le envías." },
    { q: "¿Cuánto cuestan los paneles solares industriales?", a: "Depende de la escala del proyecto, de tu consumo y demanda, y de si incluye baterías. Lo calculamos con tus recibos de CFE." },
    { q: "¿Qué es la tarifa GDMTH de CFE?", a: "Es una tarifa de CFE para servicio general en media tensión con demanda horaria [validar redacción con ingeniería]. Tu recibo indica qué tarifa tienes y con ella diseñamos el sistema." },
    { q: "¿Los paneles solares industriales funcionan si se va la luz?", a: "Para mantener procesos encendidos cuando se va la luz, revisamos si necesitas un sistema con respaldo y qué equipos quieres cubrir." },
    { q: "¿Se pueden instalar baterías de respaldo en una planta?", a: "Sí, según los equipos y el tiempo de respaldo que necesites. Lo definimos contigo en la asesoría [validar con ingeniería]." },
    { q: "¿Qué mantenimiento necesita un sistema solar industrial?", a: "El mantenimiento y la vida útil dependen de los equipos y de las condiciones de instalación. Puedes revisar los detalles de tu sistema en la asesoría." },
    { q: "¿Cuánto tiempo toma un proyecto industrial?", a: "Depende del tamaño del proyecto. El tiempo de instalación se define en tu propuesta; después gestionamos el trámite de interconexión con CFE." },
    { q: "¿Cómo es el esquema de pago?", a: "El pago se divide en tres partes: 50% como anticipo, 40% al concluir la instalación y 10% al terminar el trámite con CFE e instalar tu medidor bidireccional. También puedes preguntar por nuestras opciones de financiamiento en tu asesoría." },
    { q: "¿Qué garantía tiene el sistema?", a: "El sistema de tu industria cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
  ],
  closeTitle: "Diseñemos la energía de tu operación",
  closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu operación.",
  closeImage: "/images/industrial-cierre.webp",
  cityLegend: "¿En qué ciudad está tu planta o nave?",
  cityBubble: "Con tu ciudad confirmamos que podemos atender tu planta.",
  reciboLegend: "¿Cuánto pagas de luz al mes, aproximadamente?",
  reciboBubble: "[validar] rangos por definir. Mientras tanto se usan los 4 rangos del formulario de casa.",
  interests: ["Generación solar", "Respaldo para procesos críticos", "Ambos"],
  motives: ["Reducir mi costo de energía", "Continuidad de procesos cuando se va la luz", "Ambos"],
};

export const asesoriaQuote: SectorQuote = {
  h1: "Energía a la medida para lo que necesitas",
  sub: "Diseñamos e instalamos paneles solares y sistemas de respaldo para casas, negocios e industrias. Cuéntanos qué necesitas y te recomendamos la solución energética adecuada.",
  linea: "asesoria",
  heroImage: "/images/residencial-hero-fachada.webp",
  heroAlt: "Imagen ilustrativa de una casa de dos pisos con fachada, cochera y paneles solares en la azotea",
  mosaicA: "/images/residencial-tecnico-lukx.webp",
  mosaicAAlt: "Imagen recreada a partir de una foto de un técnico junto a inversores solares",
  mosaicB: "/images/residencial-respaldo-detalle.webp",
  mosaicBAlt: "Imagen recreada a partir de una instalación de respaldo de Lukx",
  solutionsTitle: "Soluciones para cada espacio",
  solutionsIntro: "Reduce tu consumo de CFE, protege tus equipos esenciales cuando se va la luz o integra ambas soluciones en un solo sistema, según tu casa, negocio o industria.",
  solutions: [
    ["Para tu casa", "Paneles solares, sistemas de respaldo o ambos, dimensionados según tu consumo y lo que necesitas mantener encendido."],
    ["Para tu negocio", "Soluciones para locales, oficinas, restaurantes y otros negocios, pensadas para reducir tu costo de energía y cuidar tu operación."],
    ["Para tu industria", "Proyectos a escala para naves y plantas, con análisis de demanda, tarifa y respaldo para procesos críticos."],
  ],
  solutionImage: "/images/2025-07-proyecto-rinconada-patos.jpg",
  solutionAlt: "Paneles solares instalados sobre la azotea de una casa",
  backupTitle: "Que tu energía siga cuando se va la luz",
  backupText: "Identifica qué equipos o procesos no pueden detenerse. Con esa lista puedes saber qué necesitas respaldar y por cuánto tiempo.",
  backupImage: "/images/residencial-respaldo-nocturno.webp",
  backupAlt: "Escena ilustrativa de una casa iluminada cuando se va la luz",
  process: steps([
    ["Asesoría", "Analizamos tu consumo y lo que necesitas respaldar."],
    ["Propuesta", "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión."],
    ["Visita técnica", "Revisamos tu inmueble para confirmar el diseño y la instalación."],
    ["Instalación y supervisión", "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo."],
    ["Trámite con CFE", "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma."],
  ]),
  reviewsTitle: "Experiencias con Lukx",
  reviews: [
    { image: "/images/residencial-casa-paneles.webp", topic: "Paneles solares", quote: "Con mi recibo pude entender qué sistema necesitaba y qué esperar." },
    { image: "/images/residencial-respaldo-detalle.webp", topic: "Sistemas de respaldo", quote: "En la asesoría definimos qué equipos debían tener respaldo cuando se va la luz." },
    { image: "/images/residencial-tecnico-lukx.webp", topic: "Instalación", quote: "Nos explicaron cómo sería la instalación y cómo revisar la producción." },
  ],
  faqs: [
    { q: "¿Cómo funciona la energía solar?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu casa, negocio o planta." },
    { q: "¿Cómo funciona la energía solar en México?", a: "En México puedes interconectar tu sistema a CFE con un medidor bidireccional. Nosotros gestionamos el trámite de interconexión." },
    { q: "¿Cuáles son las ventajas de la energía solar?", a: "Generas parte de tu propia energía, reduces lo que pagas a CFE y, con baterías, mantienes equipos esenciales cuando se va la luz. El resultado depende de tu consumo y tu tarifa." },
    { q: "¿Cuáles son las desventajas de la energía solar?", a: "Requiere una inversión inicial, espacio para los paneles y una buena exposición al sol. Sin baterías, un sistema interconectado no da energía cuando se va la luz." },
    { q: "¿Cuánto cuestan los paneles solares?", a: "Depende del tamaño del sistema, de si lleva baterías y del tipo de proyecto. Lo calculamos con tu recibo de luz." },
    { q: "¿Los paneles solares funcionan si se va la luz?", a: "Para mantener equipos encendidos cuando se va la luz, revisamos si necesitas un sistema con respaldo y qué equipos quieres cubrir." },
    { q: "¿Cómo sé si necesito paneles, baterías o ambos?", a: "Depende de lo que busques: pagar menos de luz, mantener equipos encendidos cuando se va, o las dos cosas. En la asesoría lo definimos con tu recibo y tus equipos esenciales." },
    { q: "¿Cómo es el esquema de pago?", a: "El pago se divide en tres partes: 50% como anticipo, 40% al concluir la instalación y 10% al terminar el trámite con CFE e instalar tu medidor bidireccional. También puedes preguntar por nuestras opciones de financiamiento en tu asesoría." },
    { q: "¿Qué garantía tiene el sistema?", a: "Tu sistema cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
  ],
  closeTitle: "Diseñemos la energía que necesitas",
  closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu proyecto.",
  closeImage: "/images/residencial-paneles-detalle-concreto.webp",
  cityLegend: "¿En qué ciudad está tu proyecto?",
  cityBubble: "Con tu ciudad confirmamos que podemos atender tu proyecto.",
  reciboLegend: "¿Cuánto pagas de luz, aproximadamente?",
  reciboBubble: "[validar] rangos por definir. Mientras tanto se usan los 4 rangos del formulario de casa.",
  interests: ["Paneles solares", "Sistema de respaldo", "Ambos", "Aún no lo sé"],
  motives: ["Reducir mi costo de energía", "Mantener equipos encendidos cuando se va la luz", "Ambos"],
};
