"use client";

import styles from "../styles/portfolio.module.css";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp } from "../lib/motion";
import ProjectCard from "./ProjectCard";
import type { ContentNode } from "@/lib/types";

interface ProjectItem {
  node: ContentNode;
  slug: string;
  thumbnail: string;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <>
      <motion.h1
        variants={textFadeUp(0, 0.45)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="title"
      >
        PORTFOLIO
      </motion.h1>

      <div className={styles.portfolioWrapper}>
        {projects.map((item) => (
          <motion.div
            key={item.slug}
            variants={fadeInButton("up", 0.1, 0.35)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <ProjectCard
              node={item.node}
              slug={item.slug}
              thumbnail={item.thumbnail}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
