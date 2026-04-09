import FooterContact from "@/app/components/FooterContact";
import { Project } from "@/app/components/Project";
import {
  getWorkItems,
  getWorkNode,
  loadMarkdown,
  getImages,
  getThumbnail,
} from "@/lib/content";
import { toSlug } from "@/lib/slug";
import styles from "../../../styles/project.module.css";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const dynamicParams = false;

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWorkItems().map((node) => ({ slug: toSlug(node.name) }));
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const node = getWorkNode(slug);
  const title = node
    ? `${node.name} | O'Mara Technology`
    : "Work | O'Mara Technology";

  return {
    title,
    description:
      node?.description ??
      "Product design and technical development strategy and services",
    alternates: {
      canonical: `https://omaratechnology.com/work/${slug}`,
    },
    openGraph: {
      title,
      description:
        node?.description ??
        "Product design and technical development strategy and services",
      url: `https://omaratechnology.com/work/${slug}`,
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
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const node = getWorkNode(slug);

  if (!node) return null;

  const html = loadMarkdown(slug);
  const images = getImages(slug);
  const thumbnail = getThumbnail(slug);

  return (
    <>
      <div className={styles.cardImageContainer}>
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />
        {thumbnail && (
          <div className={styles.cardImage}>
            <Image
              src={thumbnail}
              alt={node.name}
              fill
              style={{ objectFit: "cover" }}
              className={styles.cardImageTwo}
            />
          </div>
        )}
      </div>
      <div className={styles.cardImageContainerBlock} />
      <main className="standardPageContainer" style={{ paddingTop: "0px" }}>
        <div className="standardPageWrapper">
          <Project
            title={node.name}
            html={html}
            images={images}
            tags={node.tags}
            description={node.description}
          />
          <FooterContact />
        </div>
      </main>
    </>
  );
}
