import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import styles from "../../styles/services.module.css";
import FooterContact from "@/app/components/FooterContact";

export default async function Page() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category?.title || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        order: Number(service.category?.order) || 0,
        services: [],
      };
    }
    acc[category].services.push(service);
    return acc;
  }, {} as Record<string, { order: number; services: typeof services }>);

  const sortedCategories = Object.entries(servicesByCategory).sort(
    ([, a], [, b]) => a.order - b.order
  );

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">SERVICES</h1>

        <p className={styles.subtitle}>
          We help businesses build smart, scalable digital products. Whether you need a fractional leader, a full design system, or a scalable app, we step in and make it happen.
        </p>
        <p className={styles.subtitle} style={{ marginBottom: "calc(2.4em - 24px)" }}>
          We don't focus on commoditized solutions. We get to understand your business, your users, and your goals – then work with you to design and build what you need.
        </p>

        {sortedCategories.map(([categoryTitle, { services }]) => (
          <section key={categoryTitle} className={styles.servicesCategorySection}>
            <h2 className={styles.servicesCategoryTitle}>{categoryTitle}</h2>
            <div className={styles.servicesWrapper}>
              {services.map((service) => (
                <Link
                  key={service._id}
                  className={styles.servicesCard}
                  href={`/services/${service.slug?.current}`}
                >
                  <div className={styles.serviceCardInfo}>
                    <div className={styles.serviceCardTitle}>{service.title}</div>
                    <div className={styles.serviceCardDescription}>{service.overview}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}


        <FooterContact />
      </div>
    </main>
  );
}
