import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Overpass } from "next/font/google";
import CursorFollower from "./components/CursorFollower";
import { AnimatePresence } from "framer-motion";

export const metadata: Metadata = {
  title: "O’Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, ECommerce, Software",
};

const overpass = Overpass({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-overpass',
});

const rallingtonSerif = localFont({
  src: '../../public/fonts/RallingtonSerif.woff2',
  display: 'swap',
  variable: '--font-rallingtonSerif',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: "#F8E9D8" }}>
      <head><meta name="apple-mobile-web-app-title" content="O’Mara Technology & Design" />
      </head>
      <AnimatePresence>
        <body className={`${overpass.variable} ${rallingtonSerif.variable}`} style={{ margin: "0px", position: "relative" }}>
          <CursorFollower />
          {children}
        </body>
      </AnimatePresence>
    </html>
  )
}
