import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .id("root")
    .title("Website")
    .items([
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("project").title("Projects"),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("faq").title("FAQs"),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["service", "category", "project", "page", "faq"].includes(
            item.getId()!
          )
      ),
    ]);
