import { BRAVE_API_KEY } from "../config.js";
import { premiumSearchAnswer } from "../searchService.js";
import { getCachedSearch, setCachedSearch } from "../searchCache.js";

type BraveWebResult = {
  web?: { results?: Array<{ title?: string; url?: string; description?: string }> };
};

export type SearchRunOptions = {
  /** Result count (clamped 1–20). */
  count?: number;
  /** ISO 3166-1 alpha-2 country code for Brave regional results. */
  country?: string;
};

export async function runSearch(
  query: string,
  options: SearchRunOptions = {},
): Promise<{
  query: string;
  results: Array<{ title: string; url: string; snippet: string }>;
  source: "brave" | "fallback";
  country?: string;
  count: number;
  /** Present when served from short-TTL in-memory cache (Brave path only). */
  cached?: boolean;
}> {
  const q = query.trim();
  const count = Math.min(20, Math.max(1, options.count ?? 10));
  const country = options.country?.trim().toUpperCase().slice(0, 2) || undefined;

  if (!BRAVE_API_KEY) {
    return {
      query: q,
      results: [
        {
          title: "AgentPay (fallback)",
          url: "https://developers.stellar.org/",
          snippet: premiumSearchAnswer(q),
        },
      ],
      source: "fallback",
      count,
      ...(country ? { country } : {}),
    };
  }

  const cached = getCachedSearch<{
    query: string;
    results: Array<{ title: string; url: string; snippet: string }>;
    source: "brave";
    country?: string;
    count: number;
    cached: boolean;
  }>(q, count, country);
  if (cached) {
    return { ...cached, cached: true };
  }

  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", q);
  url.searchParams.set("count", String(count));
  if (country) {
    url.searchParams.set("country", country);
  }

  const res = await fetch(url, {
    headers: { "X-Subscription-Token": BRAVE_API_KEY, Accept: "application/json" },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`brave_search_failed:${res.status}:${t.slice(0, 200)}`);
  }
  const data = (await res.json()) as BraveWebResult;
  const rows = data.web?.results ?? [];
  const payload = {
    query: q,
    results: rows.map((r) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.description ?? "",
    })),
    source: "brave" as const,
    count,
    ...(country ? { country } : {}),
    cached: false as boolean,
  };
  setCachedSearch(q, count, country, payload);
  return payload;
}
