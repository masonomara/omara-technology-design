import { MetadataRoute } from "next";
import { getWorkItems } from "@/lib/content";
import { toSlug } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omaratechnology.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/contact",
    "/work",
    "/services",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 1,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getWorkItems().map((node) => ({
    url: `${baseUrl}/work/${toSlug(node.name)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
