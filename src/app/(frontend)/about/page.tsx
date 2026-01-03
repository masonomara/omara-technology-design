// src/app/(frontend)/about/page.tsx
import type { Metadata } from "next";
import FooterContact from "@/app/components/FooterContact";
import About from "@/app/components/About";

export const metadata: Metadata = {
  title: "About | O‘Mara Technology & Design",
  description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O’Mara Technology & Design.",
  alternates: {
    canonical: "https://omaratechnologydesign.com/about",
  },
  openGraph: {
    title: "About | O’Mara Technology & Design",
    description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O’Mara Technology & Design.",
    url: "https://omaratechnologydesign.com/about",
    siteName: "O‘Mara Technology & Design",
    images: [
      {
        url: "https://omaratechnologydesign.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O’Mara Technology & Design",
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
