import type { Metadata } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "../components/Header";
import Marquee from "../components/Marquee";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "O’Mara Technology",
  description:
    "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
  alternates: {
    canonical: "https://omaratechnology.com/",
  },
  openGraph: {
    title: "O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
    url: "https://omaratechnology.com/",
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
    title: "O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
    images: ["https://omaratechnology.com/bizCard.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "O’Mara Technology",
            url: "https://omaratechnology.com",
            logo: "https://omaratechnology.com/longWordmark.svg",
            description:
              "Digital studio led by Mason O'Mara for creative technical strategy, design, and development of mobile apps, websites, applied AI, software, and other solutions.",
            email: "info@omaratechnology.com",
          }),
        }}
      />
      <ScrollToTop />
      <Header />
      {children}
      <Marquee />
      <Analytics />
    </>
  );
}
