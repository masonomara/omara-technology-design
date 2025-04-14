// page.tsx
import ProjectCard from "@/app/components/ProjectCard";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

import Image from "next/image";
import styles from "../../styles/portfolio.module.css"
import { PROJECT_QUERYResult } from "@/sanity/types";


export default async function Page() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">PORTFOLIO</h1>

        <div className={styles.portfolioWrapper}>
          {projects.map((project: NonNullable<PROJECT_QUERYResult>) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>

        <div className="companyTitle">
          <Image src="/longWordmark.svg" height={12} width={208} alt="O'Mara Technology & Design" className="companyTitleImage" />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O'Mara Technology & Design" className="companyTitleImageCondensed" />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O'Mara Technology & Design" className="companyTitleImageSuperCondensed" />
        </div>
      </div>
    </main>
  );
}