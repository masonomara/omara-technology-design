import Image from "next/image";
import Link from "next/link";
import styles from "./work.module.css";
import type { ContentNode } from "@/lib/types";

interface ProjectCardProps {
  node: ContentNode;
  slug: string;
  thumbnail: string;
  priority?: boolean;
}

export default function ProjectCard({
  node,
  slug,
  thumbnail,
  priority,
}: ProjectCardProps) {
  return (
    <Link href={`/work/${slug}`} className={styles.cardContainer}>
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
                sizes="(max-width: 549px) 100vw, (max-width: 899px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className={styles.cardImageTwo}
                priority={priority}
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
