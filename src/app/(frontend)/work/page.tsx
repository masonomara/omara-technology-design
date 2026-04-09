import FooterContact from "@/app/components/FooterContact";
import ProjectsSection from "@/app/components/ProjectsSection";
import { getWorkItems, getThumbnail } from "@/lib/content";
import { toSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Work | O'Mara Technology",
  description: "Product design and technical development strategy and services",
  alternates: {
    canonical: "https://omaratechnology.com/work",
  },
  openGraph: {
    title: "Work | O'Mara Technology",
    description:
      "Product design and technical development strategy and services",
    url: "https://omaratechnology.com/work",
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
  const items = getWorkItems();
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
