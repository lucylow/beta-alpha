import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Package, Mail, Twitter, BookOpen, MessageCircle, FlaskConical } from "lucide-react";
import { toast } from "sonner";

const NEWSLETTER_KEY = "x402-newsletter-subscribers";

export default function FooterCTA() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const prev = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) ?? "[]") as string[];
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify([email.trim(), ...prev].slice(0, 100)));
    } catch {
      localStorage.setItem(NEWSLETTER_KEY, JSON.stringify([email.trim()]));
    }
    toast.success(`Thanks! We'll notify you at ${email.trim()} (demo)`);
    setEmail("");
  };

  return (
    <>
      <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 py-14 md:py-16">
          <div className="grid md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-mono font-bold text-sm">
                  x4
                </div>
                <span className="font-display font-bold text-lg">
                  x402<span className="text-accent">Search</span>
                </span>
              </div>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                Agents can act faster when humans can see, approve, and adjust what happens next. MCP-native x402 search
                with supervision built in.
              </p>
              <a
                href="#install"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("install")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent/15 text-accent px-5 py-2.5 text-sm font-semibold hover:bg-accent/25 transition-colors cursor-pointer"
              >
                <Package className="h-4 w-4" /> Install MCP Server
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/45 mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "Interactive demo", href: "/demo", icon: FlaskConical, internal: true },
                  { label: "Specialized agents doc", href: "/specialized-agents", icon: BookOpen, internal: true },
                  { label: "x402 on Stellar", href: "https://developers.stellar.org/docs/build/agentic-payments/x402", icon: BookOpen },
                  { label: "GitHub topic: x402", href: "https://github.com/topics/x402", icon: Github },
                  { label: "Docs hub", href: "#docs", icon: BookOpen },
                  { label: "Stellar Discord", href: "https://discord.gg/stellar", icon: MessageCircle },
                  { label: "Stellar on X", href: "https://twitter.com/StellarOrg", icon: Twitter },
                ].map(({ label, href, icon: Icon, internal }) => (
                  <li key={label}>
                    {internal ? (
                      <Link
                        to={href}
                        className="text-primary-foreground/70 hover:text-accent flex items-center gap-2 transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5 opacity-60" />
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-primary-foreground/70 hover:text-accent flex items-center gap-2 transition-colors cursor-pointer"
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        onClick={
                          href.startsWith("#")
                            ? (e) => {
                                e.preventDefault();
                                document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
                              }
                            : undefined
                        }
                      >
                        <Icon className="h-3.5 w-3.5 opacity-60" />
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/45 mb-4">Newsletter</h3>
              <p className="text-primary-foreground/55 text-sm mb-3">
                Updates on human-in-the-loop tooling and policy releases — sparingly.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/35 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="submit"
                  className="rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold hover:shadow-glow transition-shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="h-4 w-4" /> Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 py-6">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/40">
            <span>
              © {new Date().getFullYear()} x402 Web Search MCP — Stellar Hacks: Agents · demo UI uses mock data unless
              otherwise labeled
            </span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors cursor-pointer">
                Privacy
              </a>
              <a href="#" className="hover:text-accent transition-colors cursor-pointer">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
