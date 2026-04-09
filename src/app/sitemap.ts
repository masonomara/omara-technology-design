import { MetadataRoute } from "next";
import { getPortfolioItems } from "@/lib/content";
import { toSlug } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omaratechnology.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/contact",
    "/portfolio",
    "/services",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 1,
  }));

  const projectRoutes: MetadataRoute.Sitemap = getPortfolioItems().map((node) => ({
    url: `${baseUrl}/portfolio/${toSlug(node.name)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
