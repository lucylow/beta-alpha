import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const STORAGE_KEY = "x402-hitl-updates";

export default function ContactCaptureSection() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([email.trim(), ...prev].slice(0, 100)));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([email.trim()]));
    }
    toast.success("You're on the list — thanks for the interest (demo)");
    setEmail("");
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/40 border-t border-border/50 scroll-mt-28" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 id="contact-heading" className="text-2xl md:text-4xl font-display font-bold text-foreground">
            Stay in the loop
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Get updates on the human-in-the-loop version of the product. We&apos;ll only use this email for build notes
            in this demo — stored locally in your browser.
          </p>
          <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="contact-email" className="sr-only">
              Email for updates
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@team.com"
              className="flex-1 rounded-full border border-border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <button
              type="submit"
              className="rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            >
              Notify me
            </button>
          </form>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Privacy: demo only — no server call. Clear site data to remove stored emails.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
