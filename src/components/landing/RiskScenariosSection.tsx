import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Globe, FileSearch } from "lucide-react";

const risks = [
  {
    id: "runaway-retries",
    icon: AlertTriangle,
    title: "Runaway retries",
    description: "Agents may keep trying the same query and spend repeatedly.",
    severity: "High",
    resolution: "Blocked by retry limits",
  },
  {
    id: "overspending",
    icon: ShieldAlert,
    title: "Overspending",
    description: "A small action can become an expensive loop without caps.",
    severity: "High",
    resolution: "Blocked by budget caps",
  },
  {
    id: "unsafe-domain",
    icon: Globe,
    title: "Unsafe domain access",
    description: "Agents may query sources you do not want them to use.",
    severity: "Medium",
    resolution: "Blocked by allowlist",
  },
  {
    id: "no-audit",
    icon: FileSearch,
    title: "No audit trail",
    description: "Without logs, you cannot explain what the agent did.",
    severity: "High",
    resolution: "Solved by logging",
  },
];

function severityColor(s: string) {
  if (s === "High") return "text-destructive border-destructive/30 bg-destructive/10";
  if (s === "Medium") return "text-warning border-warning/30 bg-warning/10";
  return "text-muted-foreground border-border bg-muted/30";
}

export default function RiskScenariosSection() {
  return (
    <section id="risks" className="py-20 md:py-32 bg-background scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            What can go wrong <span className="text-destructive/90">without guardrails</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed">
            Every risk below is addressed by a specific guardrail in the x402 stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl">
          {risks.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <r.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-foreground">{r.title}</h3>
                    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-mono ${severityColor(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                  <p className="mt-3 text-xs font-mono text-success">
                    ✓ {r.resolution}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
