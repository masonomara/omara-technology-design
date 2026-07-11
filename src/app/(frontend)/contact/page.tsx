import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | O’Mara Technology",
  description:
    "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
  alternates: {
    canonical: "https://omaratechnology.com/contact",
  },
  openGraph: {
    title: "Contact | O’Mara Technology",
    description:
      "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
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
      "Digital studio led by Mason O'Mara for creative technical strategy and service including research, design, and development across digital products, mobile apps, websites, applied AI, software, and more creative solutions.",
    images: ["https://omaratechnology.com/bizCard.png"],
  },
};

export default function Page() {
  return <ContactForm />;
}
