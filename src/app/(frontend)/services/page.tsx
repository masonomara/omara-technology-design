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
    "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
  alternates: {
    canonical: "https://omaratechnology.com/services",
  },
  openGraph: {
    title: "Services | O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
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
      "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
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
