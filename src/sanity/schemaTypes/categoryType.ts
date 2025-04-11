// categoryType.ts
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "order",
      type: "number",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (rule) =>
        rule.required().error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,

    }),
    defineField({
      name: "description",
      type: "text",
    }),
  ],
});
