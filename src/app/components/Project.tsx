
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { PROJECT_QUERYResult } from "@/sanity/types"; // Update path if needed
import Link from "next/link";
import styles from "../styles/about.module.css";

export function Project(props: NonNullable<PROJECT_QUERYResult>) {
  const { body } = props;
  const emailAddress = 'connect@omaratechnologydesign.com'


  return (
    <article>
      {body ? (
        <div>
          <PortableText value={body} components={components} />
          <div className={styles.emailInfo}>
            Interested in working together?<br />
            EMAIL:{' '}
            <Link
              className={styles.emailLink}
              href={`mailto:${emailAddress}`}
              target="_blank"
            >
              connect@omaratechnologydesign.com
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  );
}