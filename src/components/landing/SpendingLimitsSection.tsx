import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, AlertTriangle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const DAILY_LIMIT = 0.05;
const PER_QUERY = 0.002;
const WARNING_PCT = 80;

export default function SpendingLimitsSection() {
  const [usedPct, setUsedPct] = useState([24]);
  const used = ((usedPct[0] / 100) * DAILY_LIMIT).toFixed(4);
  const remaining = (DAILY_LIMIT - Number(used)).toFixed(4);
  const isWarning = usedPct[0] >= WARNING_PCT;
  const isBlocked = usedPct[0] >= 100;

  const barColor = isBlocked
    ? "bg-destructive"
    : isWarning
    ? "bg-warning"
    : "bg-success";

  return (
    <section id="spending" className="py-20 md:py-32 bg-muted/30 scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Wallet className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Spending limits
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Guardrails should protect budget without hiding usage. Drag the slider to simulate spend.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
        >
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">Daily limit</p>
              <p className="text-lg font-mono font-semibold text-foreground mt-1">{DAILY_LIMIT} USDC</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">Per-query cap</p>
              <p className="text-lg font-mono font-semibold text-foreground mt-1">{PER_QUERY} USDC</p>
            </div>
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">Remaining</p>
              <p className={`text-lg font-mono font-semibold mt-1 ${isBlocked ? "text-destructive" : isWarning ? "text-warning" : "text-success"}`}>
                {remaining} USDC
              </p>
            </div>
          </div>

          {/* Budget bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Used: <span className="font-mono text-foreground">{used} USDC</span></span>
              <span className="font-mono text-foreground">{usedPct[0]}%</span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all ${barColor}`}
                style={{ width: `${Math.min(usedPct[0], 100)}%` }}
              />
              {/* Warning marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-warning/70"
                style={{ left: `${WARNING_PCT}%` }}
                title={`Warning at ${WARNING_PCT}%`}
              />
            </div>
          </div>

          <Slider
            value={usedPct}
            onValueChange={setUsedPct}
            max={100}
            step={1}
            className="w-full mt-4"
            aria-label="Simulate daily budget usage"
          />

          {isBlocked && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              Budget exhausted — further requests are blocked until reset.
            </div>
          )}
          {isWarning && !isBlocked && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
              <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden />
              Approaching daily limit — review remaining budget.
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Mock slider · in production the budget bar reflects live facilitator state.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
