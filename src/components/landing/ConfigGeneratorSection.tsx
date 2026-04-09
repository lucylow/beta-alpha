import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function ConfigGeneratorSection() {
  const [secret, setSecret] = useState("<secret>");
  const [brave, setBrave] = useState("<brave>");
  const [copied, setCopied] = useState(false);

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          mcpServers: {
            "x402-web-search": {
              command: "node",
              args: ["dist/index.js"],
              env: {
                STELLAR_PRIVATE_KEY: secret,
                BRAVE_API_KEY: brave,
              },
            },
          },
        },
        null,
        2,
      ),
    [secret, brave],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      toast.success("Config copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy — try selecting and copying manually");
    }
  };

  return (
    <section id="config" className="py-20 md:py-32 bg-background scroll-mt-28" aria-labelledby="config-heading">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 id="config-heading" className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Config <span className="text-gradient-hero">generator</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Paste placeholders locally — nothing leaves your browser. Copy the MCP snippet into Cursor or Claude Code.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-muted-foreground text-xs uppercase tracking-wide">STELLAR_PRIVATE_KEY</span>
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                autoComplete="off"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground text-xs uppercase tracking-wide">BRAVE_API_KEY</span>
              <input
                value={brave}
                onChange={(e) => setBrave(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="relative rounded-2xl border border-border bg-primary overflow-hidden shadow-card">
            <pre className="p-5 pr-14 text-[11px] sm:text-xs font-mono text-primary-foreground/85 overflow-x-auto max-h-80 overflow-y-auto">
              <code>{json}</code>
            </pre>
            <button
              type="button"
              onClick={copy}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-xs text-primary-foreground hover:bg-primary-foreground/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Copy configuration JSON"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
