// app/(frontend)/layout.tsx
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import '../globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "../components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { MenuProvider } from "../context/MenuContext";
import Header from "../components/Header";
import Marquee from "../components/Marquee";
import ScrollToTop from "../components/ScrollToTop";


export const metadata: Metadata = {
  title: "O‘Mara Technology & Design",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnologydesign.com/",
  },
  openGraph: {
    title: "O’Mara Technology & Design",
    description: "Product design and technical development strategy and services",
    url: "https://omaratechnologydesign.com/",
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

export default async function RootLayout({
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

      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}


    </MenuProvider>
  );
}