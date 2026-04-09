"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { textFadeUp, textFadeUpSmall } from "../lib/motion";
import styles from "../styles/services.module.css";
import type { getServicesData } from "@/lib/content";

type ServicesData = ReturnType<typeof getServicesData>;
type Engagement = ServicesData["engagements"][number];

interface ServicesSectionProps {
  data: ServicesData;
}

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
        <p className={styles.intro}>
          Everything changes fast. What holds up is better thinking at the
          start — products designed around a real problem, for a real person,
          with a clear reason to exist.
        </p>
        <p className={styles.introMeta}>
          We take on two kinds of engagements: one-time projects and ongoing
          partnerships. Both start the same way.
        </p>
      </motion.div>

      <motion.div
        variants={textFadeUpSmall(0.12, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
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

        <div className={styles.engagementCategories}>
          {current.categories.map((cat) => (
            <div key={cat.name} className={styles.servicesDataWrapper}>
              <div className={styles.servicesCategoryHeader}>
                <h3 className={styles.servicesCategoryTitle}>{cat.name}</h3>
              </div>
              <p className={styles.servicesList}>{cat.items.join(", ")}</p>
            </div>
          ))}
        </div>

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
          <p className={styles.timelineOutcome}>
            {current.timeline.outcome}
          </p>
        </div>

        {current.note && (
          <p className={styles.engagementNote}>{current.note}</p>
        )}
      </motion.div>

      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={styles.processSection}
      >
        <h2 className={styles.sectionHeading}>How It Works</h2>
        <div className={styles.processBody}>
          <p>
            We start by listening. Every engagement — whether it runs three
            months or three years — begins the same way: a 20-minute call to
            see if it&apos;s worth a conversation, then a paid discovery phase
            where we ask the questions that actually matter.
          </p>
          <p>
            Every product goes through the same loop. An idea, then discovery,
            then design, then build — then back around. The job is
            understanding where you are in the loop and what it needs next.
          </p>
          <p>
            Discovery is where most ideas stop — and should. This is where we
            find out what we actually don&apos;t know: who the real user is,
            what the actual problem is, whether someone&apos;s already solved
            it better. We put the idea in front of as many people as possible.
            We listen to how they describe their own problem, not just what
            they say about the solution. We research competitors — what did
            they do well, what can we learn from, where did they fail? We
            document what we learn and what we still don&apos;t understand.
            Both come back around.
          </p>
          <p>
            Design is when the idea crystallizes. Defining who we&apos;re
            building for. Communicating it clearly to everyone who needs to
            build it with us. These are real decisions made for real reasons,
            not templates filled in.
          </p>
          <p>
            Build is where the code gets written. AI is making this faster —
            cycles that used to take months are contracting. The implication
            isn&apos;t that development matters less. It&apos;s that everything
            before development has more leverage than it used to. Better
            discovery, better design, tighter iteration — these compound. The
            loop gets smaller and faster, which means the thinking at the
            start of each loop matters more.
          </p>
          <p>
            For a one-time project, launch is a handoff. We ship it, document
            it, train your team on it, and you own it from there.
          </p>
          <p>
            For a partnership, launch is the beginning. The loop keeps going —
            smaller and faster each time.
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={textFadeUpSmall(0.08, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
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
