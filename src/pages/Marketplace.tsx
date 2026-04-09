import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NftCard from "@/components/nft/NftCard";
import NftDetailModal from "@/components/nft/NftDetailModal";
import AgentActivityFeed from "@/components/nft/AgentActivityFeed";
import MarketplaceStats from "@/components/nft/MarketplaceStats";
import { DEMO_NFTS, type NftListing, type NftCategory, type NftStatus } from "@/content/nft-mock-data";

const CATEGORIES: { value: NftCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ai-art", label: "AI Art" },
  { value: "music", label: "Music" },
  { value: "code", label: "Code" },
  { value: "gaming", label: "Gaming" },
  { value: "collectible", label: "Collectible" },
];

const STATUSES: { value: NftStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "auction", label: "Auctions" },
  { value: "listed", label: "Buy Now" },
  { value: "fractional", label: "Fractional" },
];

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NftCategory | "all">("all");
  const [status, setStatus] = useState<NftStatus | "all">("all");
  const [selected, setSelected] = useState<NftListing | null>(null);

  const filtered = useMemo(() => {
    return DEMO_NFTS.filter((n) => {
      if (category !== "all" && n.category !== category) return false;
      if (status !== "all" && n.status !== status) return false;
      if (query && !n.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, category, status]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground font-display">
            🖼️ NFT AgentHub
          </h1>
          <div className="flex-1" />
          <div className="relative max-w-xs w-full hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Stats */}
        <MarketplaceStats />

        {/* Filters + Activity */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            {/* Mobile search */}
            <div className="relative sm:hidden">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {CATEGORIES.map((c) => (
                <Badge
                  key={c.value}
                  variant={category === c.value ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setCategory(c.value)}
                >
                  {c.label}
                </Badge>
              ))}
              <span className="text-border">|</span>
              {STATUSES.map((s) => (
                <Badge
                  key={s.value}
                  variant={status === s.value ? "secondary" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setStatus(s.value)}
                >
                  {s.label}
                </Badge>
              ))}
            </div>

            {/* Grid */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
              {filtered.map((nft) => (
                <NftCard key={nft.id} nft={nft} onSelect={setSelected} />
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">
                No NFTs match your filters.
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <AgentActivityFeed />

            <div className="rounded-xl border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-sm font-semibold text-foreground">x402 Payment Model</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex justify-between"><span>List NFT</span><span className="font-mono text-accent">0.01 USDC</span></li>
                <li className="flex justify-between"><span>Place Bid</span><span className="font-mono text-accent">0.001 USDC</span></li>
                <li className="flex justify-between"><span>Fractionalize</span><span className="font-mono text-accent">0.05 USDC</span></li>
                <li className="flex justify-between"><span>Buy Share</span><span className="font-mono text-accent">0.0001 USDC</span></li>
                <li className="flex justify-between"><span>Secondary Royalty</span><span className="font-mono text-accent">5%</span></li>
              </ul>
            </div>

            <div className="rounded-xl border border-dashed border-secondary/40 bg-secondary/5 p-4 text-center">
              <p className="text-xs text-secondary font-medium">🤖 MCP Tools Available</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                nft_list · nft_bid · find_undervalued_nfts
              </p>
            </div>
          </aside>
        </div>
      </main>

      <NftDetailModal nft={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
