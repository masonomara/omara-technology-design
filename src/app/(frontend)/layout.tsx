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


export const metadata: Metadata = {
  title: "O’Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

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