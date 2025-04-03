import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Page() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

  return (
    <main>
      <h1>post index</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/services/${post?.slug?.current}`}
            >
              {post?.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}