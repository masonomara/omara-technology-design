"use client";

import styles from "../styles/portfolio.module.css";
import { PROJECT_QUERYResult, PROJECTS_QUERYResult } from "@/sanity/types";
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp } from "../lib/motion";
import ProjectCard from "./ProjectCard";

interface ProjectsSectionProps {
  projects: PROJECTS_QUERYResult;
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
        {projects
          .slice() // shallow copy to avoid mutating the original
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          .map((project: NonNullable<PROJECT_QUERYResult>) => (
            <motion.div
              key={project._id}
              variants={fadeInButton("up", 0.1, 0.35)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
      </div>
    </>
  );
}
