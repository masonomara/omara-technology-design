// TODO: DELETE THIS PAGE. The /services route is being retired — its language is
// being ported into the About page. Kept temporarily for reference; remove once the
// port is complete. (ServicesSection + services.json are being reused on About.)
import Footer from "@/app/components/Footer";
import ServicesSection from "@/app/components/ServicesSection";
import { getServicesData } from "@/lib/content";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Services | O’Mara Technology",
  description:
    "O’Mara Technology’s services — product design, development, and deployment for mobile apps, websites, AI products, and ecommerce.",
  alternates: {
    canonical: "https://omaratechnology.com/services",
  },
  openGraph: {
    title: "Services | O’Mara Technology",
    description:
      "O’Mara Technology’s services — product design, development, and deployment for mobile apps, websites, AI products, and ecommerce.",
    url: "https://omaratechnology.com/services",
    siteName: "O’Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O’Mara Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | O’Mara Technology",
    description:
      "O’Mara Technology’s services — product design, development, and deployment for mobile apps, websites, AI products, and ecommerce.",
    images: ["https://omaratechnology.com/bizCard.png"],
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
