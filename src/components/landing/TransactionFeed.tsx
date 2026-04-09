import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink, UserCheck } from "lucide-react";
import { supervisedTransactionsMock } from "@/content/landing-mock-data";
import { stellarExpertTestnetTxUrl } from "@/lib/tx-hash";
import { toast } from "sonner";

type Row = (typeof supervisedTransactionsMock)[number];

function hashHref(hash: string) {
  if (hash.startsWith("TX-MOCK")) return null;
  return stellarExpertTestnetTxUrl(hash);
}

export default function TransactionFeed() {
  const [rows, setRows] = useState<Row[]>(supervisedTransactionsMock);

  const refresh = useCallback(() => {
    setRows((prev) => {
      const next = [...prev];
      const head = next[0];
      if (!head) return prev;
      next.unshift({
        ...head,
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        hash: `TX-MOCK-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        approvalMode: Math.random() > 0.5 ? "manual" : "auto",
        approvedBy: Math.random() > 0.5 ? "Jordan" : "Policy",
      });
      return next.slice(0, 12);
    });
    toast.message("Refreshed supervised feed", { description: "Mock rows — calm telemetry aesthetic." });
  }, []);

  const onHash = (hash: string) => {
    const href = hashHref(hash);
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    else toast.message("Mock transaction id", { description: hash });
  };

  return (
    <section id="live-feed" className="py-20 md:py-32 bg-muted/20 scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Supervised transaction feed</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Mock activity styled like production telemetry. Each row shows whether a human explicitly approved, or
            policy auto-approved within guardrails.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-2 bg-muted/10">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-cyan-500/80 motion-safe:animate-pulse shrink-0" />
              <span className="text-muted-foreground text-xs font-mono truncate">x402 · human-aware mock feed</span>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="text-muted-foreground hover:text-accent transition-colors cursor-pointer shrink-0 p-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Refresh feed"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <ul className="divide-y divide-border/80 max-h-[400px] overflow-y-auto scrollbar-hide">
            {rows.map((tx, i) => (
              <motion.li
                key={`${tx.hash}-${i}`}
                initial={i === 0 ? { opacity: 0, y: -6 } : false}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">{tx.time}</span>
                  <span className="font-mono text-accent font-semibold shrink-0">{tx.amount} USDC</span>
                  <span className="text-muted-foreground text-xs truncate hidden sm:inline flex-1 min-w-0">
                    {tx.from} → {tx.to}
                  </span>
                  <button
                    type="button"
                    onClick={() => onHash(tx.hash)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  >
                    {tx.hash.slice(0, 12)}… <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                  </button>
                  <span
                    className={`hidden md:inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 ${
                      tx.approvalMode === "manual"
                        ? "border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <UserCheck className="h-3 w-3" aria-hidden />
                    {tx.approvalMode === "manual" ? tx.approvedBy : "Auto"}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground max-w-2xl mx-auto">
          TX-MOCK ids open an in-page toast; real testnet hashes would deep-link to Stellar Expert.
        </p>
      </div>
    </section>
  );
}
