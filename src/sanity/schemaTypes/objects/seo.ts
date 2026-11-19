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
      validation: (rule) => rule.max(70).warning("Conviene mantenerlo cerca de 70 caracteres."),
    }),
    defineField({
      name: "metaDescription",
      title: "Descripción meta",
      description: "Si se deja vacía se usa el extracto.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("La descripción meta conviene en unos 160 caracteres."),
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
      description: "Normalmente vacío. La página usa su propia URL en https://lukx.com.mx.",
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
