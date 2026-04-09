// src/app/(frontend)/about/page.tsx
import type { Metadata } from "next";
import FooterContact from "@/app/components/FooterContact";
import About from "@/app/components/About";

export const metadata: Metadata = {
  title: "About | O‘Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/about",
  },
  openGraph: {
    title: "About | O’Mara Technology",
    description:
      "Product design and technical development strategy and services",
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
};

export default async function Page() {
  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <About />
        <FooterContact />
      </div>
    </main>
  );
}
