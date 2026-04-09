export class SummarizeAgent {
  summarize(text: string, maxLength = 180): string {
    if (!text || typeof text !== "string") {
      return "[No content to summarize]";
    }
    const trimmed = text.trim();
    if (trimmed.length === 0) return "[Empty content]";
    return trimmed.slice(0, maxLength) + (trimmed.length > maxLength ? "..." : "");
  }
}
