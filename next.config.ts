import type { NextConfig } from "next";
import { fetchRedirects } from "@/sanity/lib/fetchRedirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    const rawRedirects = await fetchRedirects();

    // Filter and map to enforce non-nullable types
    const sanitizedRedirects = rawRedirects
      .filter(
        (r): r is { source: string; destination: string; permanent: boolean } =>
          typeof r.source === "string" &&
          typeof r.destination === "string" &&
          typeof r.permanent === "boolean"
      )
      .map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent,
      }));

    return sanitizedRedirects;
  },
};

export default nextConfig;
