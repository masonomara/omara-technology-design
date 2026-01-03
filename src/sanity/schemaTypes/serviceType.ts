// src/sanity/schemaTypes/serviceType.ts
import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "blockContent",
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for screen readers and SEO",
        }),
      ],
    }),
    defineField({
      name: "deepDive",
      title: "Deep Dive",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "title", media: "mainImage" },
  },
});
