"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  const current = data.engagements.find((e: Engagement) => e.id === active) as Engagement;

  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="title"
      >
        SERVICES
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <p className={styles.intro}>
          Two kinds of engagements. One-time projects and ongoing partnerships.
          Both start the same way.
        </p>
      </motion.div>

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
                <span className={styles.timelinePhaseDuration}>{phase.duration}</span>
              </div>
              <p className={styles.timelineMilestones}>{phase.milestones.join(", ")}</p>
              {"items" in phase && phase.items && (
                <p className={styles.phaseItems}>{phase.items.join(", ")}</p>
              )}
            </div>
          ))}
          <p className={styles.timelineOutcome}>{current.timeline.outcome}</p>
        </div>

        {current.note && (
          <p className={styles.engagementNote}>{current.note}</p>
        )}
      </motion.div>

      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={styles.servicesSection}
      >
        <h2 className={styles.sectionHeading}>How It Works</h2>
        <div className={styles.servicesBody}>
          <p>
            Every engagement starts the same way: a 20-minute call to see if
            it&apos;s worth a conversation, then a paid discovery phase where
            we ask the questions that actually matter.
          </p>
          <p>
            Every product goes through the same loop — idea, discovery, design,
            build — then back around. Discovery is where most ideas stop, and
            should. It&apos;s where we find out whether the problem is real,
            who actually has it, and whether someone&apos;s already solved it
            better.
          </p>
          <p>
            Design is when the idea crystallizes. Build is where the code gets
            written. AI is making the build cycle faster — which means
            discovery and design have more leverage than they used to. Better
            thinking up front compounds.
          </p>
          <p>
            For a one-time project, launch is a handoff — documented, trained,
            yours to run. For a partnership, launch is the beginning. The loop
            keeps going.
          </p>
        </div>
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
          <p>A 20-minute intro call is free. After that, nothing is.</p>
          <p>
            The first phase — discovery and planning — is required before any
            engagement starts. It&apos;s where we figure out what we&apos;re
            building, what it needs, and whether we&apos;re the right fit to
            build it together. No commitment beyond this phase is required to
            continue.
          </p>
          <p>
            One-time projects typically range from $4,000 to $60,000 depending
            on scope and complexity.
          </p>
          <p>Ongoing partnerships run $5,000–$10,000 per month.</p>
          <p>
            Both engagement types include design and development. Creative
            design stays with us. Architecture and development are handled by
            us or by collaborators we trust, depending on scope.
          </p>
        </div>
      </motion.section>
    </>
  );
}
