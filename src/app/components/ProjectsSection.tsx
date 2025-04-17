
'use client'

import styles from '../styles/portfolio.module.css';
import { PROJECT_QUERYResult, PROJECTS_QUERYResult } from '@/sanity/types';
import { motion } from "framer-motion";
import { fadeInButton, textFadeUp } from '../lib/motion';
import ProjectCard from './ProjectCard';

interface ProjectsSectionProps {
  projects: PROJECTS_QUERYResult;
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <>
      <motion.h1 variants={textFadeUp("up", "spring", 0, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0 }} className="title">PORTFOLIO</motion.h1>


      <div className={styles.portfolioWrapper}>
        {projects
          .slice() // shallow copy to avoid mutating the original
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          .map((project: NonNullable<PROJECT_QUERYResult>, projectIndex) => (<motion.div key={project._id} variants={fadeInButton("up", "spring", 0.2, 1.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}>
            <ProjectCard project={project} /></motion.div>
          ))}
      </div>
    </>
  )
}