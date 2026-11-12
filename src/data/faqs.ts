import type { FaqItem } from "@/components/FaqAccordion";

export const faqs: FaqItem[] = [
  {
    question: "¿Qué es exactamente un sistema BESS y por qué lo necesito?",
    answer:
      "Un BESS (Battery Energy Storage System) combina bancos de baterías e inversores bidireccionales. A diferencia de una planta de luz común, este sistema almacena electricidad de la red o de paneles solares para usarla cuando más la necesites, ya sea por un apagón o para ahorrar dinero en horas pico.",
  },
  {
    question: "¿Cómo me ayuda este sistema a reducir mi factura de luz?",
    answer:
      "Existen varias modalidades de configuración y los más comunes son:\n\n• Peak Shaving (Recorte de picos): Reduce los cargos por demanda máxima al usar la energía de las baterías justo cuando tu consumo es más alto.\n• Load Shifting (Desplazamiento de carga): Carga las baterías en horarios donde la tarifa de luz es barata y usa esa energía cuando la tarifa es cara.",
  },
  {
    question: "¿Es difícil la instalación en mi infraestructura actual?",
    answer:
      "Para nada. Lukx utiliza un diseño “amigable para instalación”, lo que significa que los equipos son compatibles con la mayoría de las infraestructuras eléctricas existentes.",
  },
  {
    question: "¿Puedo monitorear mi sistema de respaldo de energía?",
    answer:
      "Sí. A través de la plataforma en la nube, puedes realizar una supervisión remota en tiempo real.",
  },
  {
    question: "¿Qué me conviene más, un sistema de baterías o un generador?",
    answer:
      "Si buscas comodidad y ecología, lo recomendable es un sistema de baterías. Si buscas respaldo total de tu casa o negocio o energía en obra, lo ideal es un generador eléctrico.",
  },
  {
    question: "¿Qué tipo de mantenimiento requiere mi generador?",
    answer: "Requiere mantenimientos similares a los del motor de un vehículo.",
  },
  {
    question: "¿Qué capacidad (kW) necesito para mi negocio o casa?",
    answer:
      "Esto depende de tu “carga crítica”. No es lo mismo querer respaldar solo iluminación y computadoras que aires acondicionados o motores industriales. En Lukx realizamos un levantamiento técnico para calcular la capacidad exacta y evitar que compres un equipo sobrado o uno que se apague por sobrecarga.",
  },
  {
    question: "¿Hacen mucho ruido los generadores actuales?",
    answer:
      "No, nuestros equipos cuentan con cabinas acústicas para reducir significativamente los decibeles.",
  },
  {
    question: "¿El respaldo se activa automáticamente cuando se va la luz?",
    answer:
      "Sí, el sistema supervisa la red eléctrica en tiempo real y gestiona el flujo de energía (tablero de transferencia) de manera automática hacia tu hogar o negocio sin que tengas que intervenir.",
  },
  {
    question: "¿Cuánto cuesta un sistema de paneles solares?",
    answer:
      "Es variable, según el consumo en KWH que tengas en casa, negocio o industria. Te podemos ayudar en hacerte un estudio y cotización si nos brindas tus datos de CFE.",
  },
  {
    question: "¿Cuánto puedo ahorrar con paneles solares?",
    answer: "Puedes ahorrarte hasta un 99% en tu recibo de CFE.",
  },
  {
    question: "¿Cuánto dura un sistema de paneles solares?",
    answer:
      "Tenemos equipos que tienen garantía de hasta 25 años, pero el tiempo de vida útil de una celda fotovoltaica o inversor puede ser mucho mayor.",
  },
  {
    question: "¿Qué mantenimiento requieren?",
    answer:
      "Recomendamos que se le haga una limpieza periódica, por lo menos 2 veces al año y una revisión general de las condiciones eléctricas.",
  },
  {
    question: "¿Funciona si está nublado o llueve?",
    answer:
      "La respuesta es SI, sin embargo la generación de energía se ve disminuida en comparación de un día totalmente soleado.",
  },
  {
    question: "¿Qué pasa con la energía que no uso?",
    answer:
      "Al contratar tu servicio de paneles solares, se hacen trámites ante CFE para poder medir la energía que produces, esto se hace a través de un medidor Bidireccional. La energía que no uses durante un período de tiempo va a quedar registrada en este medidor como un saldo a favor para poder darle uso en el período que tú lo requieras.",
  },
  {
    question: "¿Cómo sé que soy apto para instalar paneles?",
    answer:
      "Nosotros nos encargamos de evaluar tu consumo actual de energía en base a tu recibo de CFE y de realizar un estudio físico y visual de las instalaciones para poder corroborar que se puede realizar el proyecto sin problemas.",
  },
  {
    question: "¿Puedo financiar la instalación?",
    answer:
      "Así es, tenemos diferentes planes de financiamiento. Contáctanos para encontrar la mejor opción para tus necesidades.",
  },
  {
    question: "¿Cuánto tiempo tarda la instalación?",
    answer:
      "Dependiendo del espacio y la cantidad de paneles solares a instalar. Nuestras instalaciones residenciales tardan de 1 a 3 días y las instalaciones industriales pueden llegar a tardar varias semanas.",
  },
  {
    question: "¿Qué necesito para empezar?",
    answer:
      "Contactarnos y brindarnos los datos de tu recibo de CFE (el que tengan a la mano). No necesita ser el más reciente.",
  },
  {
    question: "¿Cuánto tiempo tardan los trámites de CFE?",
    answer:
      "Los trámites pueden tardar varias semanas, dependiendo la zona en la que te encuentres.",
  },
];

export const solarFaqs = faqs.filter((f) =>
  [
    "¿Cuánto cuesta un sistema de paneles solares?",
    "¿Cuánto puedo ahorrar con paneles solares?",
    "¿Cuánto dura un sistema de paneles solares?",
    "¿Qué mantenimiento requieren?",
    "¿Funciona si está nublado o llueve?",
    "¿Qué pasa con la energía que no uso?",
    "¿Cómo sé que soy apto para instalar paneles?",
    "¿Puedo financiar la instalación?",
    "¿Cuánto tiempo tarda la instalación?",
    "¿Qué necesito para empezar?",
    "¿Cuánto tiempo tardan los trámites de CFE?",
  ].includes(f.question),
);
