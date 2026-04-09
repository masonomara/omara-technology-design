"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textFadeUp, textFadeUpSmall } from "../lib/motion";
import Image from "next/image";
import styles from "../styles/about.module.css";
import Link from "next/link";

export default function About() {
  return (
    <>
      <motion.h1
        className="title"
        variants={textFadeUp(0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        About
      </motion.h1>

      <motion.div
        variants={textFadeUpSmall(0.1, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        <p className={styles.subtitle}>
          Product design and technical development strategy and services for
          hire. Founded by{" "}
          <a
            href="https://masonomara.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mason O&apos;Mara
          </a>{" "}
          for formal engagements and opportunities to work with trusted
          partners. Based out of Asbury Park, NJ.
        </p>
        <p className={styles.subtitle}>
          Full list of services available at{" "}
          <Link href="/services" rel="noopener noreferrer">
            omaratechnology.com/services
          </Link>
          .
        </p>
      </motion.div>

      <motion.div
        className={styles.cardImageContainer}
        variants={fadeIn("up", 0.2, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />

        <div className={styles.cardImage}>
          <Image
            src="/siteHeadshot.png"
            alt="Headshot of Mason O‘Mara"
            layout="fill"
            objectFit="cover"
            className={styles.cardImageTwo}
          />
        </div>
      </motion.div>
    </>
  );
}
