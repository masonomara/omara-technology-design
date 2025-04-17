// app/(frontend)/portfolio/page.tsx

import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";

import FooterContact from "@/app/components/FooterContact";
import ProjectsSection from "@/app/components/ProjectsSection";


export default async function Page() {
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <ProjectsSection projects={projects} />

        <FooterContact />
      </div>
    </main>
  );
}