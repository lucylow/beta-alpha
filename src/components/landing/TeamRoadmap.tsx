import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Check, Circle, Sparkles } from "lucide-react";

const team = [
  {
    name: "Alex Chen",
    role: "Engineering lead",
    specialty: "MCP + TypeScript servers",
    github: "https://github.com",
    why: "Supervised tools ship faster — humans stay on the hook for spend and scope.",
  },
  {
    name: "Jamie Lee",
    role: "Stellar integration",
    specialty: "x402 + Horizon flows",
    github: "https://github.com",
    why: "Micropayments only matter if approvals are legible on-chain and in logs.",
  },
  {
    name: "Taylor Kim",
    role: "Product & narrative",
    specialty: "Developer UX + demos",
    github: "https://github.com",
    why: "We built the approval path first so trust is obvious, not assumed.",
  },
];

const milestones = [
  { date: "Apr 2026", title: "MVP: testnet search demo", desc: "x402 bridge, Brave provider, landing sim.", done: true },
  { date: "May 2026", title: "x402 sessions", desc: "Long-lived authorizations + spend caps.", done: false },
  { date: "Jun 2026", title: "Multi-search-provider support", desc: "Pluggable backends + policy routing.", done: false },
  { date: "Jul 2026", title: "Spending policy wallet", desc: "Contract accounts + delegated limits.", done: false },
  { date: "Aug 2026", title: "Production mainnet support", desc: "Facilitator hardening + audits.", done: false },
  { date: "Sep 2026", title: "Analytics dashboard", desc: "Usage, errors, and settlement traces.", done: false },
];

const changelog = [
  { when: "Apr 2026", note: "Live demo simulator + transaction feed UX." },
  { when: "Apr 2026", note: "Freighter connect with Horizon USDC balance read." },
];

export default function TeamRoadmap() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  return (
    <section id="roadmap" className="py-24 md:py-32 bg-background scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Team, roadmap &amp; <span className="text-gradient-hero">changelog</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Replace placeholder GitHub links with your real profiles before submission.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">Governance model</h4>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>
                  <strong className="text-foreground">Approvers:</strong> designated humans or roles who can authorize spend above policy.
                </li>
                <li>
                  <strong className="text-foreground">Auditors:</strong> read-only access to logs, exports, and settlement hashes.
                </li>
                <li>
                  <strong className="text-foreground">Policy owners:</strong> set caps, allowlists, and auto-approval windows.
                </li>
                <li>
                  <strong className="text-foreground">Multi-approver:</strong> map alternating reviewers for high-risk domains (enterprise pattern).
                </li>
              </ul>
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              Builders <Sparkles className="h-4 w-4 text-accent" />
            </h3>
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border p-5 hover:shadow-card transition-shadow bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-display font-bold">
                      {m.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </div>
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-colors shrink-0"
                    aria-label={`${m.name} on GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
                <p className="text-[11px] uppercase tracking-wide text-accent/90 mt-3">{m.specialty}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">&ldquo;{m.why}&rdquo;</p>
              </motion.div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] rounded-full border border-border px-2 py-1 text-muted-foreground">Open source</span>
              <span className="text-[10px] rounded-full border border-border px-2 py-1 text-muted-foreground">Testnet ready</span>
              <span className="text-[10px] rounded-full border border-border px-2 py-1 text-muted-foreground">Demo ready</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-lg font-display font-semibold text-foreground mb-5">Roadmap</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                {milestones.map((m, i) => (
                  <button
                    type="button"
                    key={m.title}
                    onClick={() => setActiveMilestone(activeMilestone === i ? null : i)}
                    className="w-full text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="flex items-start gap-4 p-3 hover:bg-muted/50 transition-colors rounded-xl">
                      <div className="relative mt-1 shrink-0">
                        {m.done ? (
                          <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-success" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-border flex items-center justify-center">
                            <Circle className="h-2 w-2 text-muted-foreground" />
                          </div>
                        )}
                        {i < milestones.length - 1 && (
                          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-border" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-accent">{m.date}</p>
                        <p className={`font-medium text-sm ${m.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {m.title}
                        </p>
                        <AnimatePresence>
                          {activeMilestone === i && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-muted-foreground mt-1"
                            >
                              {m.desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 h-fit">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Latest updates</h4>
                <ul className="space-y-3">
                  {changelog.map((c) => (
                    <li key={c.note} className="text-sm">
                      <span className="font-mono text-accent text-xs">{c.when}</span>
                      <p className="text-muted-foreground mt-0.5">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
