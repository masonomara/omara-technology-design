import FooterContact from "@/app/components/FooterContact";
import { Service } from "@/app/components/Service";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/lib/queries";
import type { Metadata } from "next";
// import { BreadcrumbJsonLd, OrganizationJsonLd } from "next-seo";


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
    title: `${service?.seo?.title || service?.title || "Service"} | O‘Mara Technology & Design}`,
    description:
      "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
    alternates: {
      canonical: `https://omaratechnologydesign.com/services/${service?.slug || ""}`,
    },
    openGraph: {
      title: `${service?.seo?.title || service?.title || "Service"} | O‘Mara Technology & Design}`,
      description:
        "Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools by O'Mara Technology & Design.",
      url: `https://omaratechnologydesign.com/services/${service?.slug || ""}`,
      siteName: "O‘Mara Technology & Design",
      images: [
        {
          url: "https://omaratechnologydesign.com/bizCard.png",
          width: 1200,
          height: 686,
          alt: "O‘Mara Technology & Design",
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
      description: service?.seo.description || baseMetadata.openGraph?.description,
      images: [ogImage],
    },
    robots: service?.seo.noIndex ? "noindex" : undefined,
  };
}

export default async function Page({ params }: RouteProps) {
  const { data: service } = await getService(params);

  return service?.body ? (
    <>
      {/* <OrganizationJsonLd
        type="ProfessionalService"
        name="O‘Mara Technology & Design"
        url="https://omaratechnologydesign.com"
        logo="https://omaratechnologydesign.com/monogramText.svg"
        email="connect@omaratechnologydesign.com"
        founder={{
          "@type": "Person",
          name: "Mason O‘Mara",
          sameAs: "https://masonomara.com",
        }}
        description="Strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools."
        images={["https://omaratechnologydesign.com/bizCard.png"]}
        serviceType={[
          "Strategy",
          "Design",
          "Development",
          "Fractional Business Leadership",
          "Digital Systems",
          "Custom Solutions",
          "Audits & Optimization",
          "Product Consulting",
          "Fractional Technology Leadership",
          "App Design",
          "Website Design",
          "Ecommerce Design",
          "Brand Identity",
          "App Development",
          "Website Development",
          "Ecommerce Development",
        ]}
        hasOfferCatalog={{
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Fractional Business Leadership",
                url: "https://omaratechnologydesign.com/services/fractional-business-leadership",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Digital Systems",
                url: "https://omaratechnologydesign.com/services/digital-systems",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Custom Solutions",
                url: "https://omaratechnologydesign.com/services/custom-solutions",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Audits & Optimization",
                url: "https://omaratechnologydesign.com/services/audits-and-optimization",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Product Consulting",
                url: "https://omaratechnologydesign.com/services/product-consulting",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Fractional Technology Leadership",
                url: "https://omaratechnologydesign.com/services/fractional-technology-leadership",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "App Design",
                url: "https://omaratechnologydesign.com/services/app-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Website Design",
                url: "https://omaratechnologydesign.com/services/website-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Ecommerce Design",
                url: "https://omaratechnologydesign.com/services/ecommerce-design",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Brand Identity",
                url: "https://omaratechnologydesign.com/services/brand-identity",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "App Development",
                url: "https://omaratechnologydesign.com/services/app-development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Website Development",
                url: "https://omaratechnologydesign.com/services/website-development",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Ecommerce Development",
                url: "https://omaratechnologydesign.com/services/ecommerce-development",
              },
            },
          ],
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://omaratechnologydesign.com",
          },
          {
            position: 2,
            name: "Portfolio",
            item: "https://omaratechnologydesign.com/portfolio",
          },
          {
            position: 3,
            name: `${service.seo.title || service.title}`,
            item: `https://omaratechnologydesign.com/services/${service.slug}`,
          },
        ]}
      /> */}
      <main className="standardPageContainer">
        <div className="standardPageWrapper">
          <Service {...service} />
          <FooterContact />
        </div>
      </main>
    </>
  ) : null;
}