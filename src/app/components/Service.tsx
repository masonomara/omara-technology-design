
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types"; // Update path if needed
// import { RelatedServices } from "./RelatedServices";

export function Service(props: NonNullable<SERVICE_QUERYResult>) {
  const { title, body, seo } = props;

  return (
    <article>
      <header>
        <title>{seo?.title ?? title}</title>
      </header>

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
        </div>
      ) : null}
    </article>
  );
}