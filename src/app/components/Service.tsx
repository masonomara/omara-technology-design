import { Author } from "./Author";
import { Categories } from "./Categories";
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types";
import { PublishedAt } from "./PublishedAt";
import { Title } from "./Title";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { RelatedServices } from "./RelatedServices";

export function Service(props: NonNullable<SERVICE_QUERYResult>) {
  const { _id, title, author, mainImage, body, publishedAt, categories, relatedServices } = props;

  return (
    <article>
      <header>
        <div>
          <Categories categories={categories} />
          <PublishedAt publishedAt={publishedAt} />
        </div>
        <Title>{title}</Title>
        <Author author={author} />
      </header>
      {mainImage ? (
        <figure>
          <Image
            src={urlFor(mainImage).width(400).height(400).url()}
            width={400}
            height={400}
            alt=""
          />
        </figure>
      ) : null}
      {body ? (
        <div>
          <PortableText value={body} components={components} />
          <RelatedServices
            relatedServices={relatedServices}
            documentId={_id}
            documentType="service"
          />
        </div>
      ) : null}
    </article>
  );
}