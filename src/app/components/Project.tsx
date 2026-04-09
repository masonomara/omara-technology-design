"use client"

import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { PROJECT_QUERYResult } from "@/sanity/types"; // Update path if needed
import styles from "../styles/about.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";

export function Project(props: NonNullable<PROJECT_QUERYResult>) {
  const { body, seo, title } = props;
  const emailAddress = 'info@omaratechnology.com'


  return (
    <>
      <motion.h1 className="title" variants={textFadeUp("up", "spring", 0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >{seo.title || title}</motion.h1>
      <div className="projectWrapper">
        <article>
          {body ? (
            <div>
              <motion.div
                variants={textFadeUpSmall("up", "spring", .1, .8)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
              >
                <PortableText value={body} components={components} />
              </motion.div>
              <motion.div className={styles.emailInfo}
                variants={fadeInButton("up", "spring", .3, 1.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}>
                Interested in working together?<br />
                Feel free to reach out to
                <a
                  className={styles.emailLink}
                  href={`mailto:${emailAddress}`}
                >
                  info@omaratechnology.com
                </a>
              </motion.div>
            </div>
          ) : null}
        </article >
      </div >
    </>
  );
}