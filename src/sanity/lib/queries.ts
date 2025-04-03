import { defineQuery } from "next-sanity";

export const SERVICES_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  body,
  mainImage,
  publishedAt,
  "categories": coalesce(
    categories[]->{
      _id,
      slug,
      title
    },
    []
  ),
  author->{
    name,
    image
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
  mainImage,
  publishedAt,
  "categories": coalesce(
    categories[]->{
      _id,
      slug,
      title
    },
    []
  ),
  author->{
    name,
    image
  },
  relatedServices[]{
    _key, // required for drag and drop
    ...@->{_id, title, slug} // get fields from the referenced service
  }
}`);
