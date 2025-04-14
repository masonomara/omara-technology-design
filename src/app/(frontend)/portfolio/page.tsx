// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {

  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });
  console.log("portfolio:", projects)

  return (
    <main className="standardPageContainer">
      <div className="standardPageWrapper">
        <h1 className="title">PORTFOLIO</h1>
        <ul>
          {projects.map((project: any) => (
            <li key={project._id}>
              <Link
                className="block p-4 hover:text-blue-500"
                href={`/portfolio/${project?.slug?.current}`}
              >
                {project?.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="companyTitle">
          <Image src="/longWordmark.svg" height={12} width={208} alt="O’Mara Technology & Design" className="companyTitleImage" />
          <Image src="/condensedWordmark.svg" height={24} width={142} alt="O’Mara Technology & Design" className="companyTitleImageCondensed" />
          <Image src="/superCondensedWordmark.svg" height={36} width={87} alt="O’Mara Technology & Design" className="companyTitleImageSuperCondensed" />
        </div>
      </div>
    </main>
  );
}
