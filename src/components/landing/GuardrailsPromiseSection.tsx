import { motion } from "framer-motion";
import { ShieldCheck, Wallet, ListChecks, Ban, FileText, Pause } from "lucide-react";

const guardrails = [
  {
    icon: ShieldCheck,
    title: "Human approval",
    desc: "Risky or costly actions require review before any payment executes.",
  },
  {
    icon: Wallet,
    title: "Budget limits",
    desc: "Agents cannot exceed allowed spend — daily caps and per-query ceilings enforced.",
  },
  {
    icon: ListChecks,
    title: "Allowlists",
    desc: "Only approved endpoints or domains can be queried by the agent.",
  },
  {
    icon: Ban,
    title: "Blocklists",
    desc: "Dangerous or forbidden actions are blocked before they reach the network.",
  },
  {
    icon: FileText,
    title: "Audit logs",
    desc: "Every action, approval, and denial is timestamped and traceable.",
  },
  {
    icon: Pause,
    title: "Emergency pause",
    desc: "Freeze all agent spending instantly — one toggle, zero delay.",
  },
];

export default function GuardrailsPromiseSection() {
  return (
    <section id="guardrails" className="py-20 md:py-32 bg-muted/30 scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Guardrails are what make agentic search{" "}
            <span className="text-gradient-hero">safe enough to use.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            Power is useful only when it is bounded. Every guardrail exists so you can trust the system enough to adopt it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {guardrails.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent mb-4">
                <g.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-display font-semibold text-foreground">{g.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
