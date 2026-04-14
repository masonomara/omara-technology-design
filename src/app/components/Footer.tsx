"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NAV_LINKS } from "../lib/constants";
import { fadeInButton, textFadeUpSmall } from "../lib/motion";
import styles from "./Footer.module.css";

const viewport = { once: true, amount: 0.15 } as const;

export default function Footer() {
  return (
    <div className={styles.footer}>
      <motion.div
        className={styles.wordmarkWrapper}
        variants={textFadeUpSmall(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
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
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
        }}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {NAV_LINKS.map(({ id, label, href }) => (
          <motion.div
            key={id}
            className={styles.navLink}
            variants={fadeInButton("up", 0, 0.35)}
          >
            <Link href={href} target="_top" className={styles.navLink}>
              {label.toUpperCase()}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
