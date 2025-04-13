import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getService = async (params: RouteProps["params"]) =>
  sanityFetch({
    query: SERVICE_QUERY,
    params: await params,
  });

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { data: service } = await getService(params);

  return {
    title: service.seo.title,
  };
}

export default async function Service({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: service } = await sanityFetch({
    query: SERVICE_QUERY,
    params: await params,
  });

  if (!service) {
    notFound();
  }

  return (
    <main>
      <title>{service.seo.title}</title>
      <Service {...service} />
    </main>
  );
}