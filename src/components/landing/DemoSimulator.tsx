import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Check, Loader2, RotateCcw, Radio } from "lucide-react";
import { useWallet, truncateStellarAddress } from "@/context/WalletContext";
import { randomStellarTxHashHex, stellarExpertTestnetTxUrl } from "@/lib/tx-hash";

const QUERY = "Stellar x402 hackathon 2026";

type PaidSearchResponse = {
  ok?: boolean;
  result?: unknown;
  settled?: { tx_hash?: string | null };
};

const mockResultsJson = `{
  "query": "${QUERY}",
  "results": [
    {
      "title": "Stellar Hacks: Agents – DoraHacks",
      "url": "https://dorahacks.io/hackathon/stellar-agents/detail",
      "snippet": "Build agentic payments using x402 on Stellar."
    },
    {
      "title": "x402 on Stellar Developer Docs",
      "url": "https://developers.stellar.org/docs",
      "snippet": "Integrate HTTP 402 micropayments with Soroban and USDC."
    }
  ]
}`;

type Stage = "idle" | "prompt" | "paying" | "confirmed" | "results";

const STEP_DELAY_MS = 500;

const VISUALIZER_STEPS = [
  "1. Request search from MCP bridge",
  "2. Receive HTTP 402 payment challenge",
  "3. Sign authorization (Freighter / mock)",
  "4. Submit settlement to Stellar testnet",
  "5. Confirm transaction",
  "6. Deliver Brave search results",
] as const;

