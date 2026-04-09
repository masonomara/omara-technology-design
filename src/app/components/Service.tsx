"use client";

import { components } from "@/sanity/portableTextComponents";
import { PortableText } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types"; // Update path if needed
import styles from "../styles/about.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";

// import { RelatedServices } from "./RelatedServices";

export function Service(props: NonNullable<SERVICE_QUERYResult>) {
  const { body, title, seo } = props;
  const emailAddress = "info@omaratechnology.com";

  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
        className="title"
      >
        {seo.title || title}
      </motion.h1>
      <div className="serviceWrapper">
        <article>
          {body ? (
            <div>
              <motion.div
                variants={textFadeUpSmall(0.1, 0.8)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
              >
                <PortableText value={body} components={components} />
              </motion.div>
              <motion.div
                className={styles.emailInfo}
                variants={fadeInButton("up", 0.3, 1.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0 }}
              >
                Interested in working together?
                <br />
                Feel free to reach out to{" "}
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
