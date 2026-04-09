import FooterContact from "@/app/components/FooterContact";
import { Project } from "@/app/components/Project";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import styles from "../../../styles/project.module.css";
import Image from "next/image";
import type { Metadata } from "next";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getProject = async (params: RouteProps["params"]) =>
  sanityFetch({
    query: PROJECT_QUERY,
    params: await params,
  });

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { data: project } = await getProject(params);

  const baseMetadata: Metadata = {
    title: `${project?.seo?.title || project?.title || "Project"} | O‘Mara Technology}`,
    description:
      "Product design and technical development strategy and services",
    alternates: {
      canonical: `https://omaratechnology.com/portfolio/${project?.slug || ""}`,
    },
    openGraph: {
      title: `${project?.seo?.title || project?.title || "Project"} | O‘Mara Technology}`,
      description:
        "Product design and technical development strategy and services",
      url: `https://omaratechnology.com/portfolio/${project?.slug || ""}`,
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

  if (!project) return baseMetadata;

  const ogImage = project?.seo?.image
    ? {
        url: urlFor(project?.seo?.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      }
    : {
        url: `/api/og?id=${project?._id}`,
        width: 1200,
        height: 630,
      };

  return {
    ...baseMetadata,
    title: project?.seo?.title || baseMetadata.title,
    description: project?.seo?.description || baseMetadata.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: project?.seo?.title || baseMetadata.openGraph?.title,
      description:
        project?.seo?.description || baseMetadata.openGraph?.description,
      images: [ogImage],
    },
    robots: project?.seo.noIndex ? "noindex" : undefined,
  };
}

export default async function Page({ params }: RouteProps) {
  const { data: project } = await getProject(params);

  if (!project?.body) return null;

  return (
    <>
      <div className={styles.cardImageContainer}>
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />
        {project?.image?.asset?._ref && (
          <div className={styles.cardImage}>
            <Image
              src={urlFor(project.image).url()}
              alt={project.image.alt || project.title || "Project image"}
              layout="fill"
              objectFit="cover"
              className={styles.cardImageTwo}
            />
          </div>
        )}
      </div>
      <div className={styles.cardImageContainerBlock} />
      <main className="standardPageContainer" style={{ paddingTop: "0px" }}>
        <div className="standardPageWrapper">
          <Project {...project} />
          <FooterContact />
        </div>
      </main>
    </>
  );
}
