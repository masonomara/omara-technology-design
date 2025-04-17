// src/app/(frontend)/services/page.tsx

import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import FooterContact from "@/app/components/FooterContact";
import ServicesSection from "@/app/components/ServicesSection";

export default async function Page() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ServicesSection services={services} />
        <FooterContact />
      </div>
    </main>
  );
}