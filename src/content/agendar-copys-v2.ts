/* eslint-disable @typescript-eslint/no-unused-vars */
type Tipo = "organica" | "ads";
type Version = "general" | "residencial" | "comercial" | "industrial";
type Kind = "hero" | "form" | "faq" | "pasos" | "lista";
type Bloque = { t: string; k: Kind; lineas?: string[] };
type Faq = { q: string; a: string };
type Campo = { campo: string; opciones: string; obligatorio: string; origen: string };
type Paso = { indicador?: string; titulo: string; micro: string; campos: Campo[]; boton: string };

type Pag = {
  tipo: Tipo;
  version: Version;
  url: string;
  intencion: string;
  title: string;
  meta: string;
  h1: string;
  variantes?: string[];
  sub: string;
  bloques: Bloque[];
  faq: Faq[];
  pasos: Paso[];
  confPasos: { title: string; detail: string }[];
  ctaP: string;
  ctaS: string;
};

const COMUN = "Común a las 8 páginas";
const PAUTA = "Campañas de anuncios";
const c = (campo: string, opciones: string, obligatorio: string): Campo => ({ campo, opciones, obligatorio, origen: COMUN });
const q = (campo: string, opciones: string, obligatorio: string): Campo => ({ campo, opciones, obligatorio, origen: PAUTA });

const contacto: Campo[] = [
  c("Nombre", "¿Cómo te llamas?", "Sí"),
  c("WhatsApp", "Tu número de WhatsApp a 10 dígitos (con validación). Canal principal de contacto.", "Sí"),
  c("Correo electrónico", "nombre@correo.com", "Sí"),
  c("Ciudad o municipio", "Monterrey y área metropolitana · Saltillo · Ramos Arizpe · Otra", "Sí"),
];
const aviso: Campo = c("Aviso de privacidad", "Casilla: Acepto el aviso de privacidad", "Sí");
const comentario = (ph: string): Campo => c("Comentarios", ph, "No");

const plazo = "En los próximos 0–3 meses · De 3 a 6 meses · Solo estoy cotizando";
const califRes: Campo[] = [
  q("¿Ya tienes paneles solares?", "Sí · No (si responde que sí, el lead se enfoca en batería de respaldo)", "Sí"),
  q("¿Qué te interesa?", "Paneles solares · Batería de respaldo · Ambos", "Sí"),
  q("¿Cuánto pagas de luz al bimestre, aproximadamente?", "Entre 0 y 3,000 pesos · Entre 3,001 y 6,000 pesos · Entre 6,001 y 10,000 pesos · Más de 10,000 pesos", "Sí"),
  q("¿Qué te motiva más?", "Pagar menos de luz · Los apagones o tener respaldo · Ambos", "Sí"),
  q("¿Eres dueño de la casa?", "Sí · No", "Sí"),
];
const califCom: Campo[] = [
  q("Tipo de negocio", "Escribe el tipo de negocio", "Sí"),
  q("¿Qué te interesa?", "Proyecto de iluminación (diseño e instalación) · Paneles solares · Respaldo con baterías · Estaciones de carga", "Sí"),
  q("¿Cuánto pagas de luz al mes, aproximadamente?", "Entre 0 y 3,000 pesos · Entre 3,001 y 6,000 pesos · Entre 6,001 y 10,000 pesos · Más de 10,000 pesos", "Sí"),
  q("¿Cuándo planeas hacerlo?", plazo, "Sí"),
  q("Empresa", "Nombre de tu empresa o negocio", "No"),
  q("Puesto", "¿Cuál es tu puesto?", "No"),
];
const califInd: Campo[] = [
  q("Empresa", "Nombre de tu empresa", "Sí"),
  q("Puesto", "¿Cuál es tu puesto?", "No"),
  q("Tipo de proyecto", "Iluminación de nave o bodega · Paneles solares · Respaldo de energía · Carga para vehículos eléctricos", "Sí"),
  q("Tamaño aproximado de la nave o del consumo", "Escribe el tamaño aproximado en m²", "Sí"),
  q("¿Cuándo planeas hacerlo?", plazo, "Sí"),
  q("¿Eres quien decide la compra?", "Sí · No · Influyo en la decisión", "Sí"),
];

