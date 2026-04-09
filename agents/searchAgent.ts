import { BraveSearchClient } from "../x402-web-search-mcp/src/search/brave-client";

export class SearchAgent {
  constructor(private brave: BraveSearchClient) {}

  async run(query: string) {
    if (!query || typeof query !== "string" || !query.trim()) {
      return { error: "Invalid query: must be a non-empty string", results: [] };
    }

    try {
      const results = await this.brave.search(query.trim(), { country: "US", count: 5 });
      return { error: null, results };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[SearchAgent] search failed: ${message}`);
      return { error: `Search failed: ${message}`, results: [] };
    }
  }
}
