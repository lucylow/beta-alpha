import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

const INSTALL_CMD = "npm install -g x402-web-search-mcp";
const CONFIG_KEY_CMD = "stellar keys generate my-agent --network testnet";
const CONFIG_FRIENDBOT = 'curl "https://friendbot.stellar.org?addr=<PUBLIC_KEY>"';
const MCP_BLOCK = `{
  "mcpServers": {
    "x402-web-search": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "STELLAR_PRIVATE_KEY": "<secret>",
        "BRAVE_API_KEY": "<brave>"
      }
    }
  }
}`;
const RUN_BLOCK = `export STELLAR_PRIVATE_KEY=<your_key>
export BRAVE_API_KEY=<your_key>
node dist/index.js`;

const EXAMPLE_PROMPT = `Use the web_search tool to find the latest Stellar x402 announcements and cite URLs.`;

const stepsDone = [
  { label: "Install the MCP server", done: true },
  { label: "Connect the wallet (Freighter / testnet)", done: true },
  { label: "Enable approval workflow in your client", done: false },
  { label: "Set spending policy & caps", done: false },
  { label: "Run the supervised demo", done: false },
];

const tabs = [
  { label: "Install", kind: "single" as const, text: INSTALL_CMD },
  { label: "Configure", kind: "configure" as const },
  { label: "Approve", kind: "approve" as const },
  { label: "Run", kind: "run" as const },
] as const;

export default function InstallSection() {
  const [active, setActive] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const flashCopied = (id: string) => {
    setCopiedField(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flashCopied(id);
    } catch {
      toast.error("Failed to copy — try selecting and copying manually");
    }
  };

  const tab = tabs[active];

  return (
    <section id="install" className="py-20 md:py-32 bg-muted/30 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Installation &amp; onboarding</h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Install, configure, explicitly approve, then run. The <strong className="text-foreground font-medium">Approve</strong>{" "}
            step is first-class — not an afterthought.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-primary overflow-hidden shadow-card">
          <div className="flex overflow-x-auto border-b border-primary-foreground/10 scrollbar-hide" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setCopiedField(null);
                }}
                className={`shrink-0 flex-1 min-w-[4.5rem] px-3 py-3 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                  i === active ? "bg-primary-foreground/5 text-accent border-b-2 border-accent" : "text-primary-foreground/40 hover:text-primary-foreground/65"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative p-5 md:p-6 min-h-[220px]">
            {tab.kind === "single" && (
              <>
                <pre className="font-mono text-xs sm:text-sm text-primary-foreground/80 overflow-x-auto pr-10">
                  <code>{tab.text}</code>
                </pre>
                <button
                  type="button"
                  onClick={() => copyText(tab.text!, `tab-${active}`)}
                  className="absolute top-4 right-4 text-primary-foreground/35 hover:text-accent cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  aria-label="Copy command"
                >
                  {copiedField === `tab-${active}` ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </>
            )}

            {tab.kind === "configure" && (
              <div className="space-y-6 text-primary-foreground/85 text-sm">
                <p>
                  <strong className="text-primary-foreground">Freighter:</strong> install the extension, create/import a testnet account, and switch to{" "}
                  <span className="font-mono text-xs">TESTNET</span>.
                </p>
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/35 mb-2">Keys</p>
                  <pre className="font-mono text-xs sm:text-sm text-primary-foreground/80 overflow-x-auto pr-10">
                    <code>{CONFIG_KEY_CMD}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText(CONFIG_KEY_CMD, "cfg-key")}
                    className="absolute top-6 right-0 text-primary-foreground/35 hover:text-accent cursor-pointer"
                    aria-label="Copy stellar keys command"
                  >
                    {copiedField === "cfg-key" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/35 mb-2">Friendbot (XLM)</p>
                  <pre className="font-mono text-xs sm:text-sm text-primary-foreground/80 overflow-x-auto pr-10">
                    <code>{CONFIG_FRIENDBOT}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText(CONFIG_FRIENDBOT, "cfg-bot")}
                    className="absolute top-6 right-0 text-primary-foreground/35 hover:text-accent cursor-pointer"
                    aria-label="Copy friendbot curl"
                  >
                    {copiedField === "cfg-bot" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/35 mb-2">MCP config</p>
                  <pre className="font-mono text-[10px] sm:text-xs text-primary-foreground/80 overflow-x-auto pr-10 max-h-48 overflow-y-auto">
                    <code>{MCP_BLOCK}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText(MCP_BLOCK, "cfg-mcp")}
                    className="absolute top-6 right-0 text-primary-foreground/35 hover:text-accent cursor-pointer"
                    aria-label="Copy MCP configuration"
                  >
                    {copiedField === "cfg-mcp" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-primary-foreground/45">
                  Fund USDC via the{" "}
                  <a
                    href="https://faucet.circle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    Circle testnet faucet <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
              </div>
            )}

            {tab.kind === "approve" && (
              <div className="text-primary-foreground/85 text-sm space-y-4">
                <p>
                  Turn on <strong className="text-primary-foreground">human approval mode</strong> in your bridge or UI so agents never settle silently.
                </p>
                <ul className="space-y-3">
                  {stepsDone.map((s) => (
                    <li key={s.label} className="flex items-start gap-3">
                      {s.done ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden />
                      ) : (
                        <Circle className="h-5 w-5 text-primary-foreground/25 shrink-0 mt-0.5" aria-hidden />
                      )}
                      <span className={s.done ? "text-primary-foreground" : "text-primary-foreground/55"}>{s.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-primary-foreground/45">
                  Mock checklist mirrors the product story — wire your facilitator to enforce the same gates in production.
                </p>
              </div>
            )}

            {tab.kind === "run" && (
              <div className="space-y-5">
                <div className="relative">
                  <pre className="font-mono text-xs sm:text-sm text-primary-foreground/80 overflow-x-auto pr-10 whitespace-pre-wrap">
                    <code>{RUN_BLOCK}</code>
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyText(RUN_BLOCK, "run-cmd")}
                    className="absolute top-1 right-1 text-primary-foreground/35 hover:text-accent cursor-pointer"
                    aria-label="Copy run commands"
                  >
                    {copiedField === "run-cmd" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative rounded-xl border border-primary-foreground/15 p-4">
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/40 mb-2">Example prompt</p>
                  <p className="text-sm text-primary-foreground/90 leading-relaxed pr-8">{EXAMPLE_PROMPT}</p>
                  <button
                    type="button"
                    onClick={() => copyText(EXAMPLE_PROMPT, "run-prompt")}
                    className="absolute top-3 right-3 text-primary-foreground/35 hover:text-accent cursor-pointer"
                    aria-label="Copy example prompt"
                  >
                    {copiedField === "run-prompt" ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
