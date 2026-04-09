/** Curated static headlines for demo (no external API key required). */
export function newsForCategory(category: string): Array<{ title: string; url: string; category: string }> {
  const c = category.trim().toLowerCase() || "blockchain";
  const base = [
    {
      title: "Stellar Hacks: Agents",
      url: "https://dorahacks.io/hackathon/stellar-agents/detail",
      category: "hackathon",
    },
    {
      title: "x402 payments on Stellar",
      url: "https://developers.stellar.org/docs",
      category: "blockchain",
    },
    {
      title: "Soroban smart contracts overview",
      url: "https://soroban.stellar.org/",
      category: "blockchain",
    },
  ];
  return base.filter((x) => c === "all" || x.category === c || c === "blockchain");
}
