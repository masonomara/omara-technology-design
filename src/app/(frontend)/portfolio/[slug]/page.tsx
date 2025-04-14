
import { Project } from "@/app/components/Project";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";

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
    <main>
      <title>{project.seo.title}</title>
      <Project {...project} />
    </main>
  ) : null;
}