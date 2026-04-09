// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Overpass, Radio_Canada } from "next/font/google";
import CursorFollower from "./components/CursorFollower";

export const metadata: Metadata = {
  title: "O’Mara Technology",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, ECommerce, Software",
};

const overpass = Overpass({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-overpass",
});

const radioCanada = Radio_Canada({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-radio",
  axes: ["wdth"],
});

const rallingtonSerif = localFont({
  src: "../../public/fonts/RallingtonSerif.woff2",
  display: "swap",
  variable: "--font-rallingtonSerif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${overpass.variable} ${radioCanada.variable} ${rallingtonSerif.variable}`} style={{ margin: "0px", backgroundColor: "#FCEEDE" }}>
      <head>
        <meta name="apple-mobile-web-app-title" content="O’Mara Technology" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{ margin: "0px", position: "relative" }}
      >
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