export default function DemoSimulator() {
  const { publicKey } = useWallet();
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [useWalletHint, setUseWalletHint] = useState(false);
  const [useLiveApi, setUseLiveApi] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [livePayload, setLivePayload] = useState<string | null>(null);

  const merchantFrom = publicKey && useWalletHint ? truncateStellarAddress(publicKey, 4, 4) : "GA7K••••3X4F";

  const reset = useCallback(() => {
    setStage("idle");
    setStepIndex(0);
    setProgress(0);
    setTxHash(null);
    setLiveError(null);
    setLivePayload(null);
  }, []);

  const startDemo = () => {
    reset();
    setStage("prompt");
  };

  const runPayment = useCallback(async () => {
    setLiveError(null);
    setLivePayload(null);
    setStage("paying");
    setStepIndex(0);
    setProgress(0);

    if (useLiveApi) {
      if (!publicKey) {
        setLiveError("Connect Freighter to run the live AgentPay API path (uses simulated settlement on the server).");
        setStage("prompt");
        return;
      }
      try {
        const url = `/api/search?q=${encodeURIComponent(QUERY)}`;
        let first: Response;
        try {
          first = await fetch(url);
        } catch (networkErr) {
          throw new Error(`Network error — is the AgentPay server running? (${networkErr instanceof Error ? networkErr.message : String(networkErr)})`);
        }
        const raw = await first.text();
        if (first.status !== 402) {
          throw new Error(`Expected 402, got ${first.status}: ${raw.slice(0, 160)}`);
        }
        let body: { agentpay?: { challenge_id?: string } };
        try {
          body = JSON.parse(raw);
        } catch {
          throw new Error("Server returned invalid JSON in 402 response");
        }
        const challenge_id = body.agentpay?.challenge_id;
        if (!challenge_id) throw new Error("Missing agentpay.challenge_id in 402 body");

        setStepIndex(1);
        setProgress(35);
        const demoHash = `demo-${crypto.randomUUID().replace(/-/g, "")}`;
        const auth = { challenge_id, proof: { payer: publicKey, tx_hash: demoHash } };
        setStepIndex(2);
        setProgress(70);

        let second: Response;
        try {
          second = await fetch(url, {
            headers: { Authorization: `Stellar ${JSON.stringify(auth)}`, Accept: "application/json" },
          });
        } catch (networkErr) {
          throw new Error(`Network error on paid request: ${networkErr instanceof Error ? networkErr.message : String(networkErr)}`);
        }
        const paidText = await second.text();
        if (!second.ok) {
          throw new Error(`Paid request failed ${second.status}: ${paidText.slice(0, 200)}`);
        }
        let paid: PaidSearchResponse;
        try {
          paid = JSON.parse(paidText);
        } catch {
          throw new Error("Server returned invalid JSON in paid response");
        }
        setTxHash(paid.settled?.tx_hash || demoHash);
        setLivePayload(JSON.stringify(paid, null, 2));
        setStepIndex(3);
        setProgress(100);
        setStage("confirmed");
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setLiveError(message);
        setStage("prompt");
      }
      return;
    }

    setTxHash(randomStellarTxHashHex());
    let current = 0;
    const n = VISUALIZER_STEPS.length;
    const advance = () => {
      setStepIndex(current);
      setProgress(Math.round(((current + 1) / n) * 100));
      current += 1;
      if (current < n) {
        setTimeout(advance, STEP_DELAY_MS);
      } else {
        setTimeout(() => setStage("confirmed"), STEP_DELAY_MS);
      }
    };
    setTimeout(advance, STEP_DELAY_MS);
  }, [publicKey, useLiveApi]);

  useEffect(() => {
    if (stage !== "confirmed") return;
    const t = setTimeout(() => setStage("results"), 700);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <section id="demo" className="py-20 md:py-32 bg-background scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">Live demo simulator</h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Walk through <span className="font-mono text-foreground/90">web_search</span> with an explicit confirmation gate, then the x402 / Stellar path.{" "}
            <strong className="text-foreground font-medium">
              Sandbox: no USDC moves unless you confirm — live APIs optional.
            </strong>
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <label className="flex items-center justify-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-border h-4 w-4 accent-accent cursor-pointer"
                checked={useWalletHint}
                onChange={(e) => setUseWalletHint(e.target.checked)}
                disabled={!publicKey}
              />
              <span>
                Use my connected Freighter address in the “from” field
                {!publicKey && (
                  <span className="text-xs block text-muted-foreground/80">(connect wallet in the header)</span>
                )}
              </span>
            </label>
            <label className="flex items-center justify-center gap-3 cursor-pointer select-none max-w-xl">
              <input
                type="checkbox"
                className="rounded border-border h-4 w-4 accent-accent cursor-pointer shrink-0"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
              />
              <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <Radio className="h-3.5 w-3.5 text-accent shrink-0" />
                Live: real <code className="text-xs text-foreground/90">GET /api/search</code> +{" "}
                <code className="text-xs text-foreground/90">Authorization: Stellar …</code>
                <span className="text-xs text-muted-foreground/90">
                  (needs AgentPay server, <code className="text-[10px]">DEMO_SIMULATED=1</code>)
                </span>
              </span>
            </label>
            {liveError && <p className="text-destructive text-xs max-w-xl text-center">{liveError}</p>}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-border bg-primary overflow-hidden shadow-card">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-primary-foreground/10">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-destructive/60" />
                <span className="h-3 w-3 rounded-full bg-warning/60" />
                <span className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <span className="text-primary-foreground/40 text-xs font-mono ml-2">Claude Code — MCP</span>
              {stage !== "idle" && (
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto text-primary-foreground/40 hover:text-accent transition-colors cursor-pointer"
                  aria-label="Reset demo"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="p-4 md:p-5 font-mono text-xs md:text-sm space-y-3 min-h-[340px] text-left">
              <div>
                <span className="text-primary-foreground/50">&gt; User:</span>{" "}
                <span className="text-primary-foreground/90"> Search for &quot;{QUERY}&quot;</span>
              </div>

              {(stage === "prompt" || stage === "paying" || stage === "confirmed" || stage === "results") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-foreground/70">
                  <span className="text-accent">[Agent]</span> I&apos;ll search the web for that information.
                </motion.div>
              )}

              {(stage === "prompt" || stage === "paying" || stage === "confirmed" || stage === "results") && (
                <div className="text-primary-foreground/60">
                  <span className="text-warning/90">&gt; Tool</span>{" "}
                  <span className="text-accent">web_search</span> called with query: &quot;{QUERY}&quot;
                </div>
              )}

              <AnimatePresence>
                {stage === "prompt" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border border-warning/35 bg-warning/5 p-3 text-warning/95 text-xs md:text-sm"
                  >
                    ⚠️ This action will cost 0.001 USDC (0.1 cents)
                    <br />
                    Payment would be made from your Stellar wallet (testnet in production).
                    <br />
                    Confirm? (y/N):
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => runPayment()}
                        className="rounded-full bg-accent/25 text-accent px-4 py-2 text-xs font-semibold hover:bg-accent/35 cursor-pointer"
                      >
                        Yes, pay (simulated)
                      </button>
                      <button
                        type="button"
                        onClick={() => reset()}
                        className="rounded-full border border-primary-foreground/20 px-4 py-2 text-xs cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {stage === "paying" && (
                <div className="text-primary-foreground/50 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" /> Processing payment steps…
                </div>
              )}

              {(stage === "confirmed" || stage === "results") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="text-success flex items-center gap-1">
                    <Check className="h-4 w-4" /> Payment confirmed (0.001 USDC)
                  </div>
                </motion.div>
              )}

              {stage === "results" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="text-primary-foreground/50">Search results received:</div>
                  <ol className="list-decimal list-inside space-y-1 text-primary-foreground/80 text-xs md:text-sm">
                    <li>Stellar Hacks: Agents – DoraHacks …</li>
                    <li>x402 on Stellar Developer Docs …</li>
                  </ol>
                </motion.div>
              )}

              {stage === "idle" && (
                <button
                  type="button"
                  onClick={startDemo}
                  className="flex items-center gap-2 rounded-full bg-accent/20 text-accent px-5 py-2.5 text-xs font-semibold hover:bg-accent/30 transition-colors mt-4 cursor-pointer"
                >
                  <Terminal className="h-4 w-4" /> Run demo
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card-gradient overflow-hidden shadow-card flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="text-foreground/60 text-xs font-mono">Transaction visualizer</span>
              <span
                className={`ml-auto h-2 w-2 rounded-full ${stage === "results" || stage === "confirmed" ? "bg-success" : "bg-muted-foreground/30"}`}
              />
            </div>
            <div className="p-4 md:p-5 space-y-4 flex-1 min-h-[340px] flex flex-col">
              {stage === "idle" ? (
                <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm text-center px-4">
                  Start the demo to see authorization steps and a mock settlement.
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">From</span>
                      <span className="font-mono text-foreground text-right break-all">{merchantFrom}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-muted-foreground shrink-0">To (merchant)</span>
                      <span className="font-mono text-foreground text-right">GC8B••••9K2D</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-mono text-accent font-bold">0.001 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-mono text-foreground">
                        {useLiveApi ? "Stellar testnet (live API path)" : "Stellar testnet · demo settlement"}
                      </span>
                    </div>
                  </div>

                  {(stage === "paying" || stage === "confirmed" || stage === "results") && txHash && (
                    <div className="space-y-2">
                      <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                        {VISUALIZER_STEPS.map((label, i) => (
                          <li
                            key={label}
                            className={
                              stage !== "paying"
                                ? "text-accent"
                                : i < stepIndex
                                  ? "text-accent/80"
                                  : i === stepIndex
                                    ? "text-foreground font-medium"
                                    : "opacity-35"
                            }
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-accent font-mono tabular-nums">{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.25 }}
                        />
                      </div>
                    </div>
                  )}

                  {(stage === "confirmed" || stage === "results") && txHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg bg-success/10 border border-success/25 p-3 text-sm"
                    >
                      <div className="flex items-center gap-2 text-success font-medium">
                        <Check className="h-4 w-4 shrink-0" /> Transaction confirmed
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground break-all">
                        Hash:{" "}
                        <a
                          href={stellarExpertTestnetTxUrl(txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-mono"
                        >
                          {txHash.slice(0, 8)}…
                        </a>{" "}
                        <span className="text-muted-foreground/70">(simulated hash — explorer may not resolve)</span>
                      </div>
                    </motion.div>
                  )}

                  {stage === "results" && (
                    <div className="flex-1 min-h-0">
                      <p className="text-xs text-muted-foreground mb-2">
                        Response JSON {livePayload ? "(live API)" : "(mock)"}
                      </p>
                      <pre className="rounded-xl bg-primary p-3 text-[10px] sm:text-xs text-primary-foreground/85 font-mono overflow-x-auto max-h-48 overflow-y-auto">
                        <code>{livePayload ?? mockResultsJson}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
