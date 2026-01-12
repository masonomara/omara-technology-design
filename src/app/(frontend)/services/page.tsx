// src/app/(frontend)/services/page.tsx

import FooterContact from "@/app/components/FooterContact";
import ServicesSection from "@/app/components/ServicesSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | O‘Mara Technology & Design",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnologydesign.com/services",
  },
  openGraph: {
    title: "Services | O‘Mara Technology & Design",
    description: "Product design and technical development strategy and services",
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