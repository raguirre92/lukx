import {
  RANGOS_LUZ_COMERCIAL,
  RANGOS_LUZ_GENERAL,
  RANGOS_LUZ_INDUSTRIAL,
  RANGOS_LUZ_RESIDENCIAL,
} from "@/lib/agendar-config";

export type LandingStep = {
  id: string;
  legend: string;
  bubble: string;
  options?: readonly string[];
  /** Maps the answer onto an existing Odoo field. Other answers stay in pendingFields. */
  commit?: "city" | "recibo" | "interes" | "flush";
  respuesta: string;
};

export type SpaceLanding = {
  pageTitle: string;
  meta: string;
  h1: string;
  sub: string;
  bullets: readonly string[];
  heroImage: string;
  heroAlt: string;
  cta: string;
  quienes?: string;
  solutionsTitle: string;
  solutionsIntro: string;
  solutions: readonly { title: string; text: string }[];
  solutionImage: string;
  solutionAlt: string;
  extra?: string;
  statsNote?: string;
  backupTitle: string;
  backupText: string;
  backupImage: string;
  backupAlt: string;
  backupCta: string;
  backupHref: string;
  financingTitle: string;
  financingText: string;
  why?: readonly { title: string; text: string }[];
  processTitle: string;
  process: readonly { title: string; text: string; icon: string }[];
  projectsTitle: string;
  projectsText: string;
  teamNote?: string;
  reviewsTitle: string;
  reviews: readonly { topic: string; quote: string; image: string }[];
  faqs: readonly { q: string; a: string }[];
  closeTitle: string;
  closeText: string;
  closeImage: string;
  validar: readonly string[];
  steps: readonly LandingStep[];
  spaceLinks?: readonly { href: string; label: string; text: string; space?: string }[];
  footnote?: string;
};

