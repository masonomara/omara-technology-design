import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { PostCard } from "@/app/components/PostCard";

export default async function Page() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

  return (
    <main>
      <h1>Post Index</h1>
      <ul>
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}
      </ul>
    </main>
  );
}
