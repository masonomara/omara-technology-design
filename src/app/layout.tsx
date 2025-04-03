import type { Metadata } from "next";

import { Overpass } from "next/font/google";

export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

const overpass = Overpass({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-overpass',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: "#EDE1CC" }}>
      <body className={` ${overpass.variable}`} style={{ margin: "0px", position: "relative" }}>
        {children}</body>
    </html>
  )
}
