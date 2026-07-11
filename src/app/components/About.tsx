"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn, textFadeUp, textFadeUpSmall } from "../lib/motion";
import styles from "./About.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    label: "Mobile Apps",
    body: "Full-stack design, development and cross platform launches on the App Store for iOS and Google Play store for Android using React Native including features such as real-time updates, chat, subscriptions, payments, and custom features.",
  },
  {
    label: "Websites",
    body: "Custom accessible and discoverable web apps and creative websites designed, built, and deployed securely. Typically built with Next.js, PostgreSQL, and Supabase complete with auth, realtime, payments, and content management.",
  },
  {
    label: "Applied AI",
    body: "Digital solutions built around AI such as vector databases, RAG, product rule design, LLM training, MCP server and client development, algorithm design, and integrating non-deterministic LLM processes into existing products and software.",
  },
  {
    label: "Ecommerce",
    body: "Custom Shopify theme development, creative design, implementing e-commerce best practices, third-party management integrations. For brands that need a creative or complex storefronts that can be managed independently and reliably.",
  },
  {
    label: "Creative Design",
    body: "From speaking to shareholders and users to mocking up Interfaces, developing design systems, visual direction, and brand. All creative work is done in-house with technical specs ready for handoff. Unique and designed for your users.",
  },
  {
    label: "UX Research",
    body: "Leading discovery sessions, user interviews, competitor audits, building out information architecture, and developing context framework. This is foundational and iterative research that decides what is to be built and what can be improved.",
  },
  {
    label: "Product Development",
    body: "Leading and managing project strategy, roadmaps, prioritizing features, creating gamification strategy, creative to technical handoffs, shareholder-ready technical writing and presentations, and iterating what features can be better.",
  },
  {
    label: "Project Management",
    body: "We are a generation on constant change. Tools, platforms, and markets all move faster than anyone can track. We believe success is built on embracing timeless solutions and applying them with modern frameworks and technology.",
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
        animate="show"
        style={{ marginBottom: 0 }}
      >
        About
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        animate="show"
        style={{ display: "flex", maxWidth: "740px", alignItems: "center", justifyContent: "flex-start", flexDirection: "column"}}
      >
        <p className={styles.identity}>
          O’Mara Technology is a digital studio led by{" "}
          <a
            href="https://masonomara.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mason O’Mara
          </a>
          , a creative technologist based out of Los Angeles, California. We lead or integrate with teams across end-to-end creative technical strategy and service from discovery to design, engineering, launch, and iteration across digital products, mobile apps, web apps, custom software, infrastructure, applied AI, and other creative solutions.
        </p>
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
                sizes="(max-width: 699px) 100vw, 340px"
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
