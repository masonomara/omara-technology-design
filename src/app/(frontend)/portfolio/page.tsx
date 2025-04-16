// app/(frontend)/portfolio/page.tsx
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
        <p className={styles.subtitle}>
          We help businesses build smart, scalable digital products. Whether you need a fractional leader, a full design system, or a scalable app, we step in and make it happen.
        </p>
        <p className={styles.subtitle} style={{ marginBottom: "2.4em" }}>
          We don't focus on commoditized solutions. We get to understand your business, your users, and your goals – then work with you to design and build what you need.
        </p>


        <div className={styles.portfolioWrapper}>
          {projects
            .slice() // shallow copy to avoid mutating the original
            .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
            .map((project: NonNullable<PROJECT_QUERYResult>) => (<ProjectCard key={project._id} project={project} />
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