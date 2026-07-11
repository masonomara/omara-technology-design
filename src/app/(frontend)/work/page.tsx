import Footer from "@/app/components/Footer";
import ProjectsSection from "@/app/components/ProjectsSection";
import { getWorkItems, getThumbnail } from "@/lib/content";
import { toSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Work | O’Mara Technology",
  description:
    "See O’Mara Technology’s work — case studies across mobile apps, web apps, ecommerce, and AI products, taken from design through deployment.",
  alternates: {
    canonical: "https://omaratechnology.com/work",
  },
  openGraph: {
    title: "Work | O’Mara Technology",
    description:
      "See O’Mara Technology’s work — case studies across mobile apps, web apps, ecommerce, and AI products, taken from design through deployment.",
    url: "https://omaratechnology.com/work",
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
    title: "Work | O’Mara Technology",
    description:
      "See O’Mara Technology’s work — case studies across mobile apps, web apps, ecommerce, and AI products, taken from design through deployment.",
    images: ["https://omaratechnology.com/bizCard.png"],
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
        <Footer />
      </div>
    </main>
  );
}
