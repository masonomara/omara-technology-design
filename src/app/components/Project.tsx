
import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { PROJECT_QUERYResult } from "@/sanity/types"; // Update path if needed

export function Project(props: NonNullable<PROJECT_QUERYResult>) {
  const { _id, title, slug, body, seo } = props;

  return (
    <article>
      <header>
        <title>{seo?.title ?? title}</title>
      </header>

      {body ? (
        <div>
          <PortableText value={body} components={components} />
        </div>
      ) : null}
    </article>
  );
}