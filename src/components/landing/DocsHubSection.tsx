import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BookOpen, ExternalLink, Github, PlayCircle, Layers, MessageCircle } from "lucide-react";

const resources: {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "x402 repos & examples",
    desc: "Discover open-source x402 integrations to fork or reference.",
    href: "https://github.com/topics/x402",
    icon: Github,
  },
  {
    title: "x402 on Stellar",
    desc: "Official agentic payments guide: 402 challenges, USDC, facilitators.",
    href: "https://developers.stellar.org/docs/build/agentic-payments/x402",
    icon: Layers,
  },
  {
    title: "Brave Search API",
    desc: "LLM-friendly web results — server holds the key; agents pay per query.",
    href: "https://api.search.brave.com/app/documentation",
    icon: BookOpen,
  },
  {
    title: "Stellar developer docs",
    desc: "Networks, USDC, Soroban, and Horizon fundamentals.",
    href: "https://developers.stellar.org/docs",
    icon: Layers,
  },
  {
    title: "x402 overview (CDP)",
    desc: "HTTP 402 flows and client patterns — adjacent to Stellar stack.",
    href: "https://docs.cdp.coinbase.com/x402/welcome",
    icon: BookOpen,
  },
  {
    title: "MCP specification",
    desc: "Wire AI clients to tools with JSON-RPC.",
    href: "https://modelcontextprotocol.io",
    icon: BookOpen,
  },
  {
    title: "Demo walkthrough",
    desc: "Screen recording or live session for judges.",
    href: "#demo",
    icon: PlayCircle,
  },
  {
    title: "Community",
    desc: "Stellar Discord — integration help during hackathons.",
    href: "https://discord.gg/stellar",
    icon: MessageCircle,
  },
];

export default function DocsHubSection() {
  return (
    <section id="docs" className="py-20 md:py-28 bg-muted/30 border-t border-border/60 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
            Docs &amp; resource hub
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Everything a builder needs to wire Freighter, MCP, and Stellar testnet in one pass.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href={r.href}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={
                r.href.startsWith("#")
                  ? (e) => {
                      e.preventDefault();
                      document.querySelector(r.href)?.scrollIntoView({ behavior: "smooth" });
                    }
                  : undefined
              }
              {...(!r.href.startsWith("#") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/15 transition-colors">
                  <r.icon className="h-5 w-5" aria-hidden />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-60 group-hover:text-accent shrink-0 mt-1" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                {r.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
