import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType, type ValidationContext } from "sanity";
import { BLOG_SERVICE_PAGES } from "@/lib/blog-services";
import { apiVersion } from "@/sanity/env";
import { blockContentMembers } from "../objects/block-content";

const AUTHOR_LUKX = "author-lukx";
const PLACEHOLDER = "[Escribe";

type Span = { _type?: string; text?: string; marks?: string[] };
type MarkDef = { _key?: string; _type?: string; href?: string };
type Block = {
  _type?: string;
  style?: string;
  children?: Span[];
  markDefs?: MarkDef[];
};

const CHECKLIST = [
  { name: "keywordInTitle", title: "Keyword principal en el título (H1), en el primer párrafo y en al menos un H2" },
  { name: "metaReady", title: "Meta title (≤ 60) y meta description (140–160) con la keyword" },
  { name: "slugReady", title: "Slug corto, en minúsculas, sin acentos y con la keyword" },
  { name: "headings", title: "Un solo H1 (el título); el cuerpo usa solo H2 y H3" },
  { name: "internalLinks", title: "Enlace a la página de servicio (pilar) y a otro artículo del blog" },
  { name: "cta", title: "CTA «Agendar asesoría» visible, con enlace a /agendar o a cotización" },
  { name: "noInventedData", title: "Sin cifras, precios ni datos inventados; cada dato tiene fuente" },
  { name: "imagesAlt", title: "Todas las imágenes con texto alternativo descriptivo" },
  { name: "ogImage", title: "Imagen para redes definida, o la principal como respaldo" },
  { name: "categoryCanonical", title: "Categoría asignada; canonical a sí mismo; noindex apagado" },
  { name: "proofread", title: "Ortografía revisada y vista previa probada en celular" },
] as const;

/** Los 4 artículos importados de WordPress tienen legacyId: ahí los faltantes son aviso, no error. */
function isLegacy(context: ValidationContext) {
  return Boolean((context.document as { legacyId?: string } | undefined)?.legacyId);
}

function requiredForNew(message: string) {
  return (value: unknown, context: ValidationContext) => {
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && value.length === 0);
    if (!empty) return true;
    return isLegacy(context) ? true : message;
  };
}

function isInternalHref(href?: string) {
  if (!href) return false;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const url = new URL(href);
    return url.hostname === "lukx.com.mx" || url.hostname === "www.lukx.com.mx";
  } catch {
    return false;
  }
}

function linkHrefs(blocks: Block[]) {
  return blocks.flatMap((block) =>
    (block.markDefs ?? [])
      .filter((mark) => mark._type === "link" && mark.href)
      .map((mark) => {
        const href = mark.href as string;
        return href.replace(/^https?:\/\/(www\.)?lukx\.com\.mx/, "") || "/";
      }),
  );
}

let keyCounter = 0;
function key(prefix: string) {
  keyCounter += 1;
  return `${prefix}${Date.now().toString(36)}${keyCounter}`;
}

function textBlock(style: string, text: string) {
  return {
    _type: "block",
    _key: key("b"),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key("s"), text, marks: [] }],
  };
}

function ctaBlock() {
  const linkKey = key("l");
  return {
    _type: "block",
    _key: key("b"),
    style: "normal",
    markDefs: [{ _type: "link", _key: linkKey, href: "/agendar", newTab: false, nofollow: false, sponsored: false }],
    children: [
      { _type: "span", _key: key("s"), text: "[Escribe aquí una frase de cierre ligada al tema.] ", marks: [] },
      { _type: "span", _key: key("s"), text: "Agendar asesoría", marks: [linkKey] },
    ],
  };
}

