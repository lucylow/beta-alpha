import type { SearchResultItem } from './brave-client.js';

export function formatSearchResults(
  query: string,
  results: SearchResultItem[],
): string {
  if (results.length === 0) {
    return `No results found for "${query}".`;
  }
  let output = `Search results for "${query}":\n\n`;
  results.forEach((r, idx) => {
    output += `${idx + 1}. **${r.title}**\n`;
    output += `   ${r.description}\n`;
    output += `   ${r.url}\n\n`;
  });
  return output;
}
