import { X, ExternalLink, Percent, Layers, Gavel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NftListing } from "@/content/nft-mock-data";

export default function NftDetailModal({
  nft,
  onClose,
}: {
  nft: NftListing | null;
  onClose: () => void;
}) {
  if (!nft) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card overflow-hidden"
          style={{ boxShadow: "var(--shadow-card-hover)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-full bg-background/60 backdrop-blur p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className={`aspect-video bg-gradient-to-br ${nft.image}`} />

          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">{nft.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{nft.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat icon={<Gavel className="w-3.5 h-3.5" />} label="Price" value={`${nft.price} USDC`} />
              <Stat icon={<Percent className="w-3.5 h-3.5" />} label="Royalty" value={`${nft.royalty}%`} />
              <Stat icon={<Layers className="w-3.5 h-3.5" />} label="Bids" value={String(nft.bids)} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {nft.traits.map((t) => (
                <Badge key={t.key} variant="outline" className="text-[10px] font-mono">
                  {t.key}: {t.value}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              {nft.status === "auction" ? (
                <Button className="flex-1">
                  <Gavel className="w-3.5 h-3.5 mr-1.5" /> Place Bid (0.001 USDC)
                </Button>
              ) : nft.status === "fractional" ? (
                <Button className="flex-1" variant="secondary">
                  <Layers className="w-3.5 h-3.5 mr-1.5" /> Buy Share (0.0001 USDC)
                </Button>
              ) : (
                <Button className="flex-1">Buy Now ({nft.price} USDC)</Button>
              )}
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground font-mono truncate">
              Creator: {nft.creator.slice(0, 8)}…{nft.creator.slice(-4)}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-mono font-semibold text-foreground">{value}</p>
    </div>
  );
}