function templateBody() {
  return [
    textBlock(
      "normal",
      "[Escribe aquí el primer párrafo: plantea el problema y menciona la keyword principal en las primeras 100 palabras.]",
    ),
    textBlock("h2", "[Escribe aquí el H2 1, con la keyword principal o una variante]"),
    textBlock("normal", "[Escribe aquí el desarrollo. Enlaza la página de servicio relacionada.]"),
    textBlock("h2", "[Escribe aquí el H2 2]"),
    textBlock("normal", "[Escribe aquí el desarrollo. Enlaza otro artículo del blog.]"),
    textBlock("h2", "[Escribe aquí el H2 3]"),
    textBlock("normal", "[Escribe aquí el desarrollo.]"),
    textBlock("h2", "¿Quieres saber si te conviene?"),
    ctaBlock(),
    textBlock("h2", "Preguntas frecuentes"),
    textBlock("h3", "[Escribe aquí la pregunta 1]"),
    textBlock("normal", "[Escribe aquí la respuesta 1]"),
    textBlock("h3", "[Escribe aquí la pregunta 2]"),
    textBlock("normal", "[Escribe aquí la respuesta 2]"),
    textBlock("h3", "[Escribe aquí la pregunta 3]"),
    textBlock("normal", "[Escribe aquí la respuesta 3]"),
  ];
}

