// src/app/(frontend)/services/page.tsx

import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import FooterContact from "@/app/components/FooterContact";
import ServicesSection from "@/app/components/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | O‘Mara Technology & Design",
  description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
  alternates: {
    canonical: "https://omaratechnologydesign.com/services",
  },
  openGraph: {
    title: "Services | O'Mara Technology & Design",
    description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
    url: "https://omaratechnologydesign.com/services",
    siteName: "O‘Mara Technology & Design",
    images: [
      {
        url: "https://omaratechnologydesign.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O‘Mara Technology & Design",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

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