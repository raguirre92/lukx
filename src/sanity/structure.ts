import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Datos del sitio")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Datos del sitio")),
      S.divider(),
      S.listItem()
        .title("Blog")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post").title("Artículos"),
              S.documentTypeListItem("author").title("Autores").icon(UserIcon),
              S.documentTypeListItem("category").title("Categorías").icon(TagIcon),
            ]),
        ),
      S.documentTypeListItem("project").title("Proyectos").icon(CaseIcon),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() as string)),
    ]);
