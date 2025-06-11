import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const employee = defineType({
  name: "employee",
  title: "Employee",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "order", title: "Order", type: "number" }),

    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "blockContent" }),
    defineField({
      name: "photo",
      title: "Photo",
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
    defineField({ name: "linkedIn", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
  ],
  preview: {
    select: { title: "name", media: "photo" },
  },
});
