import { motion } from "framer-motion";
import { Bot, Gavel, Tag, Layers, ArrowRightLeft, ShoppingCart } from "lucide-react";
import { AGENT_ACTIVITIES } from "@/content/nft-mock-data";

const actionIcons: Record<string, React.ReactNode> = {
  bid: <Gavel className="w-3.5 h-3.5 text-warning" />,
  list: <Tag className="w-3.5 h-3.5 text-accent" />,
  buy: <ShoppingCart className="w-3.5 h-3.5 text-success" />,
  fractionalize: <Layers className="w-3.5 h-3.5 text-secondary" />,
  "trade-share": <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />,
};

const actionVerb: Record<string, string> = {
  bid: "placed a bid on",
  list: "listed",
  buy: "bought",
  fractionalize: "fractionalized",
  "trade-share": "traded shares of",
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function AgentActivityFeed() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <Bot className="w-4 h-4 text-accent" /> Live Agent Activity
      </h3>
      <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
        {AGENT_ACTIVITIES.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
          >
            {actionIcons[a.action]}
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">{a.agent}</span>{" "}
              <span className="text-muted-foreground">{actionVerb[a.action]}</span>{" "}
              <span className="font-medium text-foreground">{a.nftName}</span>
            </div>
            <span className="font-mono text-accent whitespace-nowrap">
              {a.amount} USDC
            </span>
            <span className="text-muted-foreground whitespace-nowrap">{timeAgo(a.timestamp)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
