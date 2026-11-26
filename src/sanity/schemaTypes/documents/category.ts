import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";
import { apiVersion } from "@/sanity/env";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: TagIcon,
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
            `count(*[_type == "category" && slug.current == $slug && _id != $id])`,
            { slug: current, id },
          );
          return count === 0 || "Ese slug ya existe.";
        }),
    }),
    defineField({
      name: "description",
      title: "Introducción",
      description:
        "Texto propio de la categoría. La página /blog/categoria/slug queda en noindex hasta tener esta introducción y 5 o más artículos.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "legacyId",
      title: "ID de WordPress",
      type: "string",
      readOnly: true,
    }),
  ],
});
