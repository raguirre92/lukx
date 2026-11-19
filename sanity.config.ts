import { esESLocale } from "@sanity/locale-es-es";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "lukx",
  title: "Lukx",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    esESLocale(),
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      allowOrigins: [
        "http://localhost:*",
        "https://lukx.com.mx",
        "https://lukx-web-git-staging-everlukx.vercel.app",
      ],
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (previous, { creationContext }) => {
      if (creationContext.type === "global") {
        return previous.filter((template) => template.templateId !== "siteSettings");
      }
      return previous;
    },
  },
});
