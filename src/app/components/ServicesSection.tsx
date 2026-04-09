// src/app/components/ServicesSection.tsx

"use client";

import styles from "../styles/services.module.css";
import { motion } from "framer-motion";
import { textFadeUp, textFadeUpSmall } from "../lib/motion";

const servicesData = [
  {
    title: "Product design strategy",
    description:
      "Available in monthly or extended engagements. Includes product design services, technical strategy, and technical development services.",
    items: [
      "Discovery & Scoping",
      "User Research & Interviews",
      "Competitor Audits",
      "Market Positioning",
      "Information Architecture",
      "Product Roadmaps",
      "Feature Prioritization",
      "Algorithm Design",
      "Gamification Strategy",
      "Onboarding Planning",
    ],
  },
  {
    title: "Product design services",
    description:
      "Available for ad-hoc work. Includes software development services.",
    items: [
      "Wireframing",
      "Interface Design",
      "Accessible Design",
      "Responsive Design",
      "Design Systems",
      "Prototyping",
      "Technical Writing",
      "Content Strategy",
      "CMS Architecture",
    ],
  },
  {
    title: "Technical development strategy",
    description:
      "Available in monthly or extended engagements. Includes technical development services.",
    items: [
      "System Architecture",
      "Database Design",
      "API Design",
      "Authentication & Row Level Security",
      "Real-time Infrastructure",
      "AI & RAG Architecture",
      "MCP Server Design",
      "Payment System Planning",
      "Analytics Strategy",
      "Deployment & DevOps Planning",
    ],
  },
  {
    title: "Technical development services",
    description: "Available for ad-hoc work.",
    items: [
      "React & Next.js Development",
      "React Native Mobile Apps",
      "PostgreSQL & Supabase",
      "Cloudflare Workers & Durable Objects",
      "Stripe Integration",
      "Real-time Chat & Notifications",
      "Headless CMS Implementation",
      "PostHog Analytics Setup",
      "Vercel Deployment",
      "MCP Server Development",
    ],
  },
  {
    title: "Supplementary services",
    description:
      "Services to trusted partners available in strategy engagements.",
    items: [
      "Content Creation",
      "Graphic Design",
      "Shopify Storefronts",
      "Marketing Sites",
      "Workflow Automations",
      "Social Media Setup",
      "SEO Optimization",
    ],
  },
];

export default function ServicesSection() {
  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className="title"
      >
        SERVICES
      </motion.h1>
      <motion.div
        variants={textFadeUpSmall(0.1, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        <p className={styles.subtitle}>
          Available for product design and technical development strategy and
          services. Pricing determined by hourly rate.
        </p>
      </motion.div>
      {servicesData.map((category, index) => (
        <motion.div
          key={category.title}
          variants={textFadeUpSmall(0.2 + index * 0.1, 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
          className={styles.servicesDataWrapper}
        >
          <div className={styles.servicesCategoryHeader}>
            <h3 className={styles.servicesCategoryTitle}>{category.title} </h3>
            <p className={styles.servicesCategoryDescription}>
              {category.description}
            </p>
          </div>
          <p className={styles.servicesList}>{category.items.join(", ")}</p>
        </motion.div>
      ))}
    </>
  );
}
