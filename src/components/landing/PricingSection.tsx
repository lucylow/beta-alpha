import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const API_SIGNUP_KEY = "x402-api-signups";

export default function PricingSection() {
  const [isMainnet, setIsMainnet] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const submitApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const prev = JSON.parse(localStorage.getItem(API_SIGNUP_KEY) ?? "[]") as string[];
      localStorage.setItem(API_SIGNUP_KEY, JSON.stringify([email.trim(), ...prev].slice(0, 50)));
    } catch {
      localStorage.setItem(API_SIGNUP_KEY, JSON.stringify([email.trim()]));
    }
    toast.success(`You're on the list — we'll follow up at ${email.trim()} (demo)`);
    setEmail("");
    setApiModalOpen(false);
  };

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Predictable spend, <span className="text-gradient-hero">approval-aware</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pricing is paired with control: visibility, budgets, and who can authorize what.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <Label
              htmlFor="pricing-mode"
              className={`text-sm font-medium cursor-pointer ${!isMainnet ? "text-foreground" : "text-muted-foreground"}`}
            >
              Testnet demo
            </Label>
            <Switch
              id="pricing-mode"
              checked={isMainnet}
              onCheckedChange={setIsMainnet}
              className="data-[state=checked]:bg-accent cursor-pointer"
              aria-label="Toggle mainnet pricing"
            />
            <Label
              htmlFor="pricing-mode"
              className={`text-sm font-medium cursor-pointer ${isMainnet ? "text-foreground" : "text-muted-foreground"}`}
            >
              Mainnet usage
            </Label>
          </div>
          <p className="text-xs text-muted-foreground max-w-md text-center">
            Emphasis on predictable, supervised usage — not sticker price alone.
          </p>
        </div>

        <motion.div layout className="mt-10 max-w-lg mx-auto rounded-2xl border-2 border-accent/30 bg-card p-6 md:p-8 shadow-card-hover">
          <div className="text-center">
            <motion.div
              key={isMainnet ? "main" : "test"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!isMainnet ? (
                <>
                  <span className="text-4xl md:text-5xl font-display font-bold text-foreground">0.001</span>
                  <span className="text-lg md:text-xl font-medium text-muted-foreground ml-2">testnet USDC / search</span>
                  <p className="text-muted-foreground mt-2 text-sm">Simulated payments · no real funds required</p>
                  <p className="text-success font-medium text-sm mt-1">Ideal for demos and approvals testing</p>
                </>
              ) : (
                <>
                  <span className="text-4xl md:text-5xl font-display font-bold text-foreground">$0.001</span>
                  <span className="text-lg md:text-xl font-medium text-muted-foreground ml-2">per search</span>
                  <p className="text-muted-foreground mt-2 text-sm">Pay per query with budget limits you set</p>
                  <p className="text-foreground font-medium text-sm mt-1">
                    Human approval thresholds + predictable usage-based spend
                  </p>
                  <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
                    Illustrative — final economics follow facilitator + FX fees.
                  </p>
                </>
              )}
            </motion.div>
          </div>

          <div className="mt-8 space-y-3">
            {!isMainnet ? (
              <>
                <Feature text="Explicit approval UI in demo paths" />
                <Feature text="Circle USDC faucet + Horizon testnet" />
                <Feature text="Same x402 shape as production" />
              </>
            ) : (
              <>
                <Feature text="Configurable approval above threshold" />
                <Feature text="Daily / per-query caps (policy service)" />
                <Feature text="Audit trail tied to approvers" />
              </>
            )}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-left">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Approval mode</p>
            <p className="text-sm text-muted-foreground mt-2">
              {!isMainnet
                ? "Every mock payment waits for an explicit click-path — mirrors how we expect regulated teams to start."
                : "Graduate to automated approvals only inside guardrails you configure; humans stay on the hook for overrides."}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Budget policy note: start with tight daily ceilings, expand as you trust the agent’s query quality.
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-6 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">On the roadmap</p>
            <Addon label="Session payments (x402 V2)" badge="coming soon" />
            <Addon label="Spending policies" hint="contract accounts" />
            <Addon label="Multi-provider search" badge="roadmap" />
            <Addon label="Guardrails & analytics" badge="Q3 2026" />
          </div>

          <button
            type="button"
            onClick={() => setApiModalOpen(true)}
            className="mt-8 w-full rounded-full bg-accent text-accent-foreground py-3 font-semibold text-sm hover:shadow-glow transition-shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            Start with demo mode
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Join the builder list for mainnet readiness — local demo only, no server call.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {apiModalOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
            role="presentation"
            onClick={() => setApiModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pricing-modal-title"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 id="pricing-modal-title" className="font-display font-bold text-lg text-foreground">
                  Get updates
                </h3>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  aria-label="Close"
                  onClick={() => setApiModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Human-in-the-loop releases and policy tooling. Stored locally for this demo — no server.
              </p>
              <form onSubmit={submitApi} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@build.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent text-accent-foreground py-3 font-semibold text-sm cursor-pointer"
                >
                  Join waitlist
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground">
      <Check className="h-4 w-4 text-success shrink-0" />
      {text}
    </div>
  );
}

function Addon({ label, badge, hint }: { label: string; badge?: string; hint?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Clock className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {hint && (
        <span className="text-xs text-muted-foreground/80 border border-border rounded-md px-2 py-0.5" title={hint}>
          {hint}
        </span>
      )}
      {badge && (
        <Badge variant="secondary" className="text-[10px] shrink-0">
          {badge}
        </Badge>
      )}
    </div>
  );
}
