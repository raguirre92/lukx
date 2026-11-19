import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import { apiVersion } from "@/sanity/env";

export const author = defineType({
  name: "author",
  title: "Autor",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
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
            `count(*[_type == "author" && slug.current == $slug && _id != $id])`,
            { slug: current, id },
          );
          return count === 0 || "Ese slug ya existe.";
        }),
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "image",
      title: "Foto",
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
      name: "url",
      title: "Sitio",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "sameAs",
      title: "Perfiles (sameAs)",
      type: "array",
      of: [
        defineField({
          name: "profile",
          title: "URL",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
    defineField({
      name: "legacyId",
      title: "ID de WordPress",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
