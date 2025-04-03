import {
  defineLocations,
  PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    // Add more locations for other service types
    service: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/services/${doc?.slug}`,
          },
          { title: "Services index", href: `/services` },
        ],
      }),
    }),
  },
};
