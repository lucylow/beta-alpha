import { motion } from "framer-motion";
import { Eye, CheckCircle2, PencilLine, ScrollText } from "lucide-react";

const cards = [
  {
    icon: Eye,
    title: "Review",
    body: "Humans see the query before it runs.",
    chip: "Visibility",
  },
  {
    icon: CheckCircle2,
    title: "Approve",
    body: "Humans confirm payment and policy fit.",
    chip: "Consent",
  },
  {
    icon: PencilLine,
    title: "Override",
    body: "Edit the plan or block risky actions.",
    chip: "Control",
  },
  {
    icon: ScrollText,
    title: "Audit",
    body: "Every action is logged and reviewable.",
    chip: "Traceability",
  },
];

export default function HitlValueSection() {
  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-muted/40 scroll-mt-28 border-y border-border/50"
      aria-labelledby="hitl-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-accent mb-3">Human-in-the-loop</p>
          <h2 id="hitl-heading" className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Autonomous enough to be useful.{" "}
            <span className="text-gradient-hero">Human enough to be safe.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Human-in-the-loop is not friction. It is a safety feature, a trust feature, a budget feature, and a
            governance feature — built into how agents pay for search.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover hover:border-accent/25 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <c.icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  {c.chip}
                </span>
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12 max-w-xl mx-auto"
        >
          Agents propose. Humans approve. Payments execute. Results return.
        </motion.p>
      </div>
    </section>
  );
}
