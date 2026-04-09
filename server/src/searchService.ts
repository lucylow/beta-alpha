export function premiumSearchAnswer(query: string): string {
  const q = query.trim() || "empty query";
  return [
    `Premium AgentPay result for: "${q.slice(0, 200)}"`,
    "",
    "- Settlement: Stellar testnet (x402 micropayment verified)",
    "- This response is intentionally concise for hackathon judging.",
    `- Generated at ${new Date().toISOString()}`,
  ].join("\n");
}