const comoFunciona = [
  { title: "Dejas tus datos y eliges horario", detail: "Llenas el formulario y eliges el día y la hora en el calendario." },
  { title: "Revisamos tu consumo o tu espacio", detail: "En la llamada o videollamada vemos tu recibo de CFE, fotos o planos y lo que quieres resolver." },
  { title: "Recibes tu propuesta y cotización", detail: "Con lo que revisamos, te decimos qué solución conviene y preparamos tu propuesta." },
];

const cobertura: Faq = {
  q: "¿Atienden en mi ciudad?",
  a: "Atendemos Monterrey y su área metropolitana, Saltillo y Ramos Arizpe. Si estás en otra ciudad, elige “Otra” en el formulario y revisamos si podemos atenderte.",
};
const comoEs: Faq = {
  q: "¿Cómo es la asesoría?",
  a: "Es una llamada o videollamada con nuestro equipo. Nos cuentas qué quieres resolver, revisamos tu información y te decimos qué conviene.",
};

const proyectos = (espacio: string): string[] => [
  "Título: Proyectos que hemos hecho" + espacio,
  "Conoce nuestros proyectos de instalación.",
  "Enlace: Ver todos los proyectos → /portfolio",
];

const bloquesEspacio = (que: string[], soluciones: string[], hub: string, cuantos: string): Bloque[] => [
  { t: "H1 y una línea de qué revisamos", k: "hero" },
  { t: "Formulario en 1 paso (espacio preseleccionado y selector de solución)", k: "form" },
  { t: "Qué revisamos en la asesoría", k: "lista", lineas: que },
  { t: "Soluciones del espacio", k: "lista", lineas: soluciones },
  { t: "Proyectos del espacio", k: "lista", lineas: proyectos(" (" + cuantos + ")") },
  { t: "FAQ breves visibles", k: "faq" },
  { t: "Enlace al hub", k: "lista", lineas: [hub] },
];

const bloquesAds = (beneficios: string[]): Bloque[] => [
  { t: "Header mínimo", k: "lista", lineas: ["Logo de Lukx, sin menú (enlace al inicio opcional) + teléfono como texto, sin botón."] },
  { t: "H1 igual al mensaje del anuncio + subtítulo", k: "hero" },
  { t: "Formulario en 2 pasos, arriba del pliegue", k: "form" },
  { t: "3 beneficios", k: "lista", lineas: beneficios },
  { t: "Prueba social real", k: "lista", lineas: proyectos(" (2–3)") },
  { t: "Cómo funciona en 3 pasos", k: "pasos" },
  { t: "FAQ visibles", k: "faq" },
  { t: "CTA repetido", k: "lista", lineas: ["Texto: ¿Listo para empezar? Agenda tu asesoría.", "Botón: Agendar asesoría (lleva al paso 1 del formulario)."] },
  { t: "Footer", k: "lista", lineas: ["Aviso de privacidad · © Lukx"] },
];

const paso1Ads = (titulo: string, siguiente: string): Paso => ({
  indicador: "Paso 1 de 2 · Tus datos",
  titulo,
  micro: "Primero tus datos de contacto. En el siguiente paso te hacemos unas preguntas sobre " + siguiente + ".",
  campos: [...contacto, aviso],
  boton: "Continuar (botón de avance; el único CTA es «Agendar asesoría»)",
});
const paso2Ads = (indicador: string, titulo: string, campos: Campo[], ph: string): Paso => ({
  indicador,
  titulo,
  micro: "Con esto preparamos tu asesoría. Al terminar, eliges el día y la hora en el calendario.",
  campos: [...campos, comentario(ph)],
  boton: "Agendar asesoría",
});

const confAds = (prepara: { title: string; detail: string }): { title: string; detail: string }[] => [
  { title: "Elige el día y la hora en el calendario", detail: "Tu llamada o videollamada es con Fernanda, de nuestro equipo." },
  prepara,
];

