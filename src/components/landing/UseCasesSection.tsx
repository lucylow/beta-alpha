import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { hitlUseCases } from "@/content/landing-mock-data";

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="py-20 md:py-32 bg-background scroll-mt-28 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Where supervision <span className="text-gradient-hero">earns its keep</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Practical workflows where a human gate improves quality, not just safety.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {hitlUseCases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover motion-safe:hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              <Badge variant="secondary" className="font-mono text-[10px] w-fit">
                Human approval mode
              </Badge>
              <h3 className="text-lg font-display font-semibold text-foreground mt-3">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1 leading-relaxed">{c.desc}</p>
              <p className="mt-4 text-sm text-foreground/90 border-t border-border pt-4">{c.outcome}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
