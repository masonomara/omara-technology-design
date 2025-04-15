// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import { SERVICE_QUERYResult } from "@/sanity/types";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/services.module.css"

export default async function Page() {

  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">SERVICES</h1>
        <p className={styles.subtitle}>
          We help businesses build smart, scalable digital products. Whether you need a fractional leader, a full design system, or a scalable app, we step in and make it happen.
        </p>
        <p className={styles.subtitle}>
          We don’t focus on commoditized solutions. We get to understand your business, your users, and your goals - then work with you to design and build what you need.
        </p>
        <div className={styles.servicesWrapper}>
          {services.map((service: NonNullable<SERVICE_QUERYResult>) => (
            <div key={service._id}>
              <Link
                className={styles.servicesCard}
                href={`/services/${service?.slug?.current}`}
              >
                <div className={styles.serviceCardTitle}>{service?.title}</div>
                <div className={styles.serviceCardDescription}>{service?.overview}</div>
              </Link>
            </div>
          ))}
        </div>
        <div className="companyTitle">
          <Image src="/longWordmark.svg" height={12} width={208} alt="O’Mara Technology & Design" className="companyTitleImage" />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O’Mara Technology & Design" className="companyTitleImageCondensed" />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O’Mara Technology & Design" className="companyTitleImageSuperCondensed" />
        </div>
      </div>
    </main>
  );
}
