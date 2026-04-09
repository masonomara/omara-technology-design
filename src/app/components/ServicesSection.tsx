"use client";

import styles from "../styles/services.module.css";
import { motion } from "framer-motion";
import { textFadeUp, textFadeUpSmall } from "../lib/motion";
import type { ContentNode } from "@/lib/types";

interface ServicesSectionProps {
  services: ContentNode[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="title"
      >
        SERVICES
      </motion.h1>
      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <p className={styles.subtitle}>
          Available for product design and technical development strategy and
          services. Pricing determined by hourly rate.
        </p>
      </motion.div>
      {services.map((category, index) => (
        <motion.div
          key={category.name}
          variants={textFadeUpSmall(0.08 + index * 0.05, 0.4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={styles.servicesDataWrapper}
        >
          <div className={styles.servicesCategoryHeader}>
            <h3 className={styles.servicesCategoryTitle}>{category.name}</h3>
            <p className={styles.servicesCategoryDescription}>
              {category.description}
            </p>
          </div>
          <p className={styles.servicesList}>
            {(category.items ?? []).join(", ")}
          </p>
        </motion.div>
      ))}
    </>
  );
}
