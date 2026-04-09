export const mockRegistry = [
  {
    id: "search-1",
    capability: "websearch" as const,
    priceUSDC: 0.001,
    latencyMs: 300,
    reputation: 92,
    endpoint: "mcp://search-agent",
  },
  {
    id: "search-2",
    capability: "websearch" as const,
    priceUSDC: 0.002,
    latencyMs: 220,
    reputation: 94,
    endpoint: "mcp://backup-search-agent",
  },
];
