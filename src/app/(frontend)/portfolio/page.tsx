// page.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";

export default async function Page() {

  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });
  console.log("portfolio:", projects)

  return (
    <main>
      <h1>Project Index</h1>
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
    </main>
  );
}
