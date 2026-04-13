"use client";

import projectStyles from "./Project.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp, textFadeUpSmall } from "../lib/motion";
import Image from "next/image";

interface ProjectProps {
  title: string;
  html: string;
  images?: string[];
}

export function Project({ title, html, images = [] }: ProjectProps) {
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
            </div>
          ) : null}
        </article>
      </div>
      {images.length > 0 && (
        <div className={projectStyles.masonryGrid}>
          {images.map((src, i) => (
            <div key={i} className={projectStyles.masonryItem}>
              <Image
                src={src}
                alt=""
                width={0}
                height={0}
                sizes="(max-width: 699px) 100vw, 50vw"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))}
        </div>
      )}
      {html && (
        <motion.div
          className={projectStyles.emailInfo}
          variants={fadeInButton("up", 0.18, 0.35)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          Want to work together?
          <br />
          Email{" "}
          <a
            className={projectStyles.emailLink}
            href={`mailto:${emailAddress}`}
          >
            info@omaratechnology.com
          </a>
        </motion.div>
      )}
    </>
  );
}
