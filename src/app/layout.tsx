import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Overpass, Radio_Canada } from "next/font/google";
import CursorFollower from "./components/CursorFollower";

export const metadata: Metadata = {
  title: "O’Mara Technology",
  description:
    "Product design and development studio for apps, websites, and software.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
    <html
      lang="en"
      className={`${overpass.variable} ${radioCanada.variable} ${rallingtonSerif.variable}`}
      style={{ margin: "0px", backgroundColor: "#FCEEDE" }}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="O’Mara Technology" />
      </head>
      <body style={{ margin: "0px", position: "relative" }}>
        <CursorFollower />
        {children}
      </body>
    </html>
  );
}
