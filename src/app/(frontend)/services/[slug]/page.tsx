import { Service } from "@/app/components/Service";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import Image from "next/image";

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

  if (!service) {
    return {}
  }

  const metadata: Metadata = {
    title: service.seo.title,
    description: service.seo.description,
  };

  if (service.seo.image) {
    metadata.openGraph = {
      images: {
        url: urlFor(service.seo.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      },
    };
  }

  metadata.openGraph = {
    images: {
      url: service.seo.image
        ? urlFor(service.seo.image).width(1200).height(630).url()
        : `/api/og?id=${service._id}`,
      width: 1200,
      height: 630,
    },
  };

  if (service.seo.noIndex) {
    metadata.robots = "noindex";
  }

  return metadata;
}

export default async function Page({ params }: RouteProps) {
  const { data: service } = await getService(params);

  return service?.body ? (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <title>{service.seo.title}</title>
        <Service {...service} />
        <div className="companyTitle">
          <Image src="/longWordmark.svg" height={12} width={208} alt="O’Mara Technology & Design" className="companyTitleImage" />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O’Mara Technology & Design" className="companyTitleImageCondensed" />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O’Mara Technology & Design" className="companyTitleImageSuperCondensed" />
        </div>
      </div>
    </main>
  ) : null;
}