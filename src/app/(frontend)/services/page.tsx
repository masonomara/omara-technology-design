// src/app/(frontend)/services/page.tsx

import FooterContact from "@/app/components/FooterContact";
import ServicesSection from "@/app/components/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | O‘Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/services",
  },
  openGraph: {
    title: "Services | O‘Mara Technology",
    description: "Product design and technical development strategy and services",
    url: "https://omaratechnology.com/services",
    siteName: "O‘Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O‘Mara Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ServicesSection />
        <FooterContact />
      </div>
    </main>
  );
}