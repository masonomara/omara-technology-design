// src/app/(frontend)/about/page.tsx
import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import About from "@/app/components/About";

export const metadata: Metadata = {
  title: "About | O‘Mara Technology",
  description:
    "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
  alternates: {
    canonical: "https://omaratechnology.com/about",
  },
  openGraph: {
    title: "About | O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
    url: "https://omaratechnology.com/about",
    siteName: "O‘Mara Technology",
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
    title: "About | O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
    images: ["https://omaratechnology.com/bizCard.png"],
  },
};

export default async function Page() {
  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <About />
        <Footer />
      </div>
    </main>
  );
}
