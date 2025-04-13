// live.ts
import { defineLive } from "next-sanity";
import { client } from "./client";

const apiVersion = "2025-04-11"; // Make sure to replace with actual version like "2023-03-01"
console.log("Sanity API Version (live.ts):", apiVersion);

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion,
  }),
});
