"use client";

import { motion } from "framer-motion";
import { fadeIn, textFadeUp, textFadeUpSmall } from "../lib/motion";
import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";

const CAPABILITIES = [
  {
    label: "Mobile Apps",
    body: "Cross-platform iOS and Android built in React Native. Real-time features, matching systems, custom algorithms, subscription payments, App Store and Google Play submission. Built to ship, not just to demo.",
  },
  {
    label: "Web Apps",
    body: "React and Next.js, full-stack. PostgreSQL, Supabase, authentication, real-time subscriptions, Stripe integration. Designed and built end-to-end, deployed on Vercel.",
  },
  {
    label: "AI Products",
    body: "RAG architecture, MCP server development, AI integration into existing products. Building things where AI is actually the feature — not bolted on as an afterthought.",
  },
  {
    label: "Ecommerce",
    body: "Shopify storefronts, custom Shopify development, Stripe, product flows, checkout design. For brands that need a store that works — and handles complexity without falling apart at the seams.",
  },
  {
    label: "Creative Design",
    body: "Interface design, design systems, visual direction, branding. The creative work stays here — not outsourced, not templated. Every product that goes through this studio gets original thinking.",
  },
  {
    label: "UX Research",
    body: "Discovery sessions, user interviews, competitor audits, information architecture. This is where most ideas should stop — and the ones that shouldn't come out the other side with a real direction.",
  },
  {
    label: "Product Development",
    body: "Strategy, roadmapping, feature prioritization, algorithm design, gamification, onboarding. From the first whiteboard session to a shipped product and everything the loop requires in between.",
  },
];

export default function About() {
  return (
    <>
      <motion.h1
        className="title"
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        About
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <p className={styles.ethos}>
          Everything changes faster than anyone can track. Tools, platforms,
          markets — constantly. What holds up is timeless thinking and
          creativity that meets the moment. That&apos;s what O&apos;Mara
          Technology is built around.
        </p>
        <p className={styles.identity}>
          O&apos;Mara Technology is{" "}
          <a
            href="https://masonomara.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mason O&apos;Mara
          </a>{" "}
          — a product designer and developer based in Asbury Park, NJ. We take
          on formal engagements for founders and teams building real products:
          mobile apps, web apps, AI products, and ecommerce experiences. Brought
          in through trusted partners for larger scopes.
        </p>
      </motion.div>

      <motion.div
        className={styles.engagementsSection}
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <h2 className={styles.sectionHeading}>How We Work</h2>
        <div className={styles.engagementsGrid}>
          <div className={styles.engagementType}>
            <h3>Strategic Engagements</h3>
            <p>
              Monthly. For products in motion or being formed. We work alongside
              you — research, architecture, design direction, prioritization,
              and iteration as the product develops. Not a project, a
              relationship.
            </p>
          </div>
          <div className={styles.engagementType}>
            <h3>Project Engagements</h3>
            <p>
              One-time. For new builds. Discovery, design, development, and
              launch — scoped before we start, payments at monthly milestones.
              At the end, you own it: documented, trained, yours to run.
            </p>
          </div>
        </div>
        <p className={styles.processNote}>
          Once we commit after discovery, everything is in motion. Creative
          design stays with Mason. Architecture and information design is Mason
          or someone he trusts. Development is Mason or collaborators he&apos;s
          worked with. Nothing gets handed off to strangers.
        </p>
        <Link href="/process" className={styles.processLink}>
          Full services and process at omaratechnology.com/process
        </Link>
      </motion.div>

      <motion.div
        className={styles.capabilitiesSection}
        variants={textFadeUpSmall(0.16, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
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
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className={styles.bioImageContainer}>
          <div className={styles.cardImageScreen} />
          <div className={styles.cardImageMultiply} />
          <div className={styles.cardImage}>
            <Image
              src="/siteHeadshot.png"
              alt="Headshot of Mason O'Mara"
              layout="fill"
              objectFit="cover"
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
            He moved from UX strategy into independent practice to do end-to-end
            work he cares about with teams he believes in. He writes about
            product and design on{" "}
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
      </motion.div>
    </>
  );
}
