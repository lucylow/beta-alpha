import { motion } from "framer-motion";
import { auditLogMock } from "@/content/landing-mock-data";

function statusStyles(status: string) {
  const s = status.toLowerCase();
  if (s.includes("confirm")) return "text-success border-success/30 bg-success/10";
  if (s.includes("await")) return "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5";
  if (s.includes("stop")) return "text-destructive border-destructive/30 bg-destructive/10";
  return "text-muted-foreground border-border bg-muted/30";
}

export default function AuditTrailSection() {
  return (
    <section id="audit" className="py-20 md:py-32 bg-muted/30 scroll-mt-28 border-t border-border/40" aria-labelledby="audit-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 id="audit-heading" className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Audit trail
          </h2>
          <p className="mt-3 text-muted-foreground text-base md:text-lg">
            Every action is visible. Every approval is traceable.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
            <span className="text-xs font-mono text-muted-foreground">Supervision log · mock rows</span>
            <span className="text-[10px] uppercase tracking-wider text-accent">Live-shaped UI</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Approval and agent activity log</caption>
              <thead>
                <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">
                    Time
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Actor
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Action
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium hidden md:table-cell">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogMock.map((row, i) => (
                  <motion.tr
                    key={`${row.time}-${i}`}
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/80 last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          row.actor === "Human"
                            ? "bg-violet-500/15 text-violet-700 dark:text-violet-300"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {row.actor}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.action}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] ${statusStyles(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-xs">{row.note}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
