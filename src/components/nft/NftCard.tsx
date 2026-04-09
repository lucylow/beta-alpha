import { motion } from "framer-motion";
import { Clock, Gavel, LayoutGrid, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NftListing } from "@/content/nft-mock-data";

function timeLeft(iso?: string) {
  if (!iso) return "";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

const statusColors: Record<string, string> = {
  listed: "bg-primary/20 text-primary-foreground border-primary/30",
  auction: "bg-warning/20 text-warning-foreground border-warning/40",
  fractional: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  sold: "bg-muted text-muted-foreground border-border",
};

const statusIcons: Record<string, React.ReactNode> = {
  listed: <Tag className="w-3 h-3" />,
  auction: <Gavel className="w-3 h-3" />,
  fractional: <LayoutGrid className="w-3 h-3" />,
};

export default function NftCard({
  nft,
  onSelect,
}: {
  nft: NftListing;
  onSelect: (nft: NftListing) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer"
      style={{ boxShadow: "var(--shadow-card)" }}
      onClick={() => onSelect(nft)}
    >
      {/* Image placeholder with gradient */}
      <div
        className={`aspect-square bg-gradient-to-br ${nft.image} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors" />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <Badge
            variant="outline"
            className={`text-[10px] font-mono uppercase ${statusColors[nft.status]}`}
          >
            {statusIcons[nft.status]} {nft.status}
          </Badge>
        </div>
        {nft.auctionEnds && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-background/80 backdrop-blur px-2 py-1 text-xs font-mono text-foreground">
            <Clock className="w-3 h-3 text-warning" />
            {timeLeft(nft.auctionEnds)}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <p className="text-sm font-semibold text-foreground truncate">{nft.name}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {nft.status === "auction" ? "Highest Bid" : "Price"}
            </p>
            <p className="text-sm font-mono font-bold text-accent">
              {(nft.highestBid ?? nft.price).toFixed(4)}{" "}
              <span className="text-muted-foreground text-[10px]">USDC</span>
            </p>
          </div>
          {nft.status === "auction" && (
            <span className="text-[10px] text-muted-foreground">
              {nft.bids} bid{nft.bids !== 1 ? "s" : ""}
            </span>
          )}
          {nft.status === "fractional" && (
            <span className="text-[10px] text-muted-foreground">
              {nft.sharesAvailable}/{nft.shares} shares
            </span>
          )}
        </div>

        <Button
          size="sm"
          className="w-full text-xs h-8"
          variant={nft.status === "auction" ? "default" : "secondary"}
        >
          {nft.status === "auction"
            ? "Place Bid (0.001 USDC)"
            : nft.status === "fractional"
              ? "Buy Share"
              : "Buy Now"}
        </Button>
      </div>
    </motion.div>
  );
}
