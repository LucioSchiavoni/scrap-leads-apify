import { ApifyClient } from "apify-client";
import { APIFY_TOKEN, ACTOR_ID } from "./config.js";
import type { ApifyPlaceResult, ScrapeJob } from "./types.js";

export async function scrapeGoogleMaps(
  jobs: ScrapeJob[]
): Promise<ApifyPlaceResult[]> {
  if (!APIFY_TOKEN) {
    throw new Error("APIFY_TOKEN env variable is required");
  }

  const client = new ApifyClient({ token: APIFY_TOKEN });
  const allResults: ApifyPlaceResult[] = [];

  for (const job of jobs) {
    const searchQueries = job.locations.map(
      (loc) => `${job.category} en ${loc}`
    );

    const limit = job.maxResults ?? 100;
    console.log(`[scrape] ${job.category} (max ${limit}) → ${job.locations.join(", ")}`);
    
    const isSpain = job.locations.some((loc) => 
    loc.toLowerCase().includes("españa") || loc.toLowerCase().includes("spain")
    );

    const input = {
  searchStringsArray: searchQueries,
  maxCrawledPlacesPerSearch: limit,
  language: "es",
  deeperCityScrape: false,
  skipClosedPlaces: true,
  ...(isSpain && { scrapeContacts: true }),
};

    const run = await client.actor(ACTOR_ID).call(input, {
      memory: 4096,
      timeout: 600,
    });

    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    console.log(`[scrape] Got ${items.length} results for: ${job.category}`);
    allResults.push(...(items as ApifyPlaceResult[]));
  }

  return allResults;
}