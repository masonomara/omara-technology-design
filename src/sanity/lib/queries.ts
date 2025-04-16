import { defineQuery } from "next-sanity";

// All Services (only those ready for publishing)
export const SERVICES_QUERY = defineQuery(`*[
  _type == "service" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  slug,
  category->{_id, title, slug, order},
  overview,
  body,
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

export const SERVICES_SLUGS_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]{ 
  "slug": slug.current
}`);

// Single Service by slug
export const SERVICE_QUERY = defineQuery(`*[
  _type == "service" &&
  defined(slug.current)
][0]{
  _id,
  title,
  slug,
  overview,
  body,
  category->{_id, title, slug, order},
  // relatedServices->{_id, title, slug},
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

// All Categories (only those ready for publishing)
export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  order,
  slug,
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

// Single Category by slug
export const CATEGORY_QUERY = defineQuery(`*[
  _type == "category" &&
  slug.current == $slug &&
  defined(title)
][0]{
  _id,
  title,
  order,
  slug,
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

// All Projects
export const PROJECTS_QUERY = defineQuery(`*[
  _type == "project" &&
  defined(slug.current)
] | order(order asc) {
  _id,
  title,
  slug,
  body,
  order,
  image,
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

// Single Project by slug
export const PROJECT_QUERY = defineQuery(`*[
  _type == "project" &&
  defined(slug.current)
][0]{
  _id,
  title,
  slug,
  body,
  order,
  image,
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description,  ""),
    "image": seo.image,
    "noIndex": seo.noIndex == true
  },
}`);

export const REDIRECTS_QUERY = defineQuery(`
  *[_type == "redirect" && isEnabled == true] {
      source,
      destination,
      permanent
  }
`);

export const OG_IMAGE_QUERY = defineQuery(`
  *[_id == $id][0]{
    title,
    "image": mainImage.asset->{
      url,
      metadata {
        palette
      }
    }
  }    
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type in ["page", "post"] && defined(slug.current)] {
      "href": select(
        _type == "page" => "/" + slug.current,
        _type == "post" => "/posts/" + slug.current,
        slug.current
      ),
      _updatedAt
  }
  `);
