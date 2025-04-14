import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

type SanityDoc = {
  slug: { current: string };
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [projects, services] = await Promise.all([
      client.fetch<SanityDoc[]>(`*[_type == "portfolio"]{ slug, _updatedAt }`),
      client.fetch<SanityDoc[]>(`*[_type == "service"]{ slug, _updatedAt }`)
    ]);

    const baseUrl = process.env.VERCEL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const staticRoutes: MetadataRoute.Sitemap = ["", "/about", "/projects", "/services"].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    const projectsRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
      url: `${baseUrl}/projects/${item.slug.current}`,
      lastModified: new Date(item._updatedAt).toISOString(),
      changeFrequency: "weekly",
      priority: 1.0,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
      url: `${baseUrl}/services/${item.slug.current}`,
      lastModified: new Date(item._updatedAt).toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...projectsRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return [];
  }
}
