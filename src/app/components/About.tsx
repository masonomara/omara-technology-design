"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { fadeIn, textFadeUp, textFadeUpSmall } from "../lib/motion";
import styles from "./About.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    label: "Mobile Apps",
    body: "Cross-platform iOS and Android built in React Native. Real-time features, matching systems, custom algorithms, subscription payments, App Store and Google Play submission.",
  },
  {
    label: "Web Apps",
    body: "React and Next.js, full-stack. PostgreSQL, Supabase, authentication, real-time subscriptions, payment integrations, third-party and CRM integrations. Designed, built, and deployed end-to-end.",
  },
  {
    label: "AI Products",
    body: "RAG architecture, MCP server development, AI integration into existing products. AI/cloud infrastructure and production rules. Building products where AI is actually the feature — not bolted on as an afterthought.",
  },
  {
    label: "Ecommerce",
    body: "Custom Shopify theme development, creative design, best practices, multi-location inventory management, and integrations. For brands that need a store that handles complexity and can be managed independently.",
  },
  {
    label: "Creative Design",
    body: "Interface design, design systems, visual direction, branding, print design. The creative work stays here so designs work with the final product and we don't pass you on to a template. Art is cheap, taste is still valuable.",
  },
  {
    label: "UX Research",
    body: "Discovery sessions, user interviews, competitor audits, information architecture, context framework. The foundational and iterative research that decides what is going to be built.",
  },
  {
    label: "Product Development",
    body: "Strategy, roadmapping, feature prioritization, algorithm design, gamification, onboarding, investor-ready specifications. From the first whiteboard session to a launched product, and every loop in between.",
  },
  {
    label: "Trusted Partnerships:",
    body: "Content creation, graphic design, Shopify storefronts, marketing sites, workflow automations, social media setup, SEO — available through trusted partners we've worked with before when the scope of work calls for it.",
  },
];

const viewport = { once: true, amount: 0.15 } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <>
      <motion.h1
        className="title"
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ marginBottom: 0 }}
      >
        About
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexDirection: "column"}}
      >
        <p className={styles.ethos}>
          We are another generation of constant change. Tools, platforms,
          markets all move faster than anyone can track. We find success is
          built on exploring timeless solutions and applying them with
          creativity that meets the moment.
        </p>
        <p className={styles.identity}>
          O’Mara Technology is led by{" "}
          <a
            href="https://masonomara.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mason O’Mara
          </a>
          , a product designer and software engineer based in Asbury Park, NJ
          and operating remotely. We work with founders and teams on mobile
          apps, websites, AI products, and software. We handle all work
          internally or with partners we trust and have worked with before.
        </p>
      </motion.div>

      <motion.div
        className={styles.engagementsSection}
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <h2 className={styles.sectionHeading}>How We Work</h2>
        <div className={styles.engagementsGrid}>
          <div className={styles.engagementType}>
            <h3>One-Time Projects</h3>
            <p>
              For new products and features. Discovery, design, development, and
              launch all scoped before we start, with payments at monthly
              milestones along the way. At the end, you own the codebase,
              documentation, and training — the project is yours to operate.
            </p>
          </div>
          <div className={styles.engagementType}>
            <h3>Partnerships</h3>
            <p>
              For new and existing products and software. Iterative product
              development over a minimum three-month engagement where we work
              embedded or lead research, architecture directions, design
              direction, prioritization, and iteration as the product develops.
            </p>
          </div>
        </div>
        <p className={styles.servicesNote}>
          Every product goes through the same phases — idea, discovery, design,
          build, and launch. Both engagements help you work through and
          understand each phase. We start with a free 20-minute intro call.
          After discovery, there&apos;s an opportunity to reevaluate before
          committing to a full design and build.
        </p>
        <Link href="/services" className={styles.servicesLink}>
          Learn more
        </Link>
      </motion.div>

      <motion.div
        className={styles.capabilitiesSection}
        variants={textFadeUpSmall(0.16, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <h2 className={styles.sectionHeading}>What We Do</h2>
        <div className={styles.capabilitiesGrid}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.label} className={styles.capability}>
              <h3 className={styles.capabilityLabel}>{cap.label}</h3>
              <p className={styles.capabilityBody}>{cap.body}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={styles.bioSection}
        variants={fadeIn("up", 0.2, 0.5)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <h2 className={styles.sectionHeading}>Our Team</h2>
        <div className={styles.bioContent}>
          <div className={styles.bioImageContainer}>
            <div className={styles.cardImageScreen} />
            <div className={styles.cardImageMultiply} />
            <div className={styles.cardImage}>
              <Image
                src="/siteHeadshot.png"
                alt="Headshot of Mason O’Mara"
                fill
                style={{ objectFit: "cover" }}
                className={styles.cardImageTwo}
              />
            </div>
          </div>
          <div className={styles.bioText}>
            <p>
              Mason O’Mara is a product designer and software engineer. He&apos;s
              shipped iOS and Android apps, full-stack web platforms, Shopify
              storefronts, and AI-integrated tools across industries from yacht
              staffing to accessibility consulting to fashion retail.
            </p>
            <p>
              He moved from UX strategy into independent practice to do the work
              he cares about with teams he believes in. He writes about product
              and design on{" "}
              <a
                href="https://substack.com/@masonomara"
                target="_blank"
                rel="noopener noreferrer"
              >
                Substack
              </a>{" "}
              and documents builds on{" "}
              <a
                href="https://youtube.com/@masonomaratechnology"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
              . He&apos;s based in Asbury Park, NJ.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
