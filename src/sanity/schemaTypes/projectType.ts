import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "order",
      type: "string",
    }),
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      type: "blockContent",
    }),
    defineField({
      name: "seo",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
