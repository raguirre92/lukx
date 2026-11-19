import { CaseIcon } from "@sanity/icons/Case";
import { defineArrayMember, defineField, defineType } from "sanity";
import { apiVersion } from "@/sanity/env";
import { blockContentMembers } from "../objects/block-content";

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  icon: CaseIcon,
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
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return "Solo minúsculas, números y guiones.";
          }
          const client = context.getClient({ apiVersion });
          const id = context.document?._id?.replace(/^drafts\./, "");
          const count = await client.fetch(
            `count(*[_type == "project" && slug.current == $slug && _id != $id])`,
            { slug: current, id },
          );
          return count === 0 || "Ese slug ya existe.";
        }),
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
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
      name: "gallery",
      title: "Galería",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Pie de foto",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Descripción",
      type: "array",
      of: blockContentMembers,
    }),
    defineField({
      name: "services",
      title: "Servicios",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
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
  preview: {
    select: { title: "title", media: "mainImage", subtitle: "category" },
  },
});
