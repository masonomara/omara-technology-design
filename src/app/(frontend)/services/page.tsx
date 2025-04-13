// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function Page() {

  console.log("Fetching services with query:", SERVICES_QUERY);
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  console.log("Fetched services:", services);

  return (
    <main>
      <h1>Service Index</h1>
      <ul>
        {services.map((service) => (
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
