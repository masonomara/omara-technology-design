import FooterContact from "@/app/components/FooterContact";
import { Service } from "@/app/components/Service";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";

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

  const baseMetadata: Metadata = {
    title: `${service?.seo?.title || service?.title || "Service"} | O‘Mara Technology}`,
    description:
      "Product design and technical development strategy and services",
    alternates: {
      canonical: `https://omaratechnology.com/services/${service?.slug || ""}`,
    },
    openGraph: {
      title: `${service?.seo?.title || service?.title || "Service"} | O‘Mara Technology}`,
      description:
        "Product design and technical development strategy and services",
      url: `https://omaratechnology.com/services/${service?.slug || ""}`,
      siteName: "O‘Mara Technology",
      images: [
        {
          url: "https://omaratechnology.com/bizCard.png",
          width: 1200,
          height: 686,
          alt: "O‘Mara Technology",
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };

  if (!service) return baseMetadata;

  const ogImage = service?.seo?.image
    ? {
        url: urlFor(service?.seo?.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      }
    : {
        url: `/api/og?id=${service?._id}`,
        width: 1200,
        height: 630,
      };

  return {
    ...baseMetadata,
    title: service?.seo.title || baseMetadata.title,
    description: service?.seo.description || baseMetadata.description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: service?.seo.title || baseMetadata.openGraph?.title,
      description:
        service?.seo.description || baseMetadata.openGraph?.description,
      images: [ogImage],
    },
    robots: service?.seo.noIndex ? "noindex" : undefined,
  };
}

export default async function Page({ params }: RouteProps) {
  const { data: service } = await getService(params);

  if (!service?.body) return null;

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <Service {...service} />
        <FooterContact />
      </div>
    </main>
  );
}
