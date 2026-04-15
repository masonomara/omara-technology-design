"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { textFadeUp, textFadeUpSmall } from "../lib/motion";
import type { getServicesData } from "@/lib/content";
import styles from "./ServicesSection.module.css";

type ServicesData = ReturnType<typeof getServicesData>;
type Engagement = ServicesData["engagements"][number];

interface ServicesSectionProps {
  data: ServicesData;
}

const viewport = { once: true, amount: 0.15 } as const;

export default function ServicesSection({ data }: ServicesSectionProps) {
  const [active, setActive] = useState<string>(data.engagements[0].id);
  const current = data.engagements.find(
    (e: Engagement) => e.id === active,
  ) as Engagement;

  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="title"
        style={{ marginBottom: 0 }}
      >
        SERVICES
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        <p className={styles.intro}>
          Every product moves through four phases: discovery, design,
          development and launch. We lead or work embedded within your team to
          help your product along every step of the way.
        </p>
        <p className={styles.introMeta}>
          We offer two types of engagements with clients, one time projects and
          partnerships. One-time projects cover one product development cycle
          through launch. Partnerships cover multiple iterative cycles plus
          maintenance. Often our one-time projects turn into partnerships.
        </p>
      </motion.div>

      <motion.h2
        className={styles.sectionHeading}
        variants={textFadeUpSmall(0.1, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        Engagements
      </motion.h2>

      <motion.div
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={styles.toggle}
      >
        {data.engagements.map((e: Engagement) => (
          <button
            key={e.id}
            className={`${styles.toggleButton} ${active === e.id ? styles.toggleActive : ""}`}
            onClick={() => setActive(e.id)}
          >
            {e.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        key={active}
        variants={textFadeUpSmall(0, 0.35)}
        initial="hidden"
        animate="show"
        className={styles.engagementContent}
      >
        {current.description.split("\n\n").map((para, i) => (
          <p key={i} className={styles.engagementDescription}>
            {para}
          </p>
        ))}

        <div className={styles.timeline}>
          {current.timeline.phases.map((phase, i) => (
            <div
              key={phase.name}
              className={`${styles.timelinePhase} ${i === current.timeline.phases.length - 1 ? styles.timelinePhaseLast : ""}`}
            >
              <div className={styles.timelinePhaseHeader}>
                <span className={styles.timelinePhaseName}>{phase.name}</span>
                <span className={styles.timelinePhaseDuration}>
                  {phase.duration}
                </span>
              </div>
              <p className={styles.timelineMilestones}>
                {phase.milestones.join(", ")}
              </p>
            </div>
          ))}
          {"total" in current.timeline && current.timeline.total && (
            <p className={styles.timelineTotal}>{current.timeline.total}</p>
          )}
        </div>
      </motion.div>

      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={styles.servicesSection}
      >
        <h2 className={styles.sectionHeading}>How We Work</h2>
        <div className={styles.servicesBody}>
          <p>
            We offer free 20-minute intro calls to see if we are a good fit. If
            not, we&apos;ll try to point you in the right direction. If so, we
            will schedule an hour-long discovery and scoping session. After
            that, we will send a proposal that outlines the rest of the
            discovery phase and a brief overview of the design, development, and
            launch.
          </p>
          <p>
            There is an initial deposit that covers the remainder of the
            discovery phase. We learn more about whether the problem is real,
            who we are solving the problem for, and possible solutions. If we
            find something we don&apos;t like, we have an opportunity to
            reevaluate before committing to a design and build. We are not
            committed to telling you what you want to hear — we will be
            constructive and honest. If we want to move forward, it is an idea
            we stand behind.
          </p>
          <p>
            Every product goes through the same development cycle phases — idea,
            discovery, design, build, launch — then back around.
          </p>
          <p>
            Design is where the idea crystallizes with mockups, prototypes,
            architecture decisions, and specification documents for
            stakeholders, agents, and teammates. Build is when the code gets
            written. AI has made the build phase faster, which means discovery
            and design have more leverage than they used to. Better thinking up
            front means better development.
          </p>
          <p>
            One-time projects cover one product development cycle through
            launch. Partnerships cover multiple iterative cycles plus
            maintenance. Often our one-time projects turn into partnerships.
          </p>
        </div>
        <Link href="/contact" className={styles.ctaLink}>
          Get in touch
        </Link>
      </motion.section>

      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={styles.pricingSection}
      >
        <h2 className={styles.sectionHeading}>Pricing</h2>
        <div className={styles.pricingBody}>
          <p>
            Consider our initial 20-minute intro call a free consultation. We
            want to find out if we are a good fit, or point you in the right
            direction if not.
          </p>
          <p>
            We aim for our discovery phase deposit to be 7.5% of our initial
            project estimate. Once we commit to a design and build, we require a
            second deposit and then monthly payments tied to deliverables, and a
            final payment upon launch.
          </p>
          <p>
            One-time projects typically range from $5,000 to $60,000 depending
            on scope and complexity. Ongoing partnerships typically run
            $3,500–$10,000 per month.
          </p>
        </div>
        <Link href="/about" className={styles.ctaLink}>
          Learn more
        </Link>
      </motion.section>
    </>
  );
}
