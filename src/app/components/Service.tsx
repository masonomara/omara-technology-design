
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types"; // Update path if needed
import { Title } from "./Title";
import { RelatedServices } from "./RelatedServices";

export function Service(props: NonNullable<SERVICE_QUERYResult>) {
  const { _id, title, body, category, relatedServices } = props;

  return (
    <article>
      <header>
        <div>
        </div>
        <Title>{title}</Title>
      </header>

      {body ? (
        <div>
          <PortableText value={body} components={components} />
          {relatedServices && relatedServices.length > 0 && (
            <RelatedServices
              relatedServices={relatedServices}
              documentId={_id}
              documentType="service"
            />
          )}
        </div>
      ) : null}
    </article>
  );
}