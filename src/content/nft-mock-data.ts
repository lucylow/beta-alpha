export type NftStatus = "listed" | "auction" | "sold" | "fractional";
export type NftCategory = "ai-art" | "music" | "code" | "gaming" | "collectible";

export interface NftListing {
  id: string;
  name: string;
  image: string;
  category: NftCategory;
  status: NftStatus;
  price: number; // USDC
  highestBid?: number;
  bids: number;
  creator: string;
  owner: string;
  royalty: number; // percentage
  shares?: number;
  sharesAvailable?: number;
  auctionEnds?: string; // ISO date
  description: string;
  traits: { key: string; value: string }[];
  createdAt: string;
}

export interface AgentActivity {
  id: string;
  agent: string;
  action: "bid" | "list" | "buy" | "fractionalize" | "trade-share";
  nftName: string;
  amount: number;
  timestamp: string;
  txHash: string;
}

const COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-rose-500",
  "from-indigo-400 to-purple-500",
  "from-pink-400 to-red-500",
  "from-amber-400 to-orange-500",
  "from-sky-400 to-indigo-500",
];

function gradientPlaceholder(i: number) {
  return COLORS[i % COLORS.length];
}

export const DEMO_NFTS: NftListing[] = Array.from({ length: 50 }, (_, i) => {
  const categories: NftCategory[] = ["ai-art", "music", "code", "gaming", "collectible"];
  const cat = categories[i % 5];
  const statuses: NftStatus[] = ["listed", "auction", "fractional", "listed"];
  const status = i < 8 ? "auction" : statuses[i % 4];
  const price = +(0.01 + Math.random() * 0.49).toFixed(4);
  const hasBids = status === "auction";
  const isFractional = status === "fractional";

  return {
    id: `nft-${String(i + 1).padStart(3, "0")}`,
    name: `${cat === "ai-art" ? "AI Art" : cat === "music" ? "Agent Track" : cat === "code" ? "Code Snippet" : cat === "gaming" ? "Game Item" : "Collectible"} #${String(i + 1).padStart(3, "0")}`,
    image: gradientPlaceholder(i),
    category: cat,
    status,
    price,
    highestBid: hasBids ? +(price * (0.7 + Math.random() * 0.25)).toFixed(4) : undefined,
    bids: hasBids ? Math.floor(Math.random() * 12) + 1 : 0,
    creator: `G${String.fromCharCode(65 + (i % 26))}${"A".repeat(54)}`,
    owner: `G${String.fromCharCode(75 + (i % 26))}${"B".repeat(54)}`,
    royalty: 5,
    shares: isFractional ? 1000 : undefined,
    sharesAvailable: isFractional ? Math.floor(Math.random() * 800) + 100 : undefined,
    auctionEnds: hasBids
      ? new Date(Date.now() + (1 + Math.random() * 48) * 3600000).toISOString()
      : undefined,
    description: `Agent-generated ${cat} NFT on Stellar testnet. Tradeable via x402 micropayments.`,
    traits: [
      { key: "Generator", value: i % 2 === 0 ? "Cursor v2.1" : "Claude Code" },
      { key: "Rarity", value: i < 5 ? "Legendary" : i < 15 ? "Rare" : "Common" },
      { key: "Network", value: "Stellar Testnet" },
    ],
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  };
});

export const AGENT_ACTIVITIES: AgentActivity[] = [
  { id: "a1", agent: "Cursor Agent", action: "bid", nftName: "AI Art #001", amount: 0.045, timestamp: new Date(Date.now() - 120000).toISOString(), txHash: "abc123...def" },
  { id: "a2", agent: "Claude Bot", action: "list", nftName: "Agent Track #012", amount: 0.15, timestamp: new Date(Date.now() - 300000).toISOString(), txHash: "fed987...cba" },
  { id: "a3", agent: "Trading Bot #7", action: "fractionalize", nftName: "Code Snippet #005", amount: 0.05, timestamp: new Date(Date.now() - 600000).toISOString(), txHash: "111aaa...222" },
  { id: "a4", agent: "Cursor Agent", action: "trade-share", nftName: "Game Item #020", amount: 0.002, timestamp: new Date(Date.now() - 900000).toISOString(), txHash: "333bbb...444" },
  { id: "a5", agent: "Sniper Bot", action: "buy", nftName: "Collectible #003", amount: 0.25, timestamp: new Date(Date.now() - 1800000).toISOString(), txHash: "555ccc...666" },
  { id: "a6", agent: "Claude Bot", action: "bid", nftName: "AI Art #008", amount: 0.12, timestamp: new Date(Date.now() - 3600000).toISOString(), txHash: "777ddd...888" },
];

export const MARKETPLACE_STATS = {
  totalNfts: 127,
  liveAuctions: 23,
  totalVolume: "4.2",
  settlementRate: "99.8",
  activeAgents: 17,
  avgFinality: "2.1s",
  fractionalShares: 847,
};
