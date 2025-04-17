import FooterContact from "@/app/components/FooterContact";
import { Project } from "@/app/components/Project";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import styles from "../../../styles/project.module.css"
import Image from "next/image";

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

  if (!project) {
    return {}
  }

  const metadata: Metadata = {
    title: project.seo.title,
    description: project.seo.description,
  };

  if (project.seo.image) {
    metadata.openGraph = {
      images: {
        url: urlFor(project.seo.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      },
    };
  }

  metadata.openGraph = {
    images: {
      url: project.seo.image
        ? urlFor(project.seo.image).width(1200).height(630).url()
        : `/api/og?id=${project._id}`,
      width: 1200,
      height: 630,
    },
  };

  if (project.seo.noIndex) {
    metadata.robots = "noindex";
  }

  return metadata;
}

export default async function Page({ params }: RouteProps) {
  const { data: project } = await getProject(params);

  return project?.body ? (
    <>
      {/* <div style={{
        position: "absolute",
        width: "100%",
        height: "40vh",
        maxHeight: "300px",
        backgroundColor: "blue",
        backgroundPosition: "center",
        backgroundImage: project.image ? `url(${urlFor(project.image).url()})` : "none"
      }} >

      </div> */}

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


      <div className={styles.cardImageContainerBlock}
/>
      <main className="standardPageContainer" style={{ paddingTop: "0px" }}>

        <div className="standardPageWrapper">
          <h1 className="title">{project.seo.title || project.title}</h1>
          <div className="projectWrapper">
            <Project {...project} />
          </div>

          <FooterContact />
        </div>
      </main>
    </>


  ) : null;
}