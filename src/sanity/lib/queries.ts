import { defineQuery } from "next-sanity";

// All Services (only those ready for publishing)
export const SERVICES_QUERY = defineQuery(`*[
  _type == "service" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  slug,
  category->{_id, title, slug},
  body,
  seo
}`);

export const SERVICES_SLUGS_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]{ 
  "slug": slug.current
}`);

// Single Service by slug
export const SERVICE_QUERY = defineQuery(`*[
  _type == "service" &&
  slug.current == $slug
][0]{
  _id,
  title,
  slug,
  body,
  category->{_id, title, slug},
  relatedServices->{_id, title, slug},
  seo
}`);

// All Categories (only those ready for publishing)
export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  slug,
  seo
}`);

// Single Category by slug
export const CATEGORY_QUERY = defineQuery(`*[
  _type == "category" &&
  slug.current == $slug &&
  defined(title)
][0]{
  _id,
  title,
  slug,
  seo
}`);

// All Projects
export const PROJECTS_QUERY = defineQuery(`*[
  _type == "project" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  name,
  slug,
  body,
  image,
  seo
}`);

// Single Project by slug
export const PROJECT_QUERY = defineQuery(`*[
  _type == "project" &&
  slug.current == $slug &&
  defined(name) &&
  defined(body) &&
  defined(image)
][0]{
  _id,
  name,
  slug,
  body,
  image,
  seo
}`);
