"use client";

import projectStyles from "../styles/project.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";

interface ProjectProps {
  title: string;
  html: string;
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
      <div className={projectStyles.wrapper}>
        <article>
          {html ? (
            <div>
              <motion.div
                variants={textFadeUpSmall(0.08, 0.4)}
                initial="hidden"
                animate="show"
                className={projectStyles.content}
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <motion.div
                className={projectStyles.emailInfo}
                variants={fadeInButton("up", 0.18, 0.35)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                Interested in working together?
                <br />
                Feel free to reach out to
                <a className={projectStyles.emailLink} href={`mailto:${emailAddress}`}>
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
