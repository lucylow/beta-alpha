import { motion } from "framer-motion";
import { BarChart3, Zap, Users, Layers, TrendingUp, Clock } from "lucide-react";
import { MARKETPLACE_STATS } from "@/content/nft-mock-data";

const stats = [
  { icon: <BarChart3 className="w-4 h-4" />, label: "NFTs Listed", value: MARKETPLACE_STATS.totalNfts },
  { icon: <Zap className="w-4 h-4" />, label: "Live Auctions", value: MARKETPLACE_STATS.liveAuctions },
  { icon: <TrendingUp className="w-4 h-4" />, label: "Volume", value: `${MARKETPLACE_STATS.totalVolume} USDC` },
  { icon: <Users className="w-4 h-4" />, label: "Active Agents", value: MARKETPLACE_STATS.activeAgents },
  { icon: <Layers className="w-4 h-4" />, label: "Shares Traded", value: MARKETPLACE_STATS.fractionalShares },
  { icon: <Clock className="w-4 h-4" />, label: "Avg Finality", value: MARKETPLACE_STATS.avgFinality },
];

export default function MarketplaceStats() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-3 text-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex justify-center text-accent mb-1.5">{s.icon}</div>
          <p className="text-lg font-mono font-bold text-foreground">{s.value}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
