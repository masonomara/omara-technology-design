import Footer from "@/app/components/Footer";
import ServicesSection from "@/app/components/ServicesSection";
import { getServicesData } from "@/lib/content";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Process | O'Mara Technology",
  description:
    "One-time project and partnership engagements for product design and development.",
  alternates: {
    canonical: "https://omaratechnology.com/process",
  },
  openGraph: {
    title: "Process | O'Mara Technology",
    description:
      "One-time project and partnership engagements for product design and development.",
    url: "https://omaratechnology.com/process",
    siteName: "O'Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O'Mara Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const data = getServicesData();
  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ServicesSection data={data} />
        <Footer />
      </div>
    </main>
  );
}
