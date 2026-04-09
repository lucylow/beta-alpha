/** Short-lived cache for identical Brave queries (mitigates rate limits; paid requests only). */

type Entry<T> = { value: T; expiresAt: number };

const DEFAULT_TTL_MS = 45_000;
const MAX_ENTRIES = 128;

const store = new Map<string, Entry<unknown>>();

function cacheKey(query: string, count: number, country: string | undefined): string {
  return `${query.toLowerCase().trim()}|${count}|${country ?? ""}`;
}

export function getCachedSearch<T>(query: string, count: number, country: string | undefined): T | null {
  const k = cacheKey(query, count, country);
  const row = store.get(k) as Entry<T> | undefined;
  if (!row) return null;
  if (Date.now() > row.expiresAt) {
    store.delete(k);
    return null;
  }
  return row.value;
}

export function setCachedSearch<T>(
  query: string,
  count: number,
  country: string | undefined,
  value: T,
  ttlMs: number = DEFAULT_TTL_MS,
): void {
  if (store.size >= MAX_ENTRIES) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
  const k = cacheKey(query, count, country);
  store.set(k, { value, expiresAt: Date.now() + ttlMs });
}

export function clearSearchCache(): void {
  store.clear();
}