export const post = defineType({
  name: "post",
  title: "Artículo",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Contenido", default: true },
    { name: "seo", title: "SEO" },
    { name: "review", title: "Revisión" },
  ],
  initialValue: () => ({
    author: { _type: "reference", _ref: AUTHOR_LUKX },
    body: templateBody(),
    seo: { _type: "seo", noindex: false, nofollow: false },
    seoChecklist: Object.fromEntries(CHECKLIST.map((item) => [item.name, false])),
  }),
  fields: [
    defineField({
      name: "title",
      title: "Título (H1)",
      description: "Es el único H1 de la página. Incluye la keyword principal.",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Corto, en minúsculas, sin acentos ni ñ, con la keyword. Queda en /blog/slug.",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          const current = slug?.current;
          if (!current) return "El slug es obligatorio.";
          if (current !== current.toLowerCase() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "Solo minúsculas sin acentos, números y guiones.";
          }
          const client = context.getClient({ apiVersion });
          const id = context.document?._id?.replace(/^drafts\./, "");
          const count = await client.fetch(
            `count(*[_type == "post" && slug.current == $slug && _id != $id])`,
            { slug: current, id },
          );
          return count === 0 || "Ese slug ya existe.";
        }),
    }),
    defineField({
      name: "excerpt",
      title: "Extracto",
      description: "Resumen de 1 o 2 frases para el listado del blog. Si falta la descripción meta, se usa este.",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.custom(requiredForNew("El extracto es obligatorio.")),
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      group: "content",
      options: { hotspot: true },
      validation: (rule) => rule.custom(requiredForNew("La imagen principal es obligatoria.")),
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen. Obligatorio.",
          type: "string",
          validation: (rule) => rule.required().error("El texto alternativo es obligatorio."),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Cuerpo",
      description: "Usa solo H2 y H3. Los textos entre corchetes son de la plantilla y hay que reemplazarlos.",
      type: "array",
      group: "content",
      of: blockContentMembers,
      validation: (rule) => [
        rule.custom(requiredForNew("El cuerpo es obligatorio.")),
        rule.custom((value) => {
          const blocks = (value ?? []) as Block[];
          if (blocks.some((block) => block._type === "block" && block.style === "h1")) {
            return "El cuerpo no puede tener H1: el título ya es el H1. Cámbialo a H2.";
          }
          const hasPlaceholder = blocks.some((block) =>
            (block.children ?? []).some((child) => child.text?.includes(PLACEHOLDER)),
          );
          if (hasPlaceholder) return "Quedan textos de la plantilla «[Escribe aquí…]» por reemplazar.";
          return true;
        }),
        rule
          .custom((value, context) => {
            const blocks = (value ?? []) as Block[];
            if (!blocks.length) return true;
            const internal = linkHrefs(blocks).filter(isInternalHref);
            const contentLinks = internal.filter((href) => !href.startsWith("/agendar"));
            if (!contentLinks.length) {
              return "Agrega al menos 1 enlace interno (página de servicio u otro artículo del blog).";
            }
            const service = (context.document as { relatedServiceUrl?: string } | undefined)?.relatedServiceUrl;
            const missing: string[] = [];
            if (service && !internal.some((href) => href === service || href.startsWith(`${service}#`))) {
              missing.push(`la página de servicio (${service})`);
            }
            if (!internal.some((href) => href.startsWith("/blog/"))) missing.push("otro artículo del blog");
            return missing.length ? `Falta enlazar ${missing.join(" y ")}.` : true;
          })
          .warning(),
      ],
    }),
    defineField({
      name: "author",
      title: "Autor",
      description: "Fijo: la marca «Lukx».",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
      readOnly: true,
      initialValue: { _ref: AUTHOR_LUKX },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?._ref) return "El autor es obligatorio (Lukx).";
          return value._ref === AUTHOR_LUKX || "El autor del blog es la marca «Lukx».";
        }),
    }),
    defineField({
      name: "categories",
      title: "Categorías",
      description: "La primera es la principal: define el cluster, la ruta /blog/categoria y el breadcrumb.",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.min(1).error("Asigna al menos una categoría."),
    }),
    defineField({
      name: "relatedServiceUrl",
      title: "Página de servicio relacionada",
      description: "Página pilar del cluster. El artículo la enlaza al final.",
      type: "string",
      group: "content",
      options: { list: [...BLOG_SERVICE_PAGES], layout: "dropdown" },
      validation: (rule) => rule.custom(requiredForNew("Elige la página de servicio relacionada.")),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      description: "Se muestra en el artículo y se usa en el schema (datePublished).",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Última actualización",
      description:
        "Llénala solo cuando el contenido cambie de fondo. Se muestra en el artículo y se usa en el schema (dateModified).",
      type: "datetime",
      group: "content",
      validation: (rule) =>
        rule.custom((value, context) => {
          const published = (context.document as { publishedAt?: string } | undefined)?.publishedAt;
          if (value && published && value < published) {
            return "La actualización no puede ser anterior a la publicación.";
          }
          return true;
        }),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      validation: (rule) =>
        rule.custom((value: { metaTitle?: string; metaDescription?: string } | undefined, context) => {
          if (isLegacy(context)) return true;
          const missing: string[] = [];
          if (!value?.metaTitle?.trim()) missing.push("el título meta");
          if (!value?.metaDescription?.trim()) missing.push("la descripción meta");
          return missing.length ? `Falta ${missing.join(" y ")}.` : true;
        }),
    }),
    defineField({
      name: "focusKeyword",
      title: "Keyword principal",
      description: "Interno, para revisión. No se publica en el sitio.",
      type: "string",
      group: "seo",
      validation: (rule) =>
        rule
          .custom((value, context) => {
            const keyword = value?.trim().toLowerCase();
            if (!keyword) return true;
            const doc = context.document as { title?: string; seo?: { metaTitle?: string } } | undefined;
            const missing: string[] = [];
            if (!doc?.title?.toLowerCase().includes(keyword)) missing.push("el título");
            if (doc?.seo?.metaTitle && !doc.seo.metaTitle.toLowerCase().includes(keyword)) {
              missing.push("el título meta");
            }
            return missing.length ? `La keyword no aparece tal cual en ${missing.join(" ni en ")}.` : true;
          })
          .warning(),
    }),
    defineField({
      name: "seoChecklist",
      title: "Checklist SEO",
      description: "Interno, para revisión antes de publicar. No se publica en el sitio.",
      type: "object",
      group: "review",
      options: { collapsible: false },
      fields: CHECKLIST.map((item) =>
        defineField({ name: item.name, title: item.title, type: "boolean", initialValue: false }),
      ),
      validation: (rule) =>
        rule
          .custom((value: Record<string, boolean | undefined> | undefined, context) => {
            if (isLegacy(context)) return true;
            const pending = CHECKLIST.filter((item) => !value?.[item.name]).length;
            return pending ? `Faltan ${pending} de ${CHECKLIST.length} puntos del checklist antes de publicar.` : true;
          })
          .warning(),
    }),
    defineField({
      name: "legacyId",
      title: "ID de WordPress",
      type: "string",
      group: "review",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Fecha de publicación",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "mainImage", subtitle: "publishedAt" },
  },
});
