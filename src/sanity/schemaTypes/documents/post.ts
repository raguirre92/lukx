import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import { apiVersion } from "@/sanity/env";
import { blockContentMembers } from "../objects/block-content";

export const post = defineType({
  name: "post",
  title: "Artículo",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          const current = slug?.current;
          if (!current) return "El slug es obligatorio.";
          if (current !== current.toLowerCase() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "Solo minúsculas, números y guiones.";
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
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
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
      name: "body",
      title: "Cuerpo",
      type: "array",
      of: blockContentMembers,
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "Categorías",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Publicado",
      description: "Fecha original de WordPress.",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Actualizado",
      description: "Fecha original de modificación en WordPress.",
      type: "datetime",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "legacyId",
      title: "ID de WordPress",
      type: "string",
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
