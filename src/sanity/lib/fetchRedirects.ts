import { client } from "./client";
import { REDIRECTS_QUERY } from "./queries";

export async function fetchRedirects() {
  return client.fetch(REDIRECTS_QUERY);
}