"use client";

import styles from "../styles/about.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";

interface ProjectProps {
  title: string;
  html: string;
  images: string[];
  tags?: string[];
  description?: string;
}

export function Project({ title, html }: ProjectProps) {
  const emailAddress = "info@omaratechnology.com";

  return (
    <>
      <motion.h1
        className="title"
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {title}
      </motion.h1>
      <div className="projectWrapper">
        <article>
          {html ? (
            <div>
              <motion.div
                variants={textFadeUpSmall(0.08, 0.4)}
                initial="hidden"
                animate="show"
                className="projectContent"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <motion.div
                className={styles.emailInfo}
                variants={fadeInButton("up", 0.18, 0.35)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                Interested in working together?
                <br />
                Feel free to reach out to
                <a className={styles.emailLink} href={`mailto:${emailAddress}`}>
                  info@omaratechnology.com
                </a>
              </motion.div>
            </div>
          ) : null}
        </article>
      </div>
    </>
  );
}
