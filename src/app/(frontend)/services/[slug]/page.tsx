// update your imports
import { client, sanityFetch } from '@/sanity/lib/client'
import { SERVICE_QUERY, SERVICES_SLUGS_QUERY } from "@/sanity/lib/queries";

const post = await sanityFetch({
  query: POST_QUERY,
  params,
})
// add this export
export async function generateStaticParams() {
  const slugs = await client
    .withConfig({useCdn: false})
    .fetch(SERVICES_SLUGS_QUERY);

  return slugs
}