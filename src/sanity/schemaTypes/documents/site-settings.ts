import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

const weekday = [
  { title: "Lunes", value: "Monday" },
  { title: "Martes", value: "Tuesday" },
  { title: "Miércoles", value: "Wednesday" },
  { title: "Jueves", value: "Thursday" },
  { title: "Viernes", value: "Friday" },
  { title: "Sábado", value: "Saturday" },
  { title: "Domingo", value: "Sunday" },
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Datos del sitio",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "telephone",
      title: "Teléfono",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "streetAddress",
      title: "Calle y colonia",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressLocality",
      title: "Ciudad",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressRegion",
      title: "Estado",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addressCountry",
      title: "País",
      type: "string",
      initialValue: "MX",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timeZone",
      title: "Zona horaria",
      description: "Los horarios de abajo están en esta zona.",
      type: "string",
      initialValue: "America/Mexico_City",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "openingHours",
      title: "Horario",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "days",
              title: "Días",
              type: "array",
              of: [defineArrayMember({ type: "string", options: { list: weekday } })],
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "opens",
              title: "Abre",
              type: "string",
              validation: (rule) => rule.required().regex(/^\d{2}:\d{2}$/, { name: "HH:MM" }),
            }),
            defineField({
              name: "closes",
              title: "Cierra",
              type: "string",
              validation: (rule) => rule.required().regex(/^\d{2}:\d{2}$/, { name: "HH:MM" }),
            }),
          ],
          preview: {
            select: { opens: "opens", closes: "closes" },
            prepare({ opens, closes }) {
              return { title: `${opens ?? ""}–${closes ?? ""}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "sameAs",
      title: "Redes (sameAs)",
      description: "Solo los perfiles confirmados. No agregar TikTok.",
      type: "array",
      of: [
        defineArrayMember({
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "telephone" },
  },
});
