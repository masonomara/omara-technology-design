// app/(frontend)/layout.tsx
// import type { Metadata } from "next";
import { draftMode } from "next/headers";
import '../globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "../components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import { MenuProvider } from "../context/MenuContext";
import Header from "../components/Header";
import Marquee from "../components/Marquee";


// export const metadata: Metadata = {
//   title: "O‘Mara Technology & Design",
//   description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
//   alternates: {
//     canonical: "https://omaratechnologydesign.com/",
//   },
//   openGraph: {
//     title: "O'Mara Technology & Design",
//     description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
//     url: "https://omaratechnologydesign.com/",
//     siteName: "O‘Mara Technology & Design",
//     images: [
//       {
//         url: "https://omaratechnologydesign.com/bizCard.png",
//         width: 1200,
//         height: 686,
//         alt: "O‘Mara Technology & Design",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MenuProvider>

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