import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import Image from "next/image";
import CursorFollower from "./components/CursorFollower";
import './global.css'


const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  
});

export const metadata: Metadata = {
  title: "O'Mara Technology & Design",
  description:
    "Digital Product Strategy, Design, and Development - Mobile Apps, Websites, E-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: "0px", backgroundColor: "#EDE1CC" }}>
      <head></head>
      <body className={archivo.className} style={{ margin: "0px", cursor: "none" }}>
        <CursorFollower /> {/* Add this component */}
        <header style={{ padding: "12px 24px" }}>
          <Image src="/monogram.png" width={52} height={60} alt="Logo" />
        </header>
        {children}
      </body>
    </html>
  );
}
