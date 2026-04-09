import FooterContact from "@/app/components/FooterContact";
import ProjectsSection from "@/app/components/ProjectsSection";
import { getPortfolioItems, getThumbnail } from "@/lib/content";
import { toSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Portfolio | O'Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/portfolio",
  },
  openGraph: {
    title: "Portfolio | O'Mara Technology",
    description:
      "Product design and technical development strategy and services",
    url: "https://omaratechnology.com/portfolio",
    siteName: "O'Mara Technology",
    images: [
      {
        url: "https://omaratechnology.com/bizCard.png",
        width: 1200,
        height: 686,
        alt: "O'Mara Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  const items = getPortfolioItems();
  const projects = items.map((node) => {
    const slug = toSlug(node.name);
    return { node, slug, thumbnail: getThumbnail(slug) };
  });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ProjectsSection projects={projects} />
        <FooterContact />
      </div>
    </main>
  );
}
