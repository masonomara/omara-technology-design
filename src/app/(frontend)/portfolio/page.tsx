// app/(frontend)/portfolio/page.tsx
import ProjectCard from "@/app/components/ProjectCard";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

import styles from "../../styles/portfolio.module.css"
import { PROJECT_QUERYResult } from "@/sanity/types";
import FooterContact from "@/app/components/FooterContact";


export default async function Page() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">PORTFOLIO</h1>


        <div className={styles.portfolioWrapper}>
          {projects
            .slice() // shallow copy to avoid mutating the original
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .map((project: NonNullable<PROJECT_QUERYResult>) => (<ProjectCard key={project._id} project={project} />
            ))}
        </div>

        <FooterContact />
      </div>
    </main>
  );
}