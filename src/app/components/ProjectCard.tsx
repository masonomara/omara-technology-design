import Image from "next/image";
import Link from "next/link";
import styles from "../styles/portfolio.module.css";
import type { ContentNode } from "@/lib/types";

interface ProjectCardProps {
  node: ContentNode;
  slug: string;
  thumbnail: string;
}

export default function ProjectCard({ node, slug, thumbnail }: ProjectCardProps) {
  return (
    <Link href={`/portfolio/${slug}`} className={styles.cardContainer}>
      <div className={styles.cardWrapper}>
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
        <div className={styles.cardInfoWrapper}>
          <h2 className={styles.cardTitle}>{node.name}</h2>
          <p className={styles.cardBody}>{node.description ?? ""}</p>
        </div>
      </div>
    </Link>
  );
}
