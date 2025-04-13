// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function Page() {

  const { data: services } = await sanityFetch({
    query: SERVICES_QUERY, tags: ['service', 'category', 'project'],
  });

  return (
    <main>
      <h1>Service Index</h1>
      <ul>
        {services.map((service: any) => (
          <li key={service._id}>
            <Link
              className="block p-4 hover:text-blue-500"
              href={`/services/${service?.slug?.current}`}
            >
              {service?.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
