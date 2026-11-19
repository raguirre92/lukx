import { ImageIcon } from "@sanity/icons/Image";
import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField } from "sanity";

export const blockContentMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Párrafo", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
    ],
    lists: [
      { title: "Viñetas", value: "bullet" },
      { title: "Numerada", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Negrita", value: "strong" },
        { title: "Cursiva", value: "em" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          title: "Enlace",
          type: "object",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({
                  scheme: ["http", "https", "mailto", "tel"],
                  allowRelative: true,
                }),
            }),
            defineField({
              name: "newTab",
              title: "Abrir en pestaña nueva",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "nofollow",
              title: "rel=nofollow",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "sponsored",
              title: "rel=sponsored",
              type: "boolean",
              initialValue: false,
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    icon: ImageIcon,
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
];
