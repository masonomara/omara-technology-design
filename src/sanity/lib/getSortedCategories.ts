import { client } from "@/lib/sanityClient"; // adjust this import to your setup
import { SERVICES_QUERY } from "@/lib/queries";

type Service = {
  _id: string;
  title: string;
  slug: { current: string };
  overview: string;
  order: string;
  category: {
    _id: string;
    title: string;
    slug: { current: string };
    order: string;
  };
};

export async function getSortedCategories() {
  const services: Service[] = await client.fetch(SERVICES_QUERY);

  // Filter out services without valid categories
  const validServices = services.filter(
    (service) => service.category && service.category.title
  );

  // Group services by category title
  const grouped = validServices.reduce(
    (acc, service) => {
      const categoryKey = service.category.title;
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          categoryOrder: service.category.order || "",
          services: [],
        };
      }
      acc[categoryKey].services.push(service);
      return acc;
    },
    {} as Record<string, { categoryOrder: string; services: Service[] }>
  );

  // Sort categories and services
  const sortedCategories = Object.entries(grouped)
    .sort((a, b) =>
      (a[1].categoryOrder || "").localeCompare(b[1].categoryOrder || "")
    )
    .map(([title, { services }]) => [
      title,
      {
        services: services.sort((a, b) =>
          (a.order || "").localeCompare(b.order || "")
        ),
      },
    ]);

  return sortedCategories as [string, { services: Service[] }][];
}
