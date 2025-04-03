import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faqs",
  title: "FAQs",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
  ],
});
