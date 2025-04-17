
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types"; // Update path if needed
import Link from "next/link";
import styles from "../styles/about.module.css";

// import { RelatedServices } from "./RelatedServices";

export function Service(props: NonNullable<SERVICE_QUERYResult>) {
  const { body } = props;
  const emailAddress = 'connect@omaratechnologydesign.com'


  return (
    <article>
      {body ? (
        <div>
          <PortableText value={body} components={components} />
          {/* {relatedServices && (
            <RelatedServices
              relatedServices={relatedServices}
              documentId={_id}
              documentType="service"
            />
          )} */}
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