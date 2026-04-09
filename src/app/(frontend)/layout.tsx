import type { Metadata } from "next";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";
import { MenuProvider } from "../context/MenuContext";
import Header from "../components/Header";
import Marquee from "../components/Marquee";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "O'Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/",
  },
  openGraph: {
    title: "O'Mara Technology",
    description:
      "Product design and technical development strategy and services",
    url: "https://omaratechnology.com/",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MenuProvider>
      <ScrollToTop />
      <Header />
      {children}
      <Marquee />
      <Analytics />
    </MenuProvider>
  );
}
