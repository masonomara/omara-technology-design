"use client"

import Link from 'next/link'
import React from 'react'
import styles from '../styles/footer.module.css'
import Image from 'next/image'
import { motion } from "framer-motion";
import { fadeInButton, textFadeUpSmall } from "../lib/motion";

export default function FooterContact() {

  return (

    <div className={styles.contactWrapper}>
      <motion.div className="companyTitle" variants={textFadeUpSmall("up", "spring", .1, .8)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }}>
        <Image
          src="/longWordmark.svg"
          height={12}
          width={198}
          alt="O'Mara Technology"
          className="companyTitleImage"
        />
        <Image
          src="/condensedWordmark.svg"
          height={12}
          width={198}
          alt="O'Mara Technology"
          className="companyTitleImageCondensed"
        />
        <Image
          src="/superCondensedWordmark.svg"
          height={24}
          width={94}
          alt="O'Mara Technology"
          className="companyTitleImageSuperCondensed"
        />
      </motion.div>
      <div className={styles.subButtonsWrapper} >
        <motion.div className={styles.subButton} variants={fadeInButton("up", "spring", .2, .4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link
            href={`/`}
            target="_top"
            className={styles.subButton}
          >
            HOME
          </Link>
        </motion.div>
        <motion.div className={styles.subButton} variants={fadeInButton("up", "spring", .25, .4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link
            href={`/portfolio`}
            target="_top"
            className={styles.subButton}
          >
            PORTFOLIO
          </Link>
        </motion.div>
        <motion.div className={styles.subButton} variants={fadeInButton("up", "spring", .3, .4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link
            href={`/services`}
            target="_top"
            className={styles.subButton}
          >
            SERVICES
          </Link>
        </motion.div>
        <motion.div className={styles.subButton} variants={fadeInButton("up", "spring", .35, .4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link
            href={`/about`}
            target="_top"
            className={styles.subButton}
          >
            ABOUT
          </Link>
        </motion.div>
        <motion.div className={styles.subButton} variants={fadeInButton("up", "spring", .4, .4)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}>
          <Link
            href={`/contact`}
            target="_top"
            className={styles.subButton}
          >
            CONTACT
          </Link>
        </motion.div>
      </div>
    </div>
  )
}