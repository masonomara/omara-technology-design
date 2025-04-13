// client.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

console.log("Sanity client config:");
console.log("  projectId:", projectId);
console.log("  dataset:", dataset);
console.log("  apiVersion:", apiVersion);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
