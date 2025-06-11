// src/sanity/schemaTypes/clientType.ts
import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const clientType = defineType({
  name: "client",
  title: "Client",
  type: "document",
  icon: UserIcon,
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
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subhead", title: "Subhead", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "ctaText", title: "CTA Text", type: "string" }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "url",
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
  ],
  preview: {
    select: { title: "title", media: "mainImage" },
  },
});
