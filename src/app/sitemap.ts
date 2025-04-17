// sitemap.ts
import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

type SanityDoc = {
  slug: { current: string };
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [projects, services] = await Promise.all([
      client.fetch<SanityDoc[]>(`*[_type == "project"]{ slug, _updatedAt }`),
      client.fetch<SanityDoc[]>(`*[_type == "service"]{ slug, _updatedAt }`),
    ]);

    const baseUrl = process.env.VERCEL
      ? `https://${process.env.VERCEL_URL}`
      : "http://omaratechnologydesign.com";

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

    const projectRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
      url: `${baseUrl}/portfolio/${item.slug.current}`, // fixed path
      lastModified: new Date(item._updatedAt).toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
      url: `${baseUrl}/services/${item.slug.current}`,
      lastModified: new Date(item._updatedAt).toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [];
  }
}
