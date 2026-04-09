"use client"

import React from 'react'
import { motion } from "framer-motion";
import { fadeIn, fadeInButton, textFadeUp, textFadeUpSmall } from '../lib/motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from "../styles/about.module.css";


export default function About() {
  const emailAddress = 'connect@omaratechnology.com';

  return (
    <>
      <motion.h1 className="title" variants={textFadeUp("up", "spring", 0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }} >About</motion.h1>
      <motion.div className={styles.cardImageContainer} variants={fadeIn("up", "spring", 0.1, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}>
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />

        <div className={styles.cardImage}>
          <Image
            src="/siteOffice.png"
            alt="Photo of office interior"
            fill
            style={{ objectFit: "cover" }}
            className={styles.cardImageTwo}
          />
        </div>

      </motion.div>

      <motion.p variants={textFadeUpSmall("up", "spring", .1, .8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }} className={styles.header}>
        Strategy and Execution
      </motion.p>
      <motion.div
        variants={textFadeUpSmall("up", "spring", .2, .8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >
        <p className={styles.subtitle}>
          O’Mara Technology provides strategy, design, and development for digital products - apps, websites, ecommerce, and internal tools that connect them all. We lead projects from ideation to ongoing iterations, often in fractional roles or long-term partnerships. We build intuitive, user-centered products that drive business towards their goals.
        </p>
        <p className={styles.subtitle} >
          We prioritize open-minded problem-solving and tailor our process to each client’s goals, resources, and timeline. The end result is always the same: thoughtful, technically sound products that feel great to use and deliver real value for businesses and users.
        </p>
      </motion.div>
      <motion.div className={styles.emailInfo}
        variants={fadeInButton("up", "spring", .4, 1.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}>
        Interested in working together?<br />
        EMAIL:{' '}
        <Link
          className={styles.emailLink}
          href={`mailto:${emailAddress}`}
          target="_blank"
        >
          connect@omaratechnology.com
        </Link>
      </motion.div>
      <motion.div className={styles.cardImageContainer} variants={fadeIn("up", "spring", 0.1, 0.8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}>
        <div className={styles.cardImageScreen} />
        <div className={styles.cardImageMultiply} />

        <div className={styles.cardImage}>
          <Image
            src="/siteHeadshot.png"
            alt="Headshot of Mason O‘Mara"
            fill
            style={{ objectFit: "cover" }}
            className={styles.cardImageTwo}
          />
        </div>

      </motion.div>
      <motion.p variants={textFadeUpSmall("up", "spring", .1, .8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }} className={styles.header}>
        Fractional and Modular Roles
      </motion.p>
      <motion.div
        variants={textFadeUpSmall("up", "spring", .2, .8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}
      >

        <p className={styles.subtitle}>
          We independently manage projects or work embedded alongside product teams and company leadership. Our team, led by Mason O’Mara, brings experience across digital strategy, design, and development, supported by specialists for adjacent services and expertise. Our goal is to surround ourselves with good people, good ideas, and build things that last.
        </p>
      </motion.div>
      <motion.div className={styles.emailInfo}
        variants={fadeInButton("up", "spring", .4, 1.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}>
        Visit Mason O‘Mara‘s Personal Site<br />
        URL:{' '}
        <Link
          className={styles.emailLink}
          href={`masonomara.com`}
          target="_blank"
        >
          masonomara.com
        </Link>
      </motion.div>
    </>
  )
}
