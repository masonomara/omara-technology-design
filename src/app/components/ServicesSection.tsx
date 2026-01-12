// src/app/components/ServicesSection.tsx

"use client";

import Link from "next/link";
import styles from "../styles/services.module.css";
import { SERVICES_QUERYResult } from "@/sanity/types";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";

interface ServicesSectionProps {
  services: SERVICES_QUERYResult;
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const servicesByCategory = services.reduce(
    (acc, service) => {
      const category = service.category?.title || "Uncategorized";
      if (!acc[category]) {
        acc[category] = {
          order: Number(service.category?.order) || 0,
          services: [],
        };
      }
      acc[category].services.push(service);
      return acc;
    },
    {} as Record<string, { order: number; services: typeof services }>
  );

  const sortedCategories = Object.entries(servicesByCategory).sort(
    ([, a], [, b]) => a.order - b.order
  );

  return (
    <>
      <motion.h1
        variants={textFadeUp("up", "spring", 0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className="title"
      >
        SERVICES
      </motion.h1>
      <motion.div
        variants={textFadeUpSmall("up", "spring", 0.1, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        <p className={styles.subtitle}>
          Available for product design and technical development strategy and
          services. Pricing determined by hourly rate.
        </p>
      </motion.div>
      {sortedCategories.map(([categoryTitle, { services }]) => (
        <section key={categoryTitle} className={styles.servicesCategorySection}>
          <motion.h2
            variants={textFadeUpSmall("up", "spring", 0.2, 0.8)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            className={styles.servicesCategoryTitle}
          >
            {categoryTitle}
          </motion.h2>
          <div className={styles.servicesWrapper}>
            {services.map((service) => (
              <motion.div
                key={service._id}
                variants={fadeInButton("up", "spring", 0.4, 1.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
              >
                <Link
                  className={styles.servicesCard}
                  href={`/services/${service.slug?.current}`}
                >
                  <div className={styles.serviceCardInfo}>
                    <div className={styles.serviceCardTitle}>
                      {service.title}
                    </div>
                    <div className={styles.serviceCardDescription}>
                      {service.overview && (
                        <PortableText value={service.overview} />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
