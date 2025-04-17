import FooterContact from "@/app/components/FooterContact";
import { Project } from "@/app/components/Project";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import styles from "../../../styles/project.module.css"
import Image from "next/image";
import type { Metadata } from "next";
import { BreadcrumbJsonLd, OrganizationJsonLd } from "next-seo";

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
    title: `${project.seo.title || project.title} | O‘Mara Technology & Design}`,
    description:
      "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
    alternates: {
      canonical: `https://omaratechnologydesign.com/portfolio/${project.slug}`,
    },
    openGraph: {
      title: `${project.seo.title || project.title} | O‘Mara Technology & Design}`,
      description:
        "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
      url: `https://omaratechnologydesign.com/portfolio/${project.slug}`,
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

  if (!project) return baseMetadata;

  const ogImage = project.seo.image
    ? {
      url: urlFor(project.seo.image).width(1200).height(630).url(),
      width: 1200,
      height: 630,
    }
    : {
      url: `/api/og?id=${project._id}`,
      width: 1200,
      height: 630,
    };

  return {
    ...baseMetadata,
    title: project.seo.title || baseMetadata.title,
    description: project.seo.description || baseMetadata.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: project.seo.title || baseMetadata.openGraph?.title,
      description: project.seo.description || baseMetadata.openGraph?.description,
      images: [ogImage],
    },
    robots: project.seo.noIndex ? "noindex" : undefined,
  };
}

export default async function Page({ params }: RouteProps) {
  const { data: project } = await getProject(params);

  return project?.body ? (
    <>
      <div className={styles.cardImageContainer}  >
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />
        {project.image?.asset?._ref && (
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
      </div >
      <div className={styles.cardImageContainerBlock} />
      <main className="standardPageContainer" style={{ paddingTop: "0px" }}>
        <div className="standardPageWrapper">
          <Project {...project} />
          <FooterContact />
        </div>
      </main>
    </>


  ) : null;
}