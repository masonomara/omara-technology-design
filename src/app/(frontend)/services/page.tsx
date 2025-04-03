import { ServiceCard } from "@/app/components/ServiceCard";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";


export default async function Page() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  return (
    <main>
      <h1>Service Index</h1>
      <ul>
        {services.map((service) => (
          <ServiceCard key={service._id} {...service} />
        ))}
      </ul>
    </main>
  );
}
