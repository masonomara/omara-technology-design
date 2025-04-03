import { Service } from "@/app/components/Service";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";


export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: service } = await sanityFetch({
    query: SERVICE_QUERY,
    params: await params,
  });

  if (!service) {
    notFound();
  }

  return (
    <main>
      <Service {...service} />
    </main>
  );
}