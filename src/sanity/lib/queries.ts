// queries.ts
import { defineQuery } from "next-sanity";

export const SERVICES_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]|order(order asc) {
  _id,
  title,
  slug,
  body,
  order,
  "category": category->{
    _id,
    slug,
    title
  }
}`);

export const SERVICES_SLUGS_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]{ 
  "slug": slug.current
}`);

export const SERVICE_QUERY =
  defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  body,
  order,
  "category": category->{
    _id,
    slug,
    title
  },
  relatedServices[]{
    _key,
    ...@->{_id, title, slug}
  }
}`);