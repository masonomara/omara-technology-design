"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUpSmall } from "../lib/motion";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <motion.div
        className={styles.wordmarkWrapper}
        variants={textFadeUpSmall(0.06, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <Image
          src="/longWordmark.svg"
          width={326}
          height={20.03}
          alt="O'Mara Technology"
          className={styles.wordmark}
        />

        <Image
          src="/superCondensedWordmark.svg"
          height={36}
          width={87}
          alt="O'Mara Technology"
          className={styles.wordmarkCondensed}
        />
      </motion.div>
      <motion.div
        className={styles.navLinks}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.04,
              delayChildren: 0.1,
            },
          },
        }}
      >
        <motion.div
          className={styles.navLink}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/`} target="_top" className={styles.navLink}>
            HOME
          </Link>
        </motion.div>
        <motion.div
          className={styles.navLink}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/work`} target="_top" className={styles.navLink}>
            WORK
          </Link>
        </motion.div>
        <motion.div
          className={styles.navLink}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/process`} target="_top" className={styles.navLink}>
            PROCESS
          </Link>
        </motion.div>
        <motion.div
          className={styles.navLink}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/about`} target="_top" className={styles.navLink}>
            ABOUT
          </Link>
        </motion.div>
        <motion.div
          className={styles.navLink}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/contact`} target="_top" className={styles.navLink}>
            CONTACT
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
