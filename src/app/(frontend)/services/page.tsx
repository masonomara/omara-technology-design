import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

// Define a type for the Post
interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export default async function Page() {
  const { data: posts }: { data: Post[] } = await sanityFetch({ query: POSTS_QUERY });

  return (
    <main>
      <h1>Post Index</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/services/${post?.slug?.current}`}>
              {post?.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
