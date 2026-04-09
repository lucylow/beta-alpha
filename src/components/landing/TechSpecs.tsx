import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const specs: { label: string; value: string }[] = [
  {
    label: "MCP Server",
    value:
      "Node.js + TypeScript + @modelcontextprotocol/sdk. Tools: web_search (Brave-backed) and wallet_info (USDC balance snapshot for budgeting).",
  },
  { label: "x402 integration", value: "HTTP 402 challenges, Stellar auth payloads, facilitator settlement hooks." },
  { label: "Stellar network setup", value: "Horizon testnet by default; switch passphrases for future pubnet." },
  { label: "Search provider", value: "Brave Search API today — swap the client for Bing, SerpAPI, or internal indexes." },
  {
    label: "Wallet support",
    value: "Freighter (recommended for demos), Albedo, Hana, HOT, Klever, OneKey — any signer that can produce the auth format.",
  },
  { label: "Facilitator integration", value: "OpenZeppelin Relayer + x402 plugin verifies proofs before submission." },
  { label: "Testnet / mainnet modes", value: "Toggle network in env + facilitator config; USDC mint addresses differ per network." },
  {
    label: "Error handling & fallbacks",
    value: "402 on missing payment, graceful Horizon errors, demo simulator when wallet offline, MCP config copy helpers.",
  },
];

const walletTags = ["Freighter", "Albedo", "Hana", "HOT", "Klever", "OneKey"];

const mcpConfig = `{
  "mcpServers": {
    "x402-web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "STELLAR_PRIVATE_KEY": "<your_testnet_secret>",
        "STELLAR_NETWORK": "TESTNET",
        "BRAVE_API_KEY": "<your_brave_key>",
        "X402_CONFIRM_PAYMENTS": "true"
      }
    }
  }
}`;

export default function TechSpecs() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-24 md:py-32 bg-background scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            Technical specs for <span className="text-gradient-hero">builders &amp; judges</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Expand a row for the nitty-gritty. Copy the MCP block into your client config.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1">Wallets</span>
            {walletTags.map((w) => (
              <Badge key={w} variant="outline" className="text-[10px] font-mono border-accent/30 text-foreground/90">
                {w}
              </Badge>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-2">
            {specs.map((s, i) => (
              <button
                type="button"
                key={s.label}
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full text-left rounded-xl border border-border p-4 hover:shadow-card transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground text-sm">{s.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${expanded === i ? "rotate-180" : ""}`}
                  />
                </div>
                {expanded === i && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-muted-foreground leading-relaxed"
                  >
                    {s.value}
                  </motion.p>
                )}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-primary overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary-foreground/10">
              <span className="text-primary-foreground/40 text-xs font-mono">mcp.json snippet.env</span>
              <button
                type="button"
                onClick={copyConfig}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy MCP config"}
              </button>
            </div>
            <pre className="p-5 text-xs sm:text-sm text-primary-foreground/80 font-mono overflow-x-auto max-h-[min(420px,55vh)] overflow-y-auto">
              <code>{mcpConfig}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
