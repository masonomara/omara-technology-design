// src/sanity/schemaTypes/postType.ts
import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: TextIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "string" }),
    defineField({
      name: "relevantClients",
      title: "Relevant Clients",
      type: "array",
      of: [{ type: "reference", to: [{ type: "client" }] }],
    }),
    defineField({
      name: "relevantServices",
      title: "Relevant Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      options: {
        list: [
          { title: "Perspective", value: "perspective" },
          { title: "Research Report", value: "researchReport" },
          { title: "Success Story", value: "successStory" },
        ],
      },
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
      options: { dateFormat: "YYYY-MM-DD", timeFormat: "HH:mm" },
    }),
    defineField({
      name: "author",
      title: "Author(s)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "employee" }] }],
    }),
    defineField({
      name: "problem",
      title: "Problem",
      type: "blockContent",
    }),
    defineField({
      name: "services",
      title: "Services Listed",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      date: "publishDate",
    },
    prepare({ title, media, date }) {
      return { title, media, subtitle: date && new Date(date).toLocaleDateString() };
    },
  },
});