const paginas: Pag[] = [
  {
    tipo: "organica", version: "general", url: "/agendar",
    intencion: "Quien llega desde el botón “Agendar asesoría” del header o desde las páginas de solución y todavía no sabe qué necesita. Única página indexada del grupo.",
    title: "Agenda tu asesoría y cotiza tu proyecto | Lukx",
    meta: "Agendar asesoría con Lukx: revisamos tu casa, negocio o industria y te cotizamos paneles solares, iluminación, respaldo o carga en Monterrey.",
    h1: "Agenda tu asesoría y cotiza tu proyecto",
    sub: "Platica con nuestro equipo por llamada o videollamada. Revisamos tu caso y te decimos qué conviene para tu casa, tu negocio o tu industria.",
    bloques: [
      { t: "H1 + subtítulo con qué pasa en la asesoría", k: "hero" },
      { t: "Formulario en 1 paso, arriba del pliegue", k: "form" },
      { t: "Selector «¿Para qué espacio?»", k: "lista", lineas: [
        "Título: ¿Para qué espacio es tu proyecto?",
        "Mi casa → /agendar/residencial",
        "Mi negocio → /agendar/comercial",
        "Mi industria, nave o bodega → /agendar/industrial",
        "Microcopy: Elige tu espacio y te mostramos lo que revisamos en tu caso. También puedes llenar el formulario de arriba.",
      ] },
      { t: "Cómo funciona en 3 pasos", k: "pasos" },
      { t: "Qué tener a la mano", k: "lista", lineas: [
        "Tu recibo de CFE, si tu tema es energía (no tiene que ser el más reciente).",
        "Fotos o planos del espacio, si tu tema es iluminación.",
        "Qué te gustaría mantener encendido si hay apagones, si te interesa un respaldo.",
        "Si no tienes nada a la mano, igual podemos empezar.",
      ] },
      { t: "Soluciones (4 enlaces)", k: "lista", lineas: [
        "Título: Lo que diseñamos e instalamos",
        "Paneles solares · Sistemas de respaldo en baterías · Proyectos de iluminación · Estaciones de carga",
      ] },
      { t: "Proyectos (2–3 de /portfolio)", k: "lista", lineas: proyectos("") },
      { t: "FAQ visibles", k: "faq" },
      { t: "Contacto alterno", k: "lista", lineas: ["¿Prefieres otro medio? Escríbenos desde Contacto → /contacto"] },
    ],
    faq: [
      comoEs,
      { q: "¿Tiene costo?", a: "No. La asesoría es sin costo y no te compromete a comprar." },
      { q: "¿Qué información necesito?", a: "Si tu tema es energía, tu recibo de CFE. Si es iluminación, fotos o planos del espacio. Si no tienes nada a la mano, igual podemos empezar." },
      { q: "¿Qué recibo después de la asesoría?", a: "Te decimos qué solución conviene y por qué. Si quieres avanzar, preparamos tu propuesta y cotización." },
      { q: "¿Atienden fuera de Monterrey?", a: cobertura.a },
    ],
    pasos: [{
      titulo: "Cuéntanos de tu proyecto",
      micro: "Si todavía no sabes qué solución necesitas, elige “Todavía no lo sé”: para eso es la asesoría. Al enviar, eliges el día y la hora en el calendario.",
      campos: [
        ...contacto,
        q("¿Dónde sería el proyecto?", "Casa · Negocio u oficina · Industria, nave o bodega · Otro", "Sí"),
        q("¿Qué te interesa?", "Paneles solares · Respaldo con baterías · Proyecto de iluminación · Estación de carga · Todavía no lo sé (si llega con ?solucion=…, se preselecciona; canonical sin parámetros)", "Sí"),
        comentario("Ej.: quiero bajar mi recibo, hay apagones seguido, necesito iluminar un local nuevo…"),
        aviso,
      ],
      boton: "Agendar asesoría",
    }],
    confPasos: [
      { title: "Elige el día y la hora en el calendario", detail: "Tu llamada o videollamada es con Fernanda, de nuestro equipo." },
      { title: "Ten a la mano lo que tengas", detail: "Tu recibo de CFE si tu tema es energía; fotos o planos si es iluminación." },
      { title: "En la asesoría te decimos qué conviene", detail: "Si quieres avanzar, preparamos tu propuesta y cotización." },
    ],
    ctaP: "Agendar asesoría",
    ctaS: "Prefiero escribir por WhatsApp",
  },
  {
    tipo: "organica", version: "residencial", url: "/agendar/residencial",
    intencion: "Dueños de casa que llegan del menú, de /residencial o de sus 4 páginas de solución (con ?solucion=…).",
    title: "Agenda tu asesoría para tu casa | Lukx",
    meta: "Agendar asesoría para tu casa en Monterrey: revisamos tu recibo de luz y te proponemos paneles solares, iluminación, baterías o carga eléctrica.",
    h1: "Asesoría de energía para tu casa",
    sub: "En una llamada o videollamada sin costo revisamos tu recibo de luz, fotos de tu techo y tus horarios de consumo, y te decimos qué sistema conviene.",
    bloques: bloquesEspacio(
      [
        "Tu recibo de CFE y tu consumo, para ver si un sistema de paneles solares te conviene.",
        "Qué quieres mantener encendido en los apagones, para definir un respaldo con baterías.",
        "Fotos de tu techo y de tu instalación eléctrica, para saber qué se puede instalar.",
      ],
      [
        "Título: Soluciones para tu casa",
        "Paneles solares → /residencial/paneles-solares",
        "Respaldo en baterías → /residencial/respaldo-en-baterias",
        "Iluminación → /residencial/iluminacion",
        "Estaciones de carga → /residencial/estaciones-de-carga",
      ],
      "Conoce todo lo que hacemos para casas → /residencial",
      "1–2 de casas",
    ),
    faq: [
      { q: "¿Qué necesito para la asesoría?", a: "Tu recibo de CFE y, si puedes, unas fotos de tu techo. Si no los tienes a la mano, lo vemos en la llamada." },
      { q: "¿Paneles solares, respaldo o los dos?", a: "Depende de tu consumo y de lo que quieras mantener encendido en un apagón. Lo revisamos contigo y te decimos qué conviene." },
      cobertura,
    ],
    pasos: [{
      titulo: "Agenda la asesoría para tu casa",
      micro: "Si tienes tu recibo de CFE a la mano, mejor. Si no, lo vemos en la llamada. Al enviar, eliges el día y la hora en el calendario.",
      campos: [
        ...contacto,
        q("¿Qué te interesa?", "Paneles solares · Respaldo con baterías · Ambos · Proyecto de iluminación · Estación de carga (espacio preseleccionado en “Casa”; ?solucion=… preselecciona la opción)", "Sí"),
        q("¿Ya tienes paneles solares?", "Sí · No", "Sí"),
        comentario("Ej.: el recibo sube cada bimestre, hay apagones seguido en mi colonia, quiero cargar mi auto en casa…"),
        aviso,
      ],
      boton: "Agendar asesoría",
    }],
    confPasos: [
      { title: "Elige el día y la hora en el calendario", detail: "Tu llamada o videollamada es con Fernanda, de nuestro equipo." },
      { title: "Busca tu recibo de CFE y toma unas fotos de tu techo", detail: "Y piensa qué es indispensable en un apagón: refrigerador, internet, bombas de agua o iluminación." },
      { title: "En la llamada te decimos qué conviene", detail: "Si quieres avanzar, preparamos tu propuesta y cotización." },
    ],
    ctaP: "Agendar asesoría",
    ctaS: "Conoce las soluciones para tu casa (/residencial)",
  },
  {
    tipo: "organica", version: "comercial", url: "/agendar/comercial",
    intencion: "Dueños o encargados de tiendas, restaurantes, hoteles u oficinas que llegan del menú, de /comercial o de sus 4 páginas de solución.",
    title: "Agenda tu asesoría para tu negocio | Lukx",
    meta: "Agendar asesoría para tu negocio en Monterrey: analizamos tu consumo y te proponemos paneles solares, iluminación, respaldo o estaciones de carga.",
    h1: "Asesoría de energía para tu negocio",
    sub: "En una llamada o videollamada sin costo revisamos tu consumo, tu tarifa y tu horario de operación, y te decimos qué proyecto conviene.",
    bloques: bloquesEspacio(
      [
        "Tu consumo y tu tarifa de CFE, para evaluar un sistema de paneles solares.",
        "Tu horario de operación y lo que no puede apagarse, para definir un respaldo.",
        "Cómo usas tu espacio, si el tema es iluminación: qué quieres destacar y en qué áreas.",
      ],
      [
        "Título: Soluciones para tu negocio",
        "Paneles solares → /comercial/paneles-solares",
        "Iluminación → /comercial/iluminacion",
        "Respaldo en baterías → /comercial/respaldo-en-baterias",
        "Estaciones de carga → /comercial/estaciones-de-carga",
      ],
      "Conoce todo lo que hacemos para negocios → /comercial",
      "1–2 de comercio u oficina",
    ),
    faq: [
      { q: "¿Qué información conviene tener?", a: "Tus recibos de CFE (si tienes varias sucursales, los de cada una) y fotos del espacio si el tema es iluminación." },
      { q: "¿Pueden combinar soluciones?", a: "Sí. En la asesoría vemos si conviene una sola solución o combinar varias, por ejemplo paneles solares con respaldo." },
      cobertura,
    ],
    pasos: [{
      titulo: "Cuéntanos de tu negocio",
      micro: "Si tienes varias sucursales o vas a remodelar o abrir, cuéntanos en el comentario. Al enviar, eliges el día y la hora en el calendario.",
      campos: [
        ...contacto,
        q("¿Qué te interesa?", "Proyecto de iluminación (diseño e instalación) · Paneles solares · Respaldo con baterías · Estaciones de carga (espacio preseleccionado en “Negocio u oficina”)", "Sí"),
        q("Tipo de negocio", "Escribe el tipo de negocio", "Sí"),
        comentario("Ej.: restaurante con consumo alto en verano, tienda que vamos a remodelar, oficina con apagones…"),
        aviso,
      ],
      boton: "Agendar asesoría",
    }],
    confPasos: [
      { title: "Elige el día y la hora en el calendario", detail: "Tu llamada o videollamada es con Fernanda, de nuestro equipo." },
      { title: "Reúne tus recibos de CFE", detail: "Los que tengas; si son de varias sucursales, mejor. Si es iluminación, toma fotos en horario de operación." },
      { title: "Invita a quien decide", detail: "Si alguien más participa en la decisión, puede unirse a la llamada." },
    ],
    ctaP: "Agendar asesoría",
    ctaS: "Conoce las soluciones para tu negocio (/comercial)",
  },
  {
    tipo: "organica", version: "industrial", url: "/agendar/industrial",
    intencion: "Responsables de planta, mantenimiento, operaciones o compras que llegan del menú, de /industrial o de sus 4 páginas de solución.",
    title: "Agenda tu asesoría para tu industria | Lukx",
    meta: "Agendar asesoría para tu nave, bodega o planta en Monterrey: proyectos de paneles solares, iluminación industrial, respaldo y carga eléctrica.",
    h1: "Asesoría de energía para tu industria",
    sub: "En una llamada o videollamada sin costo revisamos tu demanda, tus turnos y la iluminación de tus naves y bodegas, y te decimos qué proyecto conviene.",
    bloques: bloquesEspacio(
      [
        "Tu demanda y tus recibos de CFE, para evaluar paneles solares en tu nave o planta.",
        "Tus turnos y tus cargas críticas, para dimensionar el respaldo de energía.",
        "Alturas, racks, pasillos y zonas de trabajo, con tus planos o layout, para diseñar la iluminación de naves y bodegas.",
      ],
      [
        "Título: Soluciones para tu industria",
        "Paneles solares → /industrial/paneles-solares",
        "Iluminación para naves y bodegas → /industrial/iluminacion",
        "Respaldo en baterías → /industrial/respaldo-en-baterias",
        "Estaciones de carga → /industrial/estaciones-de-carga",
      ],
      "Conoce todo lo que hacemos para la industria → /industrial",
      "1–2 de naves, bodegas o plantas",
    ),
    faq: [
      { q: "¿Qué información conviene tener?", a: "Recibos de CFE, planos o layout de la nave y una lista de equipos críticos. Si no tienes todo, empezamos con lo que haya." },
      { q: "¿Quién debería estar en la llamada?", a: "Quien conozca la operación: mantenimiento, operaciones o compras. Pueden unirse varias personas." },
      cobertura,
    ],
    pasos: [{
      titulo: "Cuéntanos de tu operación",
      micro: "Si tienes planos, recibos o el layout de la nave, menciónalo en el comentario y te decimos cómo compartirlos. Al enviar, eliges el día y la hora en el calendario.",
      campos: [
        ...contacto,
        q("Empresa", "Nombre de tu empresa", "Sí"),
        q("Tipo de proyecto", "Iluminación de nave o bodega · Paneles solares · Respaldo de energía · Carga para vehículos eléctricos", "Sí"),
        comentario("Ej.: nave con zonas oscuras entre racks, paros por apagones, queremos cargadores para la flotilla…"),
        aviso,
      ],
      boton: "Agendar asesoría",
    }],
    confPasos: [
      { title: "Elige el día y la hora en el calendario", detail: "Tu llamada o videollamada es con Fernanda, de nuestro equipo." },
      { title: "Reúne la información que tengas e invita a tu equipo", detail: "Recibos de CFE, planos o layout y lista de equipos críticos. Mantenimiento, operaciones o compras pueden unirse a la llamada." },
      { title: "En la asesoría definimos el siguiente paso", detail: "Si quieres avanzar, preparamos tu propuesta y cotización." },
    ],
    ctaP: "Agendar asesoría",
    ctaS: "Conoce las soluciones para la industria (/industrial)",
  },
  {
    tipo: "ads", version: "general", url: "/lp/asesoria",
    intencion: "Anuncios amplios de energía en Monterrey (tema: paneles solares Monterrey, cotizar paneles solares, instalación).",
    title: "Cotiza tu proyecto de energía en Monterrey | Lukx",
    meta: "Paneles solares, iluminación, respaldo en baterías y carga eléctrica en Monterrey. Agendar asesoría para recibir tu propuesta.",
    h1: "Cotiza tu proyecto de energía en Monterrey",
    variantes: [
      "Cotiza tu proyecto de energía en Monterrey",
      "Paneles solares, respaldo, iluminación y carga en Monterrey",
      "¿Qué necesitas resolver? Platícalo con Lukx",
    ],
    sub: "Una llamada o videollamada sin costo con nuestro equipo para decirte qué solución conviene a tu casa, negocio o industria.",
    bloques: bloquesAds([
      "Revisamos tu caso con tu recibo de CFE o fotos del espacio.",
      "Te decimos qué conviene y por qué.",
      "Recibes tu propuesta y cotización, sin compromiso de compra.",
    ]),
    faq: [
      comoEs,
      { q: "¿Qué necesito tener a la mano?", a: "Tu recibo de CFE si tu tema es energía, o fotos del espacio si es iluminación. Si no los tienes, igual podemos empezar." },
      { q: "¿Agendar me compromete a comprar?", a: "No. Agendar tu asesoría no te compromete a nada." },
      cobertura,
    ],
    pasos: [
      paso1Ads("Déjanos tus datos", "tu proyecto"),
      paso2Ads("Paso 2 de 2 · Tu proyecto", "¿Para qué espacio es tu proyecto?", [
        q("¿Para qué espacio es tu proyecto?", "Casa · Negocio · Industria, nave o bodega. Al elegir, se muestran las preguntas de calificación de esa landing (Residencial, Comercial o Industrial).", "Sí"),
      ], "Cuéntanos qué te gustaría resolver (opcional)"),
    ],
    confPasos: confAds({ title: "Ten a la mano tu recibo de CFE o fotos del espacio", detail: "Nos ayudan a aprovechar mejor la llamada." }),
    ctaP: "Agendar asesoría",
    ctaS: "Sin CTA secundario ni botón de WhatsApp (un solo CTA por landing)",
  },
  {
    tipo: "ads", version: "residencial", url: "/lp/residencial",
    intencion: "Anuncios de paneles solares para casa (tema: precio paneles solares para casa, paneles solares para casa). La landing más importante.",
    title: "Paneles solares para tu casa en Monterrey | Lukx",
    meta: "Paneles solares para tu casa en Monterrey: agenda tu asesoría, revisamos tu recibo de luz y te decimos cuántos paneles necesitas.",
    h1: "Energía a la medida para tu casa",
    variantes: [
      "Paneles solares para tu casa en Monterrey",
      "¿Tu recibo de luz sigue subiendo? Agenda tu asesoría",
      "Que tu casa siga funcionando cuando se va la luz",
    ],
    sub: "Diseñamos e instalamos la solución energética que tu hogar necesita: paneles solares para generar tu propia energía y sistemas de respaldo para que tus equipos esenciales sigan funcionando cuando se va la luz.",
    bloques: bloquesAds([
      "Un sistema dimensionado con tu consumo real, no un paquete estándar.",
      "Paneles solares, respaldo con baterías o los dos: te decimos qué conviene.",
      "Diseño e instalación con el mismo equipo.",
    ]),
    faq: [
      { q: "¿Los paneles solares funcionan si se va la luz?", a: "Para mantener equipos encendidos cuando se va la luz, revisamos si necesitas un sistema con respaldo y qué equipos quieres cubrir." },
      { q: "¿Cuántos paneles solares necesito para mi casa?", a: "Depende de tu consumo, que viene en tu recibo de CFE, y del espacio en tu techo. En la asesoría lo revisamos contigo y te proponemos el tamaño del sistema." },
      { q: "¿Cuánto cuestan los paneles solares para casa?", a: "El precio cambia según el tamaño del sistema, si lleva baterías y cómo se instala. Lo calculamos con tu recibo y con lo que necesitas mantener encendido." },
      { q: "¿Cómo funcionan los paneles solares?", a: "Los paneles convierten la luz del sol en electricidad. Un inversor la transforma para que la uses en tu casa." },
      { q: "¿Puedo tener paneles sin baterías?", a: "Sí. Puedes instalar paneles interconectados a CFE sin incluir baterías en el proyecto." },
      { q: "¿Cuántas baterías necesito para mi casa?", a: "Depende de qué quieres mantener encendido y por cuánto tiempo. Lo revisamos contigo en la asesoría." },
      { q: "¿Qué es un inversor híbrido y para qué sirve?", a: "Es un equipo que puede gestionar la energía de los paneles, las baterías y la red en un sistema compatible." },
      { q: "¿Cómo funcionan los paneles solares con CFE?", a: "Un medidor bidireccional registra la energía que tomas de la red y la que le envías." },
      { q: "¿Qué mantenimiento necesitan y cuánto duran?", a: "El mantenimiento y la vida útil dependen de los equipos y de las condiciones de instalación. Puedes revisar los detalles de tu sistema en la asesoría." },
    ],
    pasos: [
      paso1Ads("Agenda la asesoría para tu casa", "tu casa"),
      paso2Ads("Paso 2 de 2 · Tu casa", "Cuéntanos de tu casa", califRes, "Ej.: se va la luz seguido en mi colonia, el recibo sube cada bimestre…"),
    ],
    confPasos: confAds({ title: "Busca tu recibo de CFE", detail: "El que tengas a la mano; no tiene que ser el más reciente. Y piensa qué quieres mantener encendido si se va la luz." }),
    ctaP: "Agendar asesoría",
    ctaS: "Sin CTA secundario ni botón de WhatsApp (un solo CTA por landing)",
  },
  {
    tipo: "ads", version: "comercial", url: "/lp/comercial",
    intencion: "Anuncios de energía para negocio (tema: paneles solares para negocio, iluminación comercial, paneles para empresas).",
    title: "Energía para tu negocio en Monterrey | Lukx",
    meta: "Paneles solares, iluminación y respaldo en baterías para negocios en Monterrey. Agendar asesoría para recibir una propuesta a tu medida.",
    h1: "Energía e iluminación para tu negocio en Monterrey",
    variantes: [
      "Energía e iluminación para tu negocio en Monterrey",
      "Paneles solares e iluminación para tu negocio",
      "Revisa con un asesor el gasto de energía de tu negocio",
    ],
    sub: "Platica sin costo con nuestro equipo por llamada o videollamada y descubre qué proyecto le conviene a tu negocio.",
    bloques: bloquesAds([
      "Revisamos tu operación y tu consumo.",
      "Solar, iluminación, respaldo o carga: lo que tu negocio sí necesita.",
      "Planeamos la instalación pensando en tu operación.",
    ]),
    faq: [
      comoEs,
      { q: "¿Qué información necesito?", a: "Tus recibos de CFE y, si el tema es iluminación, fotos del espacio en horario de operación." },
      { q: "¿Pueden combinar soluciones?", a: "Sí. Vemos si conviene una sola solución o varias, por ejemplo paneles solares con respaldo." },
      cobertura,
    ],
    pasos: [
      paso1Ads("Cuéntanos de tu negocio", "tu negocio"),
      paso2Ads("Paso 2 de 2 · Tu negocio", "Cuéntanos de tu negocio", califCom, "Ej.: tenemos varias sucursales, vamos a remodelar, hay apagones en la zona…"),
    ],
    confPasos: confAds({ title: "Reúne tus recibos de CFE", detail: "Los que tengas a la mano. Si es iluminación, toma fotos del espacio en horario de operación." }),
    ctaP: "Agendar asesoría",
    ctaS: "Sin CTA secundario ni botón de WhatsApp (un solo CTA por landing)",
  },
  {
    tipo: "ads", version: "industrial", url: "/lp/industrial",
    intencion: "Anuncios de iluminación industrial y paneles solares industriales (naves, bodegas, auditoría energética).",
    title: "Paneles solares e iluminación industrial | Lukx",
    meta: "Proyectos de paneles solares e iluminación para naves industriales y bodegas en Monterrey. Agendar asesoría con un especialista.",
    h1: "Proyectos de energía para naves y bodegas en Monterrey",
    variantes: [
      "Proyectos de energía para naves y bodegas en Monterrey",
      "Iluminación para naves y bodegas: diseño e instalación",
      "Paneles solares para tu planta o nave industrial",
    ],
    sub: "Agenda una llamada o videollamada sin costo y revisamos tu demanda, tus turnos y tus cargas críticas.",
    bloques: bloquesAds([
      "Revisamos tu layout, tus planos y tus cargas.",
      "Diseño de iluminación con cálculos y simulaciones antes de instalar.",
      "Diseño, instalación y puesta en marcha con un solo equipo.",
    ]),
    faq: [
      { q: "¿Qué revisan en la asesoría?", a: "Tu consumo, tus turnos, tus cargas críticas y, si el tema es iluminación, el layout de tus naves y bodegas." },
      { q: "¿Qué información necesito?", a: "Recibos de CFE y, si los tienes, planos o layout. Si no tienes todo, empezamos con lo que haya." },
      { q: "¿Quién debería estar en la llamada?", a: "Quien conozca la operación: mantenimiento, operaciones o compras." },
      cobertura,
    ],
    pasos: [
      paso1Ads("Cuéntanos de tu operación", "tu nave o planta"),
      paso2Ads("Paso 2 de 2 · Tu operación", "Cuéntanos de tu operación", califInd, "Ej.: zonas oscuras entre racks, paros por apagones, cargadores para la flotilla…"),
    ],
    confPasos: confAds({ title: "Ten a la mano tus recibos y, si los tienes, planos o layout", detail: "Mantenimiento u operaciones pueden unirse a la llamada." }),
    ctaP: "Agendar asesoría",
    ctaS: "Sin CTA secundario ni botón de WhatsApp (un solo CTA por landing)",
  },
];

const etiquetas: Record<Version, string> = { general: "General", residencial: "Residencial", comercial: "Comercial", industrial: "Industrial" };

const robots = (x: Pag): string =>
  x.url === "/agendar" ? "index, follow" : x.tipo === "organica" ? "noindex, follow" : "noindex, follow (meta robots + cabecera X-Robots-Tag)";
const tecnico = (x: Pag): string =>
  x.url === "/agendar"
    ? "En el sitemap. Canonical a /agendar, también en las variantes ?solucion=…"
    : x.tipo === "organica"
    ? "Fuera del sitemap. Canonical a sí misma (sin parámetros). No bloquear en robots.txt."
    : "Fuera del sitemap. Canonical a sí misma, sin gclid ni utm. No bloquear en robots.txt. Sin enlaces desde el menú ni el sitio.";


export { paginas, califRes, califCom, califInd, contacto, aviso, comoFunciona };
export type { Pag, Paso, Campo, Faq, Version, Tipo };
