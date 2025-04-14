// components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import styles from "../styles/portfolio.module.css"

export default function ProjectCard({ project }: { project: any }) {
  // Get the first line of body text if available
  const firstBodyText =
    project.body?.[0]?.children?.[0]?.text ||
    "No description available";

  // First try to find an image - check multiple possible locations
  const getProjectImage = () => {
    // Possible locations where images could be stored
    if (project.image?.asset) return project.image;
    if (project.mainImage?.asset) return project.mainImage;

    // Check inside body for image type
    const bodyImage = project.body?.find((item: any) => item._type === "image");
    if (bodyImage?.asset) return bodyImage;

    // Fallback to SEO image
    if (project.seo?.image?.asset) return project.seo.image;

    return null;
  };

  const projectImage = getProjectImage();

  return (
    <Link href={`/portfolio/${project?.slug?.current}`} className={styles.cardContainer}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardImageContainer}>
          <div className={styles.cardImageScreen} />
          <div className={styles.cardImageMultiply} />
          {project.image?.asset?._ref && (
            <div className={styles.cardImage}>
              <Image
                src={urlFor(projectImage).url()}
                alt={project.image.alt || project.title}
                layout="fill"
                objectFit="cover"
                className={styles.cardImageTwo}
              />
            </div>
          )}
        </div>
        <div className={styles.cardInfoWrapper}>
          <h2 className={styles.cardTitle}>{project.title}</h2>
          <p className={styles.cardBody}>{firstBodyText}</p>
        </div>
      </div>
    </Link>
  );
}