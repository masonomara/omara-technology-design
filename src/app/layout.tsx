import type { Metadata } from "next";
import localFont from 'next/font/local'
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

const rallingtonSerif = localFont({
  src: '../../public/fonts/RallingtonSerif.woff2', // Note the path adjustment
  display: 'swap',
  variable: '--font-rallingtonSerif', // Add a CSS variable name
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: "#FAE6D0" }}>
      <head><meta name="apple-mobile-web-app-title" content="O'Mara" />
      </head>
      <body className={`${overpass.variable} ${rallingtonSerif.variable}`} style={{ margin: "0px", position: "relative" }}>
        {children}
      </body>
    </html>
  )
}
