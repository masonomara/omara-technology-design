"use client";

import { motion } from "framer-motion";
import { fadeIn, textFadeUp, textFadeUpSmall } from "../lib/motion";
import styles from "./About.module.css";
import Link from "next/link";

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
          O&apos;Mara Technology is a digital studio led by{" "}
          <a
            href="https://masonomara.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mason O&apos;Mara
          </a>
          , a creative technologist based out of Los Angeles, California. We lead or integrate with teams across end-to-end creative technical strategy and service from discovery to design, engineering, launch, and iteration across digital products, mobile apps, web apps, custom software, infrastructure, applied AI, and other creative solutions.
        </p>
        <p className={styles.introNote}>
          We are currently not accepting new clients but we’d still love to connect or for a free 20-minute consultation call.
        </p>
        <Link href="/contact" className={styles.ctaLink}>
          Contact Us
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
        className={styles.engagementsSection}
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <h2 className={styles.sectionHeading}>How We Work</h2>
        <p className={styles.servicesNote}>
          We lead or integrate within existing teams across the development lifecycle. WE work across discovery, research, design, development, launch, and iteration. We are committed to being constructive and honest rather than telling you what you want to hear. We handle all work internally or with partners we trust.

        </p>
        <div className={styles.engagementsGrid}>
          <div className={styles.engagementType}>
            <h3>One-Time Projects</h3>
            <p>
              Best for new products and features. Discovery, design, development, and launch and after final handoff you completely own the codebase, documentation, and training. One-time projects cover one development cycle from discover to launch through launch. Often our one-time projects turn into partnerships.

            </p>
          </div>
          <div className={styles.engagementType}>
            <h3>Partnerships</h3>
            <p>
              For new and existing products and software. Partnerships cover multiple iterative cycles plus maintenance. Engagements typically include research, architecture directions, design direction, prioritization, and iteration as the product develops.
            </p>
          </div>
        </div>

      </motion.div>



      <motion.div
        className={styles.bioSection}
        variants={fadeIn("up", 0.2, 0.5)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <h2 className={styles.sectionHeading}>Getting Started</h2>
        <div className={styles.bioContent}>
          <p className={styles.gettingStartedNote}>
            We offer a free 20 minute consultation calls to see if we are a good fit or point you in the right direction If not. From there we meet again to properly scope out remainder of project and create an outline of the discovery, design, build, and launch phases. Your first payment covers the discovery phase only so we can make sure the project solves a real problem and has a viable solution before committing further.
          </p>
          <Link href="/contact" className={styles.ctaLink}>
            Contact Us
          </Link>
        </div>
      </motion.div>
    </>
  );
}
