import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | O’Mara Technology",
  description:
    "Contact O’Mara Technology to book a free 20-minute intro call with Mason O’Mara about your mobile app, website, AI product, or software project.",
  alternates: {
    canonical: "https://omaratechnology.com/contact",
  },
  openGraph: {
    title: "Contact | O’Mara Technology",
    description:
      "Contact O’Mara Technology to book a free 20-minute intro call with Mason O’Mara about your mobile app, website, AI product, or software project.",
    url: "https://omaratechnology.com/contact",
    siteName: "O’Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O’Mara Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | O’Mara Technology",
    description:
      "Contact O’Mara Technology to book a free 20-minute intro call with Mason O’Mara about your mobile app, website, AI product, or software project.",
    images: ["https://omaratechnology.com/bizCard.png"],
  },
};

export default function Page() {
  return <ContactForm />;
}
