import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X, Pencil, Shield } from "lucide-react";
import { approvalWorkflowMock } from "@/content/landing-mock-data";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ReviewState = "pending" | "edited" | "approved" | "denied" | "escalated";

export default function ApprovalWorkflowSection() {
  const [state, setState] = useState<ReviewState>("pending");
  const [query, setQuery] = useState(approvalWorkflowMock.query);
  const [note, setNote] = useState("");
  const [budgetCap, setBudgetCap] = useState("0.002");
  const [rememberSimilar, setRememberSimilar] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setState("pending");
    setQuery(approvalWorkflowMock.query);
    setNote("");
    setBudgetCap("0.002");
    setRememberSimilar(false);
  }, []);

  useEffect(() => {
    if (state === "pending") return;
    const t = window.setTimeout(() => {
      /* optional: auto-reset demo after viewing success — keep state for judges to inspect */
    }, 0);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <section
      id="approval-workflow"
      className="py-20 md:py-32 bg-background scroll-mt-28"
      aria-labelledby="approval-workflow-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-xs font-mono text-accent mb-2">Review before spend · Approve before execute</p>
          <h2 id="approval-workflow-heading" className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Approval <span className="text-gradient-hero">workflow</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Interactive mock: inspect the agent proposal, emphasize cost, then approve, deny, edit, or escalate.
          </p>
        </motion.div>

        <div ref={panelRef} className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-violet-500 motion-safe:animate-pulse" aria-hidden />
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Agent proposal</h3>
            </div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">Search query</dt>
                <dd className="mt-1 font-medium text-foreground">{query}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">Reason</dt>
                <dd className="mt-1 text-muted-foreground">{approvalWorkflowMock.reason}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground">Est. cost</dt>
                  <dd className="mt-1 font-mono text-accent font-semibold">{approvalWorkflowMock.estimatedCost}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-muted-foreground">Risk</dt>
                  <dd className="mt-1 flex items-center gap-1 text-foreground">
                    <Shield className="h-3.5 w-3.5 text-success" aria-hidden />
                    {approvalWorkflowMock.riskLevel}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">Source requirement</dt>
                <dd className="mt-1 text-muted-foreground">{approvalWorkflowMock.sourceRequirement}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">Confidence</dt>
                <dd className="mt-1 text-muted-foreground">{approvalWorkflowMock.confidence}</dd>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
                <p className="text-[10px] uppercase text-muted-foreground mb-2">Active policy</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>Daily limit: {approvalWorkflowMock.policy.dailyLimit}</li>
                  <li>Single request cap: {approvalWorkflowMock.policy.singleRequestLimit}</li>
                  <li>Requires approval: {approvalWorkflowMock.policy.requiresApproval ? "Yes" : "No"}</li>
                </ul>
              </div>
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-accent/25 bg-card p-6 md:p-8 shadow-card ring-1 ring-accent/10"
          >
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Human review</h3>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
              >
                Reset demo
              </button>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 mb-4">
              <p className="text-[10px] uppercase text-muted-foreground mb-1">Cost preview</p>
              <p className="text-2xl font-display font-bold text-foreground tabular-nums">
                {approvalWorkflowMock.estimatedCost}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Charged only after you approve execution (mock).</p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-medium text-foreground">
                Edit query
                <textarea
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (state === "pending") setState("edited");
                  }}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <label className="block text-xs font-medium text-foreground">
                Budget cap (USDC)
                <input
                  type="text"
                  inputMode="decimal"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                  aria-describedby="budget-cap-hint"
                />
                <span id="budget-cap-hint" className="text-[11px] text-muted-foreground">
                  Mock field — ties to facilitator policy in production.
                </span>
              </label>
              <label className="block text-xs font-medium text-foreground">
                Audit note
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Why you approved / denied…"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </label>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-3">
                <Label htmlFor="remember-similar" className="text-xs text-foreground cursor-pointer">
                  Remember for similar queries (demo toggle)
                </Label>
                <Switch
                  id="remember-similar"
                  checked={rememberSimilar}
                  onCheckedChange={setRememberSimilar}
                  aria-label="Toggle one-time versus remember similar queries"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={state !== "pending" && state !== "edited"}
                onClick={() => setState("approved")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground py-3.5 text-sm font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
              >
                <Check className="h-4 w-4" aria-hidden /> Approve &amp; pay (mock)
              </button>
              <button
                type="button"
                disabled={state !== "pending" && state !== "edited"}
                onClick={() => setState("denied")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/40 text-destructive py-3.5 text-sm font-semibold hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
              >
                <X className="h-4 w-4" aria-hidden /> Deny
              </button>
              <button
                type="button"
                disabled={state !== "pending" && state !== "edited"}
                onClick={() => setState("edited")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3.5 text-sm font-medium text-foreground hover:bg-muted/50 sm:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Pencil className="h-4 w-4" aria-hidden /> Mark edited
              </button>
              <button
                type="button"
                disabled={state !== "pending" && state !== "edited"}
                onClick={() => setState("escalated")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 text-amber-700 dark:text-amber-400 py-3.5 text-sm font-medium hover:bg-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="h-4 w-4" aria-hidden />
                Escalate
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mt-6 rounded-xl border p-4 text-sm"
                role="status"
                aria-live="polite"
              >
                {state === "pending" && (
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Awaiting review.</strong> Nothing executes until you choose an
                    outcome.
                  </p>
                )}
                {state === "edited" && (
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Edited by human.</strong> Re-check cost and policy, then approve
                    or deny.
                  </p>
                )}
                {state === "approved" && (
                  <p className="text-success">
                    <strong>Approved.</strong> Mock payment authorized{note ? ` — note: “${note}”` : ""}. Results would
                    stream next; audit entry created.
                  </p>
                )}
                {state === "denied" && (
                  <p className="text-destructive">
                    <strong>Denied.</strong> No funds move. Agent receives denial context{note ? ` — “${note}”` : ""}.
                  </p>
                )}
                {state === "escalated" && (
                  <p className="text-amber-700 dark:text-amber-400 flex gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                    <span>
                      <strong>Escalated.</strong> Routed to manual inspection queue (mock). Spending paused for this
                      thread.
                    </span>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
