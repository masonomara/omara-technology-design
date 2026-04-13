"use client";

import Link from "next/link";
import React from "react";
import styles from "../styles/footer.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUpSmall } from "../lib/motion";

export default function FooterContact() {
  return (
    <div className={styles.contactWrapper}>
      <motion.div
        className={styles.companyTitle}
        variants={textFadeUpSmall(0.06, 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <Image
          src="/longWordmark.svg"
          height={12}
          width={208}
          alt="O’Mara Technology"
          className={styles.companyTitleImage}
        />
        <Image
          src="/condensedWordmark.svg"
          height={24}
          width={142}
          alt="O’Mara Technology"
          className={styles.companyTitleImageCondensed}
        />
        <Image
          src="/superCondensedWordmark.svg"
          height={36}
          width={87}
          alt="O’Mara Technology"
          className={styles.companyTitleImageSuperCondensed}
        />
      </motion.div>
      <motion.div
        className={styles.subButtonsWrapper}
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
          className={styles.subButton}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/`} target="_top" className={styles.subButton}>
            HOME
          </Link>
        </motion.div>
        <motion.div
          className={styles.subButton}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/work`} target="_top" className={styles.subButton}>
            WORK
          </Link>
        </motion.div>
        <motion.div
          className={styles.subButton}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/process`} target="_top" className={styles.subButton}>
            PROCESS
          </Link>
        </motion.div>
        <motion.div
          className={styles.subButton}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/about`} target="_top" className={styles.subButton}>
            ABOUT
          </Link>
        </motion.div>
        <motion.div
          className={styles.subButton}
          variants={fadeInButton("up", 0, 0.35)}
        >
          <Link href={`/contact`} target="_top" className={styles.subButton}>
            CONTACT
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
