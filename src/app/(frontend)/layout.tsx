// app/layout.tsx
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import CursorFollower from "../components/CursorFollower";
import '../globals.css';
import { Analytics } from "@vercel/analytics/react";
import { SanityLive } from "@/sanity/lib/live";
import { DisableDraftMode } from "../components/DisableDraftMode";
import { VisualEditing } from "next-sanity";
import LayoutClient from "../components/LayoutClient";

export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <CursorFollower /> {/* Add this component */}
      <LayoutClient>
        {children}
      </LayoutClient>
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Analytics />
    </section>
  );
}