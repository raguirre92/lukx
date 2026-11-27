import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "metaTitle",
      title: "Título meta",
      description: "Si se deja vacío se usa el título de la página.",
      type: "string",
      validation: (rule) => [
        rule.max(60).error("Máximo 60 caracteres; Google corta el resto."),
        rule.max(55).warning("Arriba de 55 caracteres se puede cortar en Google; ideal 55 o menos."),
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Descripción meta",
      description: "Si se deja vacía se usa el extracto.",
      type: "text",
      rows: 3,
      validation: (rule) => [
        rule.max(160).error("Máximo 160 caracteres."),
        rule.custom((value) => {
          const length = typeof value === "string" ? value.trim().length : 0;
          if (!length) return true;
          if (length < 140 || length > 155) {
            return `Ideal entre 140 y 155 caracteres (hoy ${length}).`;
          }
          return true;
        }).warning(),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para redes",
      description: "1200×630. Si se deja vacía se usa la imagen principal.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "noindex",
      title: "No indexar",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "nofollow",
      title: "No follow",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "canonical",
      title: "Canonical (opcional)",
      description:
        "Normalmente vacío: la página se apunta a sí misma en https://lukx.com.mx. Llénalo solo si el contenido original vive en otra URL de Lukx.",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https"], allowRelative: false }).custom((value) => {
          if (!value) return true;
          if (!value.startsWith("https://lukx.com.mx/")) {
            return "Usa una URL https de lukx.com.mx, sin www.";
          }
          if (value.endsWith("/") && value !== "https://lukx.com.mx/") {
            return "Sin barra final.";
          }
          return true;
        }),
    }),
  ],
});
