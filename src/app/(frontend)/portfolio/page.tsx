// app/(frontend)/portfolio/page.tsx

import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

import FooterContact from "@/app/components/FooterContact";
import ProjectsSection from "@/app/components/ProjectsSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | O‘Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/portfolio",
  },
  openGraph: {
    title: "Portfolio | O’Mara Technology",
    description: "Product design and technical development strategy and services",
    url: "https://omaratechnology.com/portfolio",
    siteName: "O‘Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O‘Mara Technology",
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