export const residencialLanding: SpaceLanding = {
  pageTitle: "Paneles solares para tu casa en Monterrey | Lukx",
  meta: "Diseñamos una solución con paneles solares, baterías de respaldo o ambos, según tu consumo y lo que necesitas mantener encendido si se va la luz.",
  h1: "Energía a la medida para tu casa",
  sub: "Diseñamos una solución con paneles solares, baterías de respaldo o ambos, según tu consumo, cómo usas la energía y qué necesitas mantener encendido si se va la luz.",
  bullets: [],
  heroImage: "/images/residencial-casa-paneles.webp",
  heroAlt: "Imagen ilustrativa de una casa con paneles solares visibles en el techo",
  cta: "Agenda tu asesoría",
  quienes: "Somos Lukx, de Monterrey. Diseñamos e instalamos proyectos de energía e iluminación para casas, negocios e industrias. [Propuesta, pendiente de Rafa]",
  solutionsTitle: "Elige lo que necesita tu casa [Propuesta, pendiente de Rafa]",
  solutionsIntro: "Te proponemos la combinación que mejor va con tu consumo y con lo que quieres proteger.",
  solutions: [
    { title: "Paneles solares", text: "Paneles e inversor interconectados a CFE, del tamaño que pide tu consumo. Nos encargamos del trámite con CFE." },
    { title: "Baterías de respaldo", text: "Mantén encendido lo indispensable cuando se va la luz. [pendiente cotización de Rafa]" },
    { title: "Paneles + baterías", text: "Genera, guarda y usa tu energía cuando la necesites. [pendiente cotización de Rafa]" },
  ],
  solutionImage: "/images/residencial-casa-paneles.webp",
  solutionAlt: "Imagen ilustrativa de una casa con paneles solares visibles en el techo",
  extra: "Extras para tu casa [validar]: Suma una estación de carga para tu auto o la iluminación de tu casa al mismo proyecto. Solo texto, sin catálogo, modelos ni fichas.",
  statsNote: "años de experiencia [validar]",
  footnote: "*Según tu consumo, tu tarifa y el tamaño del sistema.",
  backupTitle: "Que tu casa siga encendida cuando se va la luz",
  backupText: "Con baterías de respaldo, lo indispensable de tu casa sigue funcionando aunque se vaya la luz en tu colonia.",
  backupImage: "/images/residencial-respaldo-nocturno.webp",
  backupAlt: "Escena ilustrativa de una casa iluminada cuando se va la luz",
  backupCta: "Agendar asesoría",
  backupHref: "#agenda",
  financingTitle: "Págalo a tu ritmo",
  financingText: "Tenemos opciones de financiamiento para que empieces tu proyecto sin pagarlo todo de una vez. Pregunta por ellas en tu asesoría.",
  why: [
    { title: "Tu casa, un solo proyecto", text: "Paneles, baterías, cargador para tu auto e iluminación, diseñados juntos. [validar]" },
    { title: "Respaldo para lo indispensable", text: "Partimos de lo que no puede apagarse en tu casa. [validar]" },
    { title: "Crece cuando lo necesites", text: "Empieza con lo que más te urge y suma lo demás después. [validar]" },
    { title: "Paneles solos se apagan", text: "Por seguridad, un sistema conectado a la red se apaga cuando se va la luz. Para seguir con energía, necesitas baterías. [validar redacción con ingeniería]" },
    { title: "Tú eliges qué se queda encendido", text: "Refri, internet, luces o lo que necesites: definimos contigo qué cubre tu respaldo. [validar]" },
    { title: "Con o sin paneles", text: "Tus baterías pueden funcionar solas, cargándose de la red, o junto con paneles solares. [validar]" },
    { title: "¿Ya tienes paneles?", text: "Revisamos si tu sistema actual puede sumar baterías de respaldo. [validar]" },
    { title: "Paga menos de luz", text: "Reduce tu recibo de luz hasta [95%]*. [cifra por confirmar con Rafa]" },
    { title: "Menos impacto de tarifas CFE", text: "Entre más energía generas, menos te pegan los cambios de tarifa." },
    { title: "Tu casa vale más", text: "Un sistema solar es una mejora que suma valor a tu casa. [validar]" },
    { title: "Energía limpia", text: "En tu propuesta ves cuánto CO₂ dejas de emitir y a cuántos árboles equivale." },
  ],
  processTitle: "De tu asesoría a la instalación [Propuesta, pendiente de Rafa]",
  process: [
    { title: "Asesoría", icon: "solar:chat-round-dots-linear", text: "Por llamada o videollamada analizamos tu consumo y lo que necesitas respaldar. Eliges el día y la hora en el calendario." },
    { title: "Propuesta", icon: "solar:document-text-linear", text: "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada, tu pago antes y después, y el retorno de inversión." },
    { title: "Visita técnica", icon: "solar:map-point-linear", text: "Revisamos tu domicilio para confirmar el diseño y la instalación. [validar]" },
    { title: "Instalación y supervisión", icon: "solar:settings-linear", text: "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo. El tiempo depende del tamaño del proyecto y se define en tu propuesta. Tu sistema cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
    { title: "Trámite con CFE", icon: "solar:bolt-linear", text: "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma." },
  ],
  projectsTitle: "Quién diseña tu proyecto",
  projectsText: "Te atiende un equipo de Monterrey que diseña e instala proyectos de energía.",
  teamNote: "[validar] Foto real · Nombre · Puesto del equipo de Lukx, con autorización. Por ahora no se nombra a ningún cliente.",
  reviewsTitle: "Experiencias en casa",
  reviews: [
    { topic: "Paneles solares", quote: "Con mi recibo pude entender cuántos paneles necesitaba y qué esperar del sistema.", image: "/images/residencial-casa-paneles.webp" },
    { topic: "Sistemas de respaldo", quote: "En la asesoría vimos qué equipos quería mantener encendidos cuando se va la luz.", image: "/images/residencial-respaldo-detalle.webp" },
    { topic: "Instalación", quote: "Me explicaron por dónde pasaría el cableado y cómo revisar la producción desde mi teléfono.", image: "/images/residencial-tecnico-lukx.webp" },
  ],
  faqs: [
    { q: "¿Los paneles solares funcionan si se va la luz?", a: "Si tu sistema solo tiene paneles conectados a la red, no: por seguridad se apaga cuando se va la luz. Para seguir con energía necesitas baterías de respaldo; con ellas, lo que elijas sigue encendido. [validar redacción con ingeniería]" },
    { q: "¿Cuántos paneles solares necesito para mi casa?", a: "Depende de tu consumo, que viene en tu recibo de CFE, y del espacio en tu techo. En la asesoría lo revisamos contigo y te proponemos el tamaño del sistema." },
    { q: "¿Cuánto cuestan los paneles solares para casa?", a: "El precio cambia según el tamaño del sistema, si lleva baterías y cómo se instala. Por eso lo calculamos con tu recibo y con lo que necesitas mantener encendido. [pendiente cotización de Rafa: ¿se muestra un rango?]" },
    { q: "¿Cómo funcionan los paneles solares?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu casa, y la que no usas puede ir a la red o a tus baterías." },
    { q: "¿Puedo tener paneles sin baterías?", a: "Sí. Un sistema sin baterías te ayuda a pagar menos de luz, pero no te da energía cuando se va la luz. Si quieres respaldo, puedes sumar baterías desde el inicio o después. [validar que el sistema sea ampliable]" },
    { q: "¿Cuántas baterías necesito para mi casa?", a: "Depende de qué quieres mantener encendido y por cuánto tiempo. Lo definimos contigo en la asesoría, a partir de tus equipos indispensables." },
    { q: "¿Qué es un inversor híbrido y para qué sirve?", a: "Es el equipo que administra la energía de tus paneles, tus baterías y la red. Decide de dónde tomar la energía y permite que tus baterías te respalden si se va la luz. [validar que Lukx instale inversores híbridos]" },
    { q: "¿Cómo funcionan los paneles solares con CFE?", a: "Con un sistema interconectado, tu casa usa primero la energía de tus paneles y un medidor bidireccional registra lo que tomas de la red y lo que le envías. Nosotros hacemos el trámite de interconexión, que toma de 1 a 3 meses desde la firma." },
    { q: "¿Qué mantenimiento necesitan y cuánto duran?", a: "Necesitan poco mantenimiento: sobre todo limpieza de los paneles y revisión del sistema. Tu sistema cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica. [validar mantenimiento que ofrece Lukx]" },
    { q: "¿Cómo es el esquema de pago?", a: "Pagas 50% de anticipo, 40% después de la instalación y 10% cuando terminamos el trámite con CFE y se instala tu medidor bidireccional. También tenemos opciones de financiamiento; pregunta por ellas en tu asesoría." },
  ],
  closeTitle: "Diseñemos la energía de tu casa",
  closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu hogar.",
  closeImage: "/images/residencial-paneles-detalle-concreto.webp",
  validar: [
    "Rangos de gasto bimestral del formulario",
    "+15 años de experiencia",
    "Cifra de ahorro [95%]",
    "Tu casa vale más",
    "Extras para tu casa",
    "Visita técnica",
    "Paneles solos se apagan",
    "Garantía y mantenimiento",
    "Inversor híbrido",
    "Sistema ampliable y baterías sin paneles",
    "Fotos del equipo y de casas",
    "Reseñas ficticias",
  ],
  steps: [
    { id: "ciudad", legend: "¿En qué ciudad está tu casa?", bubble: "Con tu ciudad confirmamos que podemos atender tu casa.", commit: "city", respuesta: "Ciudad o municipio" },
    { id: "paneles", legend: "¿Ya tienes paneles solares?", bubble: "Si ya tienes paneles, la asesoría se enfoca en el respaldo.", options: ["Sí", "No"], respuesta: "¿Ya tienes paneles solares?" },
    { id: "interes", legend: "¿Qué te interesa?", bubble: "Así te asignamos al especialista correcto.", options: ["Paneles solares", "Batería de respaldo", "Ambos"], commit: "interes", respuesta: "¿Qué te interesa?" },
    { id: "recibo", legend: "¿Cuánto pagas de luz al bimestre, aproximadamente?", bubble: "[validar] rangos por definir. Mientras tanto se usan los 4 rangos del formulario de Meta.", options: RANGOS_LUZ_RESIDENCIAL, commit: "recibo", respuesta: "¿Cuánto pagas de luz al bimestre, aproximadamente?" },
    { id: "motivo", legend: "¿Qué te motiva más?", bubble: "Así vemos qué quieres resolver.", options: ["Pagar menos de luz", "Que mi casa siga encendida cuando se va la luz", "Ambos"], respuesta: "¿Qué te motiva más?" },
    { id: "dueno", legend: "¿Eres dueño de la casa?", bubble: "Nos dice cómo plantear el proyecto de la casa.", options: ["Sí", "No"], commit: "flush", respuesta: "¿Eres dueño de la casa?" },
    { id: "cita", legend: "Elige el día y la hora", bubble: "Elige el día y la hora. La asesoría es por llamada o videollamada.", respuesta: "" },
  ],
};

export const comercialLanding: SpaceLanding = {
  pageTitle: "Paneles solares y respaldo para tu negocio en Monterrey | Lukx",
  meta: "Diseñamos e instalamos paneles solares para reducir tu costo de energía y sistemas de respaldo para que tus equipos esenciales sigan operando cuando se va la luz.",
  h1: "Energía a la medida para tu negocio",
  sub: "Diseñamos e instalamos la solución energética que tu negocio necesita: paneles solares para reducir tu costo de energía y sistemas de respaldo para que tus equipos esenciales sigan operando cuando se va la luz.",
  bullets: [
    "Reduce lo que pagas a CFE en tu local, oficina o restaurante.",
    "Respaldo para los equipos que sostienen tu operación.",
    "Sistema dimensionado con tu recibo y tu horario de operación.",
  ],
  heroImage: "/images/comercial-hero.webp",
  heroAlt: "Proyecto comercial de Lukx",
  cta: "Agenda tu asesoría",
  solutionsTitle: "Soluciones para tu negocio",
  solutionsIntro: "Reduce tu consumo de CFE, protege los equipos esenciales de tu operación cuando se va la luz o integra ambas soluciones en un solo sistema.",
  solutions: [
    { title: "Paneles solares", text: "Genera tu propia energía y reduce lo que pagas a CFE. Dimensionamos el sistema según tu consumo, tu tarifa [validar PDBT o GDMTO] y el espacio disponible en tu azotea o estacionamiento." },
    { title: "Sistemas de respaldo", text: "Con baterías, los equipos esenciales de tu negocio, como punto de venta, refrigeración, internet e iluminación, siguen funcionando cuando se va la luz." },
    { title: "Sistema integral", text: "Combina paneles y baterías: generas energía con el sol y la almacenas para usarla cuando tu operación la necesite." },
  ],
  solutionImage: "/images/comercial-hero.webp",
  solutionAlt: "Proyecto comercial de Lukx",
  extra: "También diseñamos proyectos de iluminación para tu espacio. [validar] Solo texto, sin catálogo, modelos ni fichas.",
  backupTitle: "Que tu negocio siga operando cuando se va la luz",
  backupText: "Piensa en lo que no puede detenerse en tu negocio. Con esa lista sabes qué necesitas respaldar y por cuánto tiempo.",
  backupImage: "/images/residencial-respaldo-nocturno.webp",
  backupAlt: "Escena ilustrativa de un espacio iluminado cuando se va la luz",
  backupCta: "Más información",
  backupHref: "/sistemas-de-respaldo-de-energia-en-baterias",
  financingTitle: "Págalo a tu ritmo",
  financingText: "Pregunta por nuestras opciones de financiamiento en tu asesoría.",
  processTitle: "De tu asesoría a la instalación",
  process: [
    { title: "Asesoría", icon: "solar:chat-round-dots-linear", text: "Analizamos tu consumoy tu horario de operación y lo que necesitas respaldar." },
    { title: "Propuesta", icon: "solar:document-text-linear", text: "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión." },
    { title: "Visita técnica", icon: "solar:map-point-linear", text: "Revisamos tu inmueble para confirmar el diseño y la instalación." },
    { title: "Instalación y supervisión", icon: "solar:settings-linear", text: "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo. El tiempo depende del tamaño del proyecto y se define en tu propuesta. La instalación se coordina para afectar lo menos posible tu operación [validar con Rafa]. El sistema de tu negocio cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
    { title: "Trámite con CFE", icon: "solar:bolt-linear", text: "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma." },
  ],
  projectsTitle: "Proyectos que respaldan nuestro trabajo",
  projectsText: "+15 años de experiencia · +5,000 proyectos. Fotos reales de proyectos, sin nombre de cliente ni logos.",
  reviewsTitle: "Experiencias en negocios",
  reviews: [
    { topic: "Paneles solares", quote: "Con mi recibo pude entender cuántos paneles necesitaba mi negocio y qué esperar del sistema.", image: "/images/comercial-hero.webp" },
    { topic: "Sistemas de respaldo", quote: "En la asesoría vimos qué equipos debían seguir encendidos cuando se va la luz.", image: "/images/residencial-respaldo-detalle.webp" },
    { topic: "Instalación", quote: "Me explicaron cómo se haría la instalación y cómo revisar la producción desde mi teléfono.", image: "/images/residencial-tecnico-lukx.webp" },
  ],
  faqs: [
    { q: "¿Los paneles solares funcionan si se va la luz?", a: "Para mantener equipos encendidos cuando se va la luz, revisamos si tu negocio necesita un sistema con respaldo y qué equipos quieres cubrir." },
    { q: "¿Cómo funcionan los paneles solares para un negocio?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu local u oficina, y un medidor bidireccional registra lo que tomas de la red y lo que le envías." },
    { q: "¿Cuánto cuestan los paneles solares para un negocio?", a: "El precio cambia según el tamaño del sistema, si lleva baterías y cómo se instala. Lo calculamos con tu recibo y con lo que necesitas mantener encendido." },
    { q: "¿Los paneles solares son solo para casas o también para empresas?", a: "También para negocios: locales, oficinas, restaurantes y otros. El sistema se dimensiona con tu consumo y tu horario de operación." },
    { q: "¿Qué significa la tarifa PDBT de CFE?", a: "Es una de las tarifas de CFE para servicio general en baja tensión [validar alcance: demanda de hasta 25 kW]. Tu recibo indica qué tarifa tienes y con ella dimensionamos tu sistema." },
    { q: "¿Puedo tener paneles sin baterías?", a: "Sí. Puedes instalar paneles interconectados a CFE sin incluir baterías en el proyecto." },
    { q: "¿Cuántos paneles solares necesita mi negocio?", a: "Depende de tu consumo, que viene en tu recibo de CFE, y del espacio disponible. En la asesoría lo revisamos contigo y te proponemos el tamaño del sistema." },
    { q: "¿Cómo funcionan los paneles solares con CFE?", a: "Un medidor bidireccional registra la energía que tomas de la red y la que le envías. Gestionamos tu trámite de interconexión." },
    { q: "¿Es deducible la inversión en paneles solares para mi negocio?", a: "Depende de tu situación fiscal. Consulta a tu contador; en la asesoría te damos la información técnica de tu proyecto. [validar con contador antes de publicar; no prometer beneficios]" },
    { q: "¿Cómo es el esquema de pago?", a: "El pago se divide en tres partes: 50% como anticipo, 40% al concluir la instalación y 10% al terminar el trámite con CFE e instalar tu medidor bidireccional. También puedes preguntar por nuestras opciones de financiamiento en tu asesoría." },
    { q: "¿Qué garantía tiene el sistema?", a: "El sistema de tu negocio cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
  ],
  closeTitle: "Diseñemos la energía de tu negocio",
  closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu negocio.",
  closeImage: "/images/comercial-hero.webp",
  validar: [
    "Rangos de gasto mensual",
    "Tarifas PDBT y GDMTO",
    "Deducibilidad, sin prometer beneficios",
    "Iluminación opcional",
    "Instalación coordinada con la operación",
    "Reseñas ficticias",
    "Fotos sin nombre de cliente",
  ],
  steps: [
    { id: "ciudad", legend: "¿En qué ciudad está tu negocio?", bubble: "Con tu ciudad confirmamos que podemos atender tu negocio.", commit: "city", respuesta: "Ciudad o municipio" },
    { id: "negocio", legend: "¿Qué tipo de negocio tienes?", bubble: "Así vemos el tipo de operación.", options: ["Local comercial", "Oficina", "Restaurante o cafetería", "Consultorio o clínica", "Otro"], respuesta: "¿Qué tipo de negocio tienes?" },
    { id: "paneles", legend: "¿Ya tienes paneles solares?", bubble: "Si ya tienes paneles, la asesoría se enfoca en lo que falta.", options: ["Sí", "No"], respuesta: "¿Ya tienes paneles solares?" },
    { id: "interes", legend: "¿Qué te interesa?", bubble: "Así te asignamos al especialista correcto.", options: ["Paneles solares", "Sistema de respaldo", "Ambos"], commit: "interes", respuesta: "¿Qué te interesa?" },
    { id: "recibo", legend: "¿Cuánto pagas de luz al mes, aproximadamente?", bubble: "[validar] rangos de gasto mensual.", options: RANGOS_LUZ_COMERCIAL, commit: "recibo", respuesta: "¿Cuánto pagas de luz al mes, aproximadamente?" },
    { id: "motivo", legend: "¿Qué te motiva más?", bubble: "Así vemos qué quieres resolver.", options: ["Reducir mi costo de energía", "Que mi operación no se detenga cuando se va la luz", "Ambos"], respuesta: "¿Qué te motiva más?" },
    { id: "inmueble", legend: "¿El inmueble es propio o rentado?", bubble: "Nos dice cómo plantear el proyecto.", options: ["Propio", "Rentado"], commit: "flush", respuesta: "¿El inmueble es propio o rentado?" },
    { id: "cita", legend: "Elige el día y la hora", bubble: "Elige el día y la hora. La asesoría es por llamada o videollamada.", respuesta: "" },
  ],
};

export const industrialLanding: SpaceLanding = {
  pageTitle: "Energía solar y respaldo para naves y plantas industriales | Lukx",
  meta: "Diseñamos e instalamos generación solar para reducir tu costo de energía y respaldo para los procesos que no pueden detenerse cuando se va la luz.",
  h1: "Energía a la medida para tu industria",
  sub: "Diseñamos e instalamos la solución energética que tu operación industrial necesita: generación solar para reducir tu costo de energía y respaldo para los procesos que no pueden detenerse cuando se va la luz.",
  bullets: [
    "Proyectos a escala para naves, plantas y bodegas.",
    "Analizamos tu demanda y tu tarifa de CFE antes de diseñar.",
    "Respaldo para procesos y equipos críticos.",
  ],
  heroImage: "/images/industrial-hero.webp",
  heroAlt: "Nave industrial con proyecto de Lukx",
  cta: "Agenda tu asesoría",
  solutionsTitle: "Soluciones para tu operación",
  solutionsIntro: "Reduce tu costo de energía, protege los procesos críticos cuando se va la luz o integra ambas soluciones en un solo sistema.",
  solutions: [
    { title: "Generación solar", text: "Genera energía para tu nave o planta y reduce lo que pagas a CFE. Analizamos tu consumo, tu demanda y tu tarifa [validar GDMTH] antes de dimensionar el sistema." },
    { title: "Respaldo para procesos críticos", text: "Con baterías, los equipos que no pueden detenerse, como control, comunicaciones o refrigeración, siguen funcionando cuando se va la luz [validar alcance y capacidad con ingeniería]." },
    { title: "Sistema integral", text: "Combina generación solar y almacenamiento: produces energía con el sol y la guardas para usarla cuando tu operación la necesite." },
  ],
  solutionImage: "/images/industrial-hero.webp",
  solutionAlt: "Nave industrial con proyecto de Lukx",
  extra: "También diseñamos proyectos de iluminación para tu planta. [validar] Solo texto, sin catálogo, modelos ni fichas. El sistema de tu industria cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica.",
  backupTitle: "Que tus procesos sigan operando cuando se va la luz",
  backupText: "Identifica qué equipos y procesos no pueden detenerse en tu planta. Con esa lista definimos qué respaldar y por cuánto tiempo.",
  backupImage: "/images/industrial-hero.webp",
  backupAlt: "Interior industrial",
  backupCta: "Más información",
  backupHref: "/sistemas-de-respaldo-de-energia-en-baterias",
  financingTitle: "Págalo a tu ritmo",
  financingText: "Pregunta por nuestras opciones de financiamiento en tu asesoría.",
  processTitle: "De tu asesoría a la instalación",
  process: [
    { title: "Asesoría", icon: "solar:chat-round-dots-linear", text: "Analizamos tu consumo, tu demanda y lo que necesitas respaldar." },
    { title: "Propuesta", icon: "solar:document-text-linear", text: "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión." },
    { title: "Visita técnica", icon: "solar:map-point-linear", text: "Revisamos tu planta o nave para confirmar el diseño y la instalación." },
    { title: "Instalación y supervisión", icon: "solar:settings-linear", text: "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo. El tiempo depende del tamaño del proyecto y se define en tu propuesta. La instalación se coordina para reducir paros durante la obra [validar con Rafa]." },
    { title: "Trámite con CFE", icon: "solar:bolt-linear", text: "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma. El plazo de CFE en media tensión puede diferir de 1 a 3 meses [validar]." },
  ],
  projectsTitle: "Proyectos que respaldan nuestro trabajo",
  projectsText: "+15 años de experiencia · +5,000 proyectos. Fotos reales de proyectos, sin nombre de cliente ni logos.",
  reviewsTitle: "Experiencias en la industria",
  reviews: [
    { topic: "Generación solar", quote: "Con nuestro recibo y nuestra demanda entendimos qué esperar del sistema.", image: "/images/industrial-hero.webp" },
    { topic: "Respaldo", quote: "En la asesoría definimos qué procesos debían tener respaldo cuando se va la luz.", image: "/images/residencial-respaldo-detalle.webp" },
    { topic: "Instalación", quote: "Nos explicaron cómo se coordinaría la instalación y cómo revisar la producción.", image: "/images/residencial-tecnico-lukx.webp" },
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
  closeImage: "/images/industrial-hero.webp",
  validar: [
    "Rangos de gasto mensual y opciones de tarifa",
    "Redacción de GDMTH",
    "Alcance del respaldo",
    "Plazos de CFE en media tensión",
    "Iluminación opcional",
    "Paros durante la obra",
    "Reseñas ficticias",
  ],
  steps: [
    { id: "ciudad", legend: "¿En qué ciudad está tu instalación?", bubble: "Con tu ciudad confirmamos que podemos atender tu instalación.", commit: "city", respuesta: "Ciudad o municipio" },
    { id: "instalacion", legend: "¿Qué tipo de instalación tienes?", bubble: "Así vemos la escala de la operación.", options: ["Nave industrial", "Planta de manufactura", "Bodega o centro de distribución", "Otra"], respuesta: "¿Qué tipo de instalación tienes?" },
    { id: "paneles", legend: "¿Ya tienes paneles solares?", bubble: "Si ya tienes paneles, la asesoría se enfoca en lo que falta.", options: ["Sí", "No"], respuesta: "¿Ya tienes paneles solares?" },
    { id: "interes", legend: "¿Qué te interesa?", bubble: "Así te asignamos al especialista correcto.", options: ["Generación solar", "Respaldo para procesos críticos", "Ambos"], commit: "interes", respuesta: "¿Qué te interesa?" },
    { id: "recibo", legend: "¿Cuánto pagas de luz al mes, aproximadamente?", bubble: "[validar] rangos de gasto mensual.", options: RANGOS_LUZ_INDUSTRIAL, commit: "recibo", respuesta: "¿Cuánto pagas de luz al mes, aproximadamente?" },
    { id: "tarifa", legend: "¿Qué tarifa de CFE tienes?", bubble: "[validar] opciones de tarifa.", options: ["GDMTH", "GDMTO", "PDBT", "Otra", "No lo sé"], respuesta: "¿Qué tarifa de CFE tienes?" },
    { id: "rol", legend: "¿Cuál es tu rol?", bubble: "Para saber con quién hablamos.", options: ["Dirección o propietario", "Ingeniería o mantenimiento", "Compras", "Otro"], commit: "flush", respuesta: "¿Cuál es tu rol?" },
    { id: "cita", legend: "Elige el día y la hora", bubble: "Elige el día y la hora. La asesoría es por llamada o videollamada.", respuesta: "" },
  ],
};

export function generalLanding(family: "lp" | "agendar"): SpaceLanding {
  const casa = family === "agendar" ? "/agendar/residencial" : "/lp/residencial";
  const negocio = family === "agendar" ? "/agendar/comercial" : "/lp/comercial";
  const industria = family === "agendar" ? "/agendar/industrial" : "/lp/industrial";
  return {
    pageTitle: "Energía solar y respaldo para casas, negocios e industrias | Lukx",
    meta: "Diseñamos e instalamos paneles solares y sistemas de respaldo para casas, negocios e industrias.",
    h1: "Energía a la medida para lo que necesitas",
    sub: "Diseñamos e instalamos paneles solares y sistemas de respaldo para casas, negocios e industrias. Cuéntanos qué necesitas y te recomendamos la solución energética adecuada.",
    bullets: [
      "Para tu casa, tu negocio o tu industria.",
      "Paneles solares, respaldo o un sistema integral.",
      "Una asesoría sin costo para definir qué te conviene.",
    ],
    heroImage: "/images/residencial-casa-paneles.webp",
    heroAlt: "Proyecto de energía de Lukx",
    cta: "Agenda tu asesoría",
    solutionsTitle: "Soluciones para cada espacio",
    solutionsIntro: "Reduce tu consumo de CFE, protege tus equipos esenciales cuando se va la luz o integra ambas soluciones en un solo sistema, según tu casa, negocio o industria.",
    solutions: [
      { title: "Para tu casa", text: "Paneles solares, sistemas de respaldo o ambos, dimensionados según tu consumo y lo que necesitas mantener encendido." },
      { title: "Para tu negocio", text: "Soluciones para locales, oficinas, restaurantes y otros negocios, pensadas para reducir tu costo de energía y cuidar tu operación." },
      { title: "Para tu industria", text: "Proyectos a escala para naves y plantas, con análisis de demanda, tarifa y respaldo para procesos críticos." },
    ],
    solutionImage: "/images/residencial-tecnico-lukx.webp",
    solutionAlt: "Equipo de instalación de Lukx",
    extra: "Qué ofrecemos: paneles solares, sistemas de respaldo y sistema integral, descritos en cada landing. Tu sistema cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica.",
    backupTitle: "Que tu energía siga cuando se va la luz",
    backupText: "Identifica qué equipos o procesos no pueden detenerse. Con esa lista sabemos qué respaldar y por cuánto tiempo.",
    backupImage: "/images/residencial-respaldo-nocturno.webp",
    backupAlt: "Espacio iluminado cuando se va la luz",
    backupCta: "Más información",
    backupHref: "/sistemas-de-respaldo-de-energia-en-baterias",
    financingTitle: "Págalo a tu ritmo",
    financingText: "Pregunta por nuestras opciones de financiamiento en tu asesoría.",
    processTitle: "De tu asesoría a la instalación",
    process: [
      { title: "Asesoría", icon: "solar:chat-round-dots-linear", text: "Analizamos tu consumoy lo que necesitas respaldar y lo que necesitas respaldar." },
      { title: "Propuesta", icon: "solar:document-text-linear", text: "Con tu recibo de luz diseñamos el sistema y te presentamos la generación estimada y el retorno de inversión." },
      { title: "Visita técnica", icon: "solar:map-point-linear", text: "Revisamos tu inmueble para confirmar el diseño y la instalación." },
      { title: "Instalación y supervisión", icon: "solar:settings-linear", text: "Instalamos tu sistema, verificamos su calidad y configuramos el monitoreo. El tiempo depende del tamaño del proyecto y se define en tu propuesta." },
      { title: "Trámite con CFE", icon: "solar:bolt-linear", text: "Gestionamos todo el trámite hasta la instalación de tu medidor bidireccional. Normalmente toma de 1 a 3 meses desde la firma." },
    ],
    projectsTitle: "Proyectos que respaldan nuestro trabajo",
    projectsText: "+15 años de experiencia · +5,000 proyectos. Fotos reales de proyectos, sin nombre de cliente ni logos.",
    reviewsTitle: "Experiencias con Lukx",
    reviews: [
      { topic: "Paneles solares", quote: "Con mi recibo pude entender qué sistema necesitaba y qué esperar.", image: "/images/residencial-casa-paneles.webp" },
      { topic: "Sistemas de respaldo", quote: "En la asesoría definimos qué equipos debían tener respaldo cuando se va la luz.", image: "/images/residencial-respaldo-detalle.webp" },
      { topic: "Instalación", quote: "Nos explicaron cómo sería la instalación y cómo revisar la producción.", image: "/images/residencial-tecnico-lukx.webp" },
    ],
    faqs: [
      { q: "¿Cómo funciona la energía solar?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu casa, negocio o planta, y un medidor bidireccional registra lo que tomas de la red y lo que le envías." },
      { q: "¿Cómo funciona la energía solar en México?", a: "En México puedes interconectar tu sistema a CFE con un medidor bidireccional. Nosotros gestionamos el trámite de interconexión." },
      { q: "¿Cuáles son las ventajas de la energía solar?", a: "Generas parte de tu propia energía, reduces lo que pagas a CFE y, con baterías, mantienes equipos esenciales cuando se va la luz. El resultado depende de tu consumo y tu tarifa." },
      { q: "¿Cuáles son las desventajas de la energía solar?", a: "Requiere una inversión inicial, espacio para los paneles y una buena exposición al sol. Sin baterías, un sistema interconectado no da energía cuando se va la luz. Lo revisamos contigo en la asesoría." },
      { q: "¿Cuánto cuestan los paneles solares?", a: "Depende del tamaño del sistema, de si lleva baterías y del tipo de proyecto. Lo calculamos con tu recibo de luz." },
      { q: "¿Los paneles solares funcionan si se va la luz?", a: "Para mantener equipos encendidos cuando se va la luz, revisamos si necesitas un sistema con respaldo y qué equipos quieres cubrir." },
      { q: "¿Cómo sé si necesito paneles, baterías o ambos?", a: "Depende de lo que busques: pagar menos de luz, mantener equipos encendidos cuando se va, o las dos cosas. En la asesoría lo definimos con tu recibo y tus equipos esenciales." },
      { q: "¿Qué diferencia hay entre un proyecto para casa, negocio o industria?", a: "Cambian la escala, la tarifa de CFE, los equipos a respaldar y la instalación. Por eso diseñamos cada sistema según el tipo de espacio." },
      { q: "¿Qué mantenimiento necesitan y cuánto duran?", a: "El mantenimiento y la vida útil dependen de los equipos y de las condiciones de instalación. Puedes revisar los detalles de tu sistema en la asesoría." },
      { q: "¿Cómo es el esquema de pago?", a: "El pago se divide en tres partes: 50% como anticipo, 40% al concluir la instalación y 10% al terminar el trámite con CFE e instalar tu medidor bidireccional. También puedes preguntar por nuestras opciones de financiamiento en tu asesoría." },
      { q: "¿Qué garantía tiene el sistema?", a: "Tu sistema cuenta con garantía de 25 años de funcionamiento y 10 años contra defectos de fábrica." },
    ],
    closeTitle: "Diseñemos la energía que necesitas",
    closeText: "Agenda una asesoría sin costo con nuestro equipo. Analizamos tu consumo, resolvemos tus dudas y te recomendamos la solución adecuada para tu proyecto.",
    closeImage: "/images/residencial-paneles-cierre.webp",
    validar: [
      "Rangos de gasto que mezclan bimestre y mes",
      "Si las tarjetas enlazan o solo preseleccionan",
      "Reseñas ficticias",
    ],
    spaceLinks: [
      { href: casa, label: "Para tu casa", space: "Mi casa", text: "Paneles solares, sistemas de respaldo o ambos, dimensionados según tu consumo y lo que necesitas mantener encendido." },
      { href: negocio, label: "Para tu negocio", space: "Mi negocio", text: "Soluciones para locales, oficinas, restaurantes y otros negocios, pensadas para reducir tu costo de energía y cuidar tu operación." },
      { href: industria, label: "Para tu industria", space: "Mi industria o planta", text: "Proyectos a escala para naves y plantas, con análisis de demanda, tarifa y respaldo para procesos críticos." },
    ],
    steps: [
      { id: "ciudad", legend: "¿En qué ciudad está tu proyecto?", bubble: "Con tu ciudad confirmamos que podemos atenderte.", commit: "city", respuesta: "Ciudad o municipio" },
      { id: "espacio", legend: "¿Para qué tipo de espacio es?", bubble: "Con esto enrutamos la asesoría a casa, negocio o industria. También puedes abrir cada landing.", options: ["Mi casa", "Mi negocio", "Mi industria o planta", "No estoy seguro"], respuesta: "¿Para qué tipo de espacio es?" },
      { id: "paneles", legend: "¿Ya tienes paneles solares?", bubble: "Si ya tienes paneles, la asesoría se enfoca en lo que falta.", options: ["Sí", "No"], respuesta: "¿Ya tienes paneles solares?" },
      { id: "interes", legend: "¿Qué te interesa?", bubble: "Así te asignamos al especialista correcto.", options: ["Pagar menos de luz", "Respaldo cuando se va la luz", "Ambos", "Aún no lo sé"], commit: "interes", respuesta: "¿Qué te interesa?" },
      { id: "recibo", legend: "¿Cuánto pagas de luz, aproximadamente?", bubble: "[validar] rangos que mezclan bimestre y mes.", options: RANGOS_LUZ_GENERAL, commit: "recibo", respuesta: "¿Cuánto pagas de luz, aproximadamente?" },
      { id: "motivo", legend: "¿Qué te motiva más?", bubble: "Así vemos qué quieres resolver.", options: ["Reducir mi costo de energía", "Mantener equipos encendidos cuando se va la luz", "Ambos"], respuesta: "¿Qué te motiva más?" },
      { id: "rol", legend: "¿Eres propietario o administras el inmueble?", bubble: "Nos dice cómo plantear el proyecto.", options: ["Soy propietario", "Administro el inmueble", "Rento"], commit: "flush", respuesta: "¿Eres propietario o administras el inmueble?" },
      { id: "cita", legend: "Elige el día y la hora", bubble: "Elige el día y la hora. La asesoría es por llamada o videollamada.", respuesta: "" },
    ],
  };
}

export function landingForPath(pagePath: string): SpaceLanding {
  if (pagePath.endsWith("/comercial")) return comercialLanding;
  if (pagePath.endsWith("/industrial")) return industrialLanding;
  if (pagePath.endsWith("/asesoria")) return generalLanding(pagePath.startsWith("/agendar") ? "agendar" : "lp");
  return residencialLanding;
}
