/** Lightweight stub summarizer for demo — swap for an LLM API behind the same paywall. */
export function summarizeText(text: string, maxSentences = 3): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "";
  const parts = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  const picked = parts.slice(0, maxSentences);
  const summary = picked.join(" ");
  return summary.length < t.length ? `${summary} [truncated]` : summary;
}
