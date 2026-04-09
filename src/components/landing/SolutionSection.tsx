import { motion } from "framer-motion";
import { Zap, Globe, Bot, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const cards = [
  {
    icon: Zap,
    title: "x402",
    subtitle: "Pay-per-use search",
    points: ["HTTP 402 challenges map cleanly to agent retries", "No standing API subscriptions for occasional pulls", "Payment settles when the resource is delivered"],
    detail:
      "x402 makes search pay-per-use. Your MCP client sees the challenge, waits for policy + human approval, then retries with authorization.",
    code: `// 402 body (illustrative)\n{\n  "amount": "0.001",\n  "token": "USDC",\n  "network": "stellar:testnet"\n}`,
  },
  {
    icon: Globe,
    title: "Stellar",
    subtitle: "Fast settlement",
    points: ["USDC micropayments that still feel micro", "Horizon + testnet for safe iteration", "Mainnet-ready facilitator path"],
    detail:
      "Stellar keeps per-query economics sane. Settlement is quick enough for interactive agents while staying easy to audit.",
    code: `const network = {\n  passphrase: "Test SDF Network ; September 2015",\n  horizon: "https://horizon-testnet.stellar.org"\n};`,
  },
  {
    icon: Bot,
    title: "MCP",
    subtitle: "Standard tool surface",
    points: ["One server for Claude Code, Cursor, Windsurf", "Tool name: web_search", "JSON launcher config"],
    detail:
      "MCP is the neutral port for tools. Ship one server and every compatible client gains supervised, paid web search.",
    code: `{\n  "mcpServers": {\n    "x402-web-search": {\n      "command": "node",\n      "args": ["dist/index.js"]\n    }\n  }\n}`,
  },
  {
    icon: UserRoundCheck,
    title: "Human overlay",
    subtitle: "Approval + policy",
    points: ["Request review before funds move", "Budget caps + allowlists in one layer", "Execution log tied to approver notes"],
    detail:
      "The human layer is not a footnote — it is the control plane. Agents propose; humans approve or edit; payments execute; results and audits return.",
    code: `// Approval envelope (conceptual)\n{\n  "query": "…",\n  "estCost": "0.001 USDC",\n  "decision": "approve",\n  "note": "OK for summary"\n}`,
  },
];

const overlayHighlights = [
  { label: "Request review", desc: "Intent, scope, and cost surface before spend" },
  { label: "Budget approval", desc: "Daily and per-query ceilings enforced" },
  { label: "Policy enforcement", desc: "Domains, retries, and sensitivity rules" },
  { label: "Execution log", desc: "Human + agent actions, timestamped" },
];

export default function SolutionSection() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <section id="solution" className="py-24 md:py-32 bg-muted/30 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            A safety-first stack: <span className="text-gradient-hero">controlled by design</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            x402 makes search pay-per-use. Stellar handles settlement. MCP integrates into AI clients. The human overlay
            keeps the loop legible and governable.
          </p>
        </motion.div>

        <div className="mt-14 grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="grid sm:grid-cols-2 gap-5">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative group rounded-2xl border bg-card p-7 shadow-card hover:shadow-card-hover motion-safe:hover:-translate-y-1 transition-all duration-300 cursor-default ${
                  card.title === "Human overlay" ? "border-accent/40 ring-1 ring-accent/15" : "border-border hover:border-accent/20"
                }`}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <card.icon className="h-6 w-6 text-accent" aria-hidden />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground">{card.title}</h3>
                <p className="text-sm text-secondary font-medium mt-1">{card.subtitle}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setModalIndex(i)}
                  className="mt-5 text-accent text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  Technical detail
                </button>
              </motion.div>
            ))}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-accent/25 bg-gradient-to-b from-accent/10 to-card p-6 shadow-card lg:sticky lg:top-28"
            aria-label="Human oversight layer"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-accent mb-2">Human-in-the-loop layer</p>
            <h3 className="text-lg font-display font-bold text-foreground">Supervision without bureaucracy</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Same flow you would insist on for a junior analyst — visible intent, explicit budget, and receipts.
            </p>
            <ul className="mt-5 space-y-3">
              {overlayHighlights.map((h) => (
                <li key={h.label} className="rounded-xl border border-border/80 bg-background/60 px-3 py-3">
                  <p className="text-sm font-medium text-foreground">{h.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </div>

      <Dialog open={modalIndex !== null} onOpenChange={(o) => !o && setModalIndex(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {modalIndex !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{cards[modalIndex].title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed">{cards[modalIndex].detail}</p>
              <pre className="mt-4 rounded-xl bg-primary p-4 text-xs text-primary-foreground/85 font-mono overflow-x-auto">
                <code>{cards[modalIndex].code}</code>
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
