import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, PauseCircle } from "lucide-react";
import { policyControlsMock } from "@/content/landing-mock-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const controlList = [
  { label: "Daily spending limits", ok: true },
  { label: "Per-query caps", ok: true },
  { label: "Allowlist / blocklist", ok: true },
  { label: "Human approval thresholds", ok: true },
  { label: "Budget alerts", ok: true },
  { label: "Emergency pause", ok: true },
  { label: "Query editing", ok: true },
  { label: "Audit logging", ok: true },
];

export default function SecuritySection() {
  const [paused, setPaused] = useState(false);
  const [dailyPct, setDailyPct] = useState([72]);
  const perQuery = policyControlsMock.budget.perQueryLimit;
  const daily = policyControlsMock.budget.dailyLimit;

  return (
    <section id="safety" className="py-20 md:py-32 bg-background scroll-mt-28 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-12"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Shield className="h-7 w-7" aria-hidden />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Risk controls &amp; policy
            </h2>
            <p className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed">
              Safety is not an extra step. Safety is part of the workflow. Model budgets, permissions, and escalation
              paths before agents touch production networks.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-mono uppercase text-muted-foreground">Policy center · mock</p>
                <h3 className="text-lg font-display font-semibold text-foreground mt-1">Budget &amp; permissions</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 bg-muted/30">
                <PauseCircle className={`h-4 w-4 ${paused ? "text-destructive" : "text-muted-foreground"}`} />
                <Label htmlFor="emergency-pause" className="text-xs cursor-pointer">
                  Pause spend
                </Label>
                <Switch
                  id="emergency-pause"
                  checked={paused}
                  onCheckedChange={setPaused}
                  aria-label="Emergency pause all spending"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
                <p className="text-[10px] uppercase text-muted-foreground">Daily limit</p>
                <p className="text-xl font-mono font-semibold text-foreground mt-1">{daily}</p>
              </div>
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
                <p className="text-[10px] uppercase text-muted-foreground">Per-query cap</p>
                <p className="text-xl font-mono font-semibold text-foreground mt-1">{perQuery}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Daily budget usage (illustrative)</span>
                  <span className="font-mono text-foreground">{dailyPct[0]}%</span>
                </div>
                <Slider
                  value={dailyPct}
                  onValueChange={setDailyPct}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Adjust illustrative daily budget usage percent"
                />
              </div>

              <div className="grid gap-3">
                <PolicyToggle
                  label="Allow web search"
                  description="Permit Brave-backed retrieval"
                  initial={policyControlsMock.permissions.allowSearch}
                />
                <PolicyToggle
                  label="Allow external browsing"
                  description="Off by default in supervised mode"
                  initial={policyControlsMock.permissions.allowExternalBrowsing}
                />
                <PolicyToggle
                  label="Allow auto-retry"
                  description="Requires human policy in high-risk orgs"
                  initial={policyControlsMock.permissions.allowAutoRetry}
                />
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm">
                <p className="text-foreground font-medium">Approval threshold</p>
                <p className="text-muted-foreground mt-1">
                  Human review above <span className="font-mono text-accent">{policyControlsMock.approval.requiredAbove}</span>
                  {policyControlsMock.approval.humanCanOverride ? " · Overrides permitted for break-glass." : ""}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-border bg-muted/20 p-6 md:p-8"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-4">Control checklist</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {controlList.map((item) => (
                <li
                  key={item.label}
                  className="flex gap-3 rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
              This panel uses mock toggles to visualize control density — wire your facilitator and policy service for
              real enforcement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PolicyToggle({ label, description, initial }: { label: string; description: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch id={id} checked={on} onCheckedChange={setOn} aria-label={label} />
    </div>
  );
}
