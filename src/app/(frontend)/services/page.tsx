// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { defineQuery } from "next-sanity";
// import { SERVICES_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

export const SERVICES_QUERY =
  defineQuery(`*[_type == "service" && defined(slug.current)]|order(order asc) {
  _id,
  title,
  slug,
  body,
  order,
  "category": category->{
    _id,
    slug,
    title
  }
}`);


export default async function Page() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });
  console.log("services:", services);

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
