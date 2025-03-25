import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description: "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: '#EDE1CC' }}>
      <head>
        <style>
          {`
            body {
              font-family: var(--font-inter), sans-serif;
            }
          `}
        </style>
      </head>
      <body className={`${inter.variable}`} style={{ margin: "0px" }}>
        <header style={{ padding: "12px 24px" }}>
          <Image src="/monogram.png" width={52} height={60} alt="Logo" />
        </header>
        {children}
      </body>
    </html>
  );
}
