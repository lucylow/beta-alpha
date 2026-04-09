import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "sonner";
import { trustFaqs } from "@/content/landing-mock-data";

export default function FAQSection() {
  const [showContact, setShowContact] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", question: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = "x402-contact-messages";
    try {
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as typeof form[];
      localStorage.setItem(key, JSON.stringify([{ ...form, at: new Date().toISOString() }, ...prev].slice(0, 20)));
    } catch {
      localStorage.setItem(key, JSON.stringify([{ ...form }]));
    }
    toast.success("Message saved locally (demo) — thanks for reaching out.");
    setForm({ name: "", email: "", question: "" });
    setShowContact(false);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-muted/30 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Questions, calmly answered</h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Focused on trust: approvals, budgets, auditability, and what is real vs mock on this page.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {trustFaqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="border border-border rounded-xl px-5 data-[state=open]:shadow-card transition-shadow"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:text-accent hover:no-underline py-4 text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowContact(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <MessageCircle className="h-4 w-4" /> Team contact
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showContact && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-6"
            onClick={() => setShowContact(false)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-modal-title"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 id="contact-modal-title" className="font-display font-bold text-foreground text-lg">
                  Contact the team
                </h3>
                <button
                  type="button"
                  onClick={() => setShowContact(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <textarea
                  placeholder="Your question…"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  required
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-accent-foreground font-semibold text-sm hover:shadow-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
                >
                  <Send className="h-4 w-4" /> Send (demo)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
