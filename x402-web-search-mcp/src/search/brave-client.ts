export interface SearchOptions {
  count?: number;
  country?: string;
}

export interface SearchResultItem {
  title: string;
  url: string;
  description: string;
  age?: string;
}

export class BraveSearchClient {
  private readonly baseUrl = 'https://api.search.brave.com/res/v1/web';

  constructor(private readonly apiKey: string) {}

  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<SearchResultItem[]> {
    const count = Math.min(Math.max(options.count ?? 10, 1), 20);
    const params = new URLSearchParams({
      q: query,
      count: String(count),
    });
    if (options.country) params.append('country', options.country);

    const response = await fetch(`${this.baseUrl}?${params}`, {
      headers: {
        Accept: 'application/json',
        'X-Subscription-Token': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      web?: { results?: Array<Record<string, unknown>> };
    };
    const results = data.web?.results ?? [];
    return results.map((r) => ({
      title: String(r.title ?? ''),
      url: String(r.url ?? ''),
      description: String(r.description ?? ''),
      age: r.age != null ? String(r.age) : undefined,
    }));
  }
}
