// app/(frontend)/portfolio/page.tsx

import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

import FooterContact from "@/app/components/FooterContact";
import ProjectsSection from "@/app/components/ProjectsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | O‘Mara Technology & Design",
  description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O’Mara Technology & Design.",
  alternates: {
    canonical: "https://omaratechnologydesign.com/portfolio",
  },
  openGraph: {
    title: "Portfolio | O’Mara Technology & Design",
    description: "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O’Mara Technology & Design.",
    url: "https://omaratechnologydesign.com/portfolio",
    siteName: "O‘Mara Technology & Design",
    images: [
      {
        url: "https://omaratechnologydesign.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O‘Mara Technology & Design",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function Page() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ProjectsSection projects={projects} />
        <FooterContact />
      </div>
    </main>
  );
}