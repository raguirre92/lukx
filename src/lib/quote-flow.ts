import { CIUDADES, RANGOS_LUZ_RESIDENCIAL, RANGOS_LUZ_COMERCIAL, RANGOS_LUZ_INDUSTRIAL, RANGOS_LUZ_GENERAL } from "@/lib/agendar-config";

export type QuoteSector = "residencial" | "comercial" | "industrial" | "asesoria";
export const EMPTY_QUOTE_ANSWERS = { interes: "", espacio: "", tiene_paneles: "", ciudad: "", ciudad_otra: "", recibo: "", objetivo_solar: "", equipos: "", area_iluminacion: "", proyecto_iluminacion: "", uso_carga: "", cantidad_carga: "", equipos_otro: "", area_iluminacion_otra: "", uso_carga_otro: "", proyecto_iluminacion_otro: "", objetivo_solar_otro: "" };
export type QuoteAnswers = typeof EMPTY_QUOTE_ANSWERS;
export type QuestionId = keyof QuoteAnswers;
export type QuotePhase = QuestionId | "comentarios" | "cita";
export type QuoteQuestion = { id: QuestionId; title: string; bubble: string; options?: readonly string[]; multiple?: boolean; inputType?: "text"; maxLength?: number; placeholder?: string; other?: { option: string; id: QuestionId; title: string; placeholder: string } };

export function quoteSector(sector: QuoteSector, answers: QuoteAnswers): QuoteSector {
  if (sector !== "asesoria") return sector;
  if (answers.espacio === "Mi casa") return "residencial";
  if (answers.espacio === "Mi negocio") return "comercial";
  if (answers.espacio === "Mi planta o nave") return "industrial";
  return "asesoria";
}

export function getQuoteQuestions(sector: QuoteSector, answers: QuoteAnswers): QuoteQuestion[] {
  const currentSector = quoteSector(sector, answers);
  const business = currentSector === "comercial" || currentSector === "industrial";
  const place = currentSector === "residencial" ? "tu casa" : currentSector === "comercial" ? "tu negocio" : currentSector === "industrial" ? "tu planta o nave" : "tu proyecto";
  const solar = answers.interes === "Paneles solares" || answers.interes === "Ambos";
  const backup = answers.interes === "Sistemas de respaldo" || answers.interes === "Ambos";
  const questions: QuoteQuestion[] = [{ id: "interes", title: "¿Qué te interesa?", bubble: "Empecemos por la solución que necesitas.", options: sector === "residencial" ? ["Paneles solares", "Sistemas de respaldo", "Ambos"] : ["Paneles solares", "Sistemas de respaldo", "Iluminación", "Estaciones de carga"] }];
  if (sector === "asesoria") questions.push({ id: "espacio", title: "¿Para qué tipo de espacio es?", bubble: "Así adaptamos las preguntas a tu proyecto.", options: ["Mi casa", "Mi negocio", "Mi planta o nave"] });
  if (sector === "residencial" || solar || backup) questions.push({ id: "tiene_paneles", title: "¿Ya tienes paneles solares?", bubble: "Conocer tu instalación actual nos ayuda a recomendarte la solución adecuada.", options: ["Sí", "No"] });
  questions.push({ id: "ciudad", title: `¿En qué ciudad está ${place}?`, bubble: `Con tu ciudad confirmamos que podemos atender ${place}.`, options: CIUDADES });
  if (answers.ciudad === "Otro") questions.push({ id: "ciudad_otra", title: "¿En qué ciudad o municipio está tu proyecto?", bubble: "Escribe la ciudad y el estado para confirmar dónde necesitas el servicio.", inputType: "text", maxLength: 120, placeholder: "Por ejemplo: Santiago, Nuevo León" });
  if (solar) {
    questions.push({ id: "recibo", title: currentSector === "residencial" ? "¿Cuánto pagas de luz al bimestre, aproximadamente?" : currentSector === "asesoria" ? "¿Cuánto pagas de luz, aproximadamente?" : "¿Cuánto pagas de luz al mes, aproximadamente?", bubble: "Con tu consumo estimamos el tamaño del sistema que necesitas.", options: currentSector === "residencial" ? RANGOS_LUZ_RESIDENCIAL : currentSector === "comercial" ? RANGOS_LUZ_COMERCIAL : currentSector === "industrial" ? RANGOS_LUZ_INDUSTRIAL : RANGOS_LUZ_GENERAL });
    if (answers.tiene_paneles === "Sí") questions.push({ id: "objetivo_solar", title: "¿Qué necesitas para tu sistema actual?", bubble: "Así distinguimos entre una ampliación y una revisión de lo que ya tienes.", options: ["Ampliar mi sistema", "Revisar o renovar mi sistema", "Necesito asesoría", ...(business ? ["Otro"] : [])], other: business ? { option: "Otro", id: "objetivo_solar_otro", title: "¿Qué necesitas hacer con tu sistema de paneles?", placeholder: "Describe brevemente lo que necesitas" } : undefined });
  }
  if (backup) {
    questions.push({ id: "equipos", title: currentSector === "industrial" ? "¿Qué equipos o procesos necesitas respaldar?" : "¿Qué equipos necesitas mantener funcionando?", bubble: "Selecciona lo que no puede apagarse. En la asesoría revisamos contigo qué respaldo necesitas.", multiple: true, options: currentSector === "residencial"
      ? ["Refrigerador", "Internet", "Iluminación", "Computadoras o TV", "Aire acondicionado", "Otros equipos"]
      : currentSector === "comercial"
        ? ["Punto de venta", "Refrigeración", "Internet y comunicaciones", "Iluminación", "Computadoras", "Otros equipos"]
        : ["Control y automatización", "Refrigeración", "Comunicaciones", "Iluminación", "Equipos de producción", "Otros equipos"], other: business ? { option: "Otros equipos", id: "equipos_otro", title: "¿Qué otros equipos o procesos necesitas respaldar?", placeholder: "Escribe los equipos o procesos adicionales" } : undefined });
  }
  if (answers.interes === "Iluminación") {
    questions.push({ id: "area_iluminacion", title: "¿Qué áreas necesitas iluminar?", bubble: "Selecciona todas las áreas que necesitas incluir en el proyecto.", multiple: true, options: currentSector === "industrial"
      ? ["Nave o producción", "Bodega o almacén", "Oficinas", "Patio de maniobras", "Andenes de carga", "Estacionamiento", "Fachada y exteriores", "Otro"]
      : ["Área de ventas o atención", "Oficinas", "Bodega o almacén", "Fachada", "Estacionamiento", "Áreas exteriores", "Otro"], other: { option: "Otro", id: "area_iluminacion_otra", title: "¿Qué otra área necesitas iluminar?", placeholder: "Escribe las áreas adicionales" } });
    questions.push({ id: "proyecto_iluminacion", title: "¿Qué necesitas para la iluminación?", bubble: "Así sabemos si partimos de cero o de una instalación existente.", options: ["Una instalación nueva", "Renovar la iluminación actual", "Necesito asesoría", "Otro"], other: { option: "Otro", id: "proyecto_iluminacion_otro", title: "¿Qué más necesitas para la iluminación?", placeholder: "Describe brevemente lo que necesitas" } });
  }
  if (answers.interes === "Estaciones de carga") {
    questions.push({ id: "uso_carga", title: "¿Quién usará las estaciones de carga?", bubble: "El uso nos ayuda a definir cómo debe operar la instalación.", multiple: business, options: business ? ["Clientes o visitantes", "Flotilla de la empresa", "Personal de la empresa", "Otro"] : ["Clientes o visitantes", "Flotilla de la empresa", "Personal de la empresa", "Uso mixto"], other: business ? { option: "Otro", id: "uso_carga_otro", title: "¿Quién más usará las estaciones de carga?", placeholder: "Escribe el uso adicional" } : undefined });
    questions.push({ id: "cantidad_carga", title: "¿Cuántos vehículos necesitas cargar al mismo tiempo?", bubble: "Con esto estimamos cuántos puntos de carga necesitas.", options: ["1 vehículo", "De 2 a 5 vehículos", "Más de 5 vehículos", "Aún no lo sé"] });
  }
  return questions.flatMap((question): QuoteQuestion[] => {
    const other = question.other;
    if (!other || !answers[question.id].split("; ").includes(other.option)) return [question];
    return [question, { id: other.id, title: other.title, bubble: "Completa el detalle de la opción que seleccionaste.", inputType: "text", maxLength: 200, placeholder: other.placeholder }];
  });
}

export function updateQuoteAnswers(sector: QuoteSector, answers: QuoteAnswers, id: QuestionId, value: string): QuoteAnswers {
  if (answers[id] === value) return answers;
  const updated = { ...answers, [id]: value };
  if (id === "interes" || id === "espacio") {
    for (const key of Object.keys(updated) as QuestionId[]) if (key !== "interes" && key !== "espacio" && key !== "ciudad" && key !== "ciudad_otra") updated[key] = "";
  }
  const active = new Set(getQuoteQuestions(sector, updated).map((question) => question.id));
  for (const key of Object.keys(updated) as QuestionId[]) if (!active.has(key)) updated[key] = "";
  return updated;
}

export function quoteResponses(sector: QuoteSector, answers: QuoteAnswers, comment: string): Record<string, string> {
  const responses: Record<string, string> = {};
  const summary: string[] = [];
  for (const question of getQuoteQuestions(sector, answers)) {
    const answer = answers[question.id].trim();
    if (!answer) continue;
    responses[question.id === "ciudad" ? "Ciudad o municipio" : question.id === "ciudad_otra" ? "Otra ciudad o municipio" : question.title] = answer;
    summary.push(`${question.title} ${answer}`);
  }
  // Preserve conditional details in the CRM message as well as structured answers.
  responses.Comentarios = [...summary, ...(comment.trim() ? [`Comentarios: ${comment.trim()}`] : [])].join("\n");
  return responses;
}
