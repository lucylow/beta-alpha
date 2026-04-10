import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, CheckCircle, Loader2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { QUERY_COST_USDC, SEARCH_SUGGESTIONS } from "@/content/dapp-mock-data";
import { mockSearchResults } from "@/utils/mock-data";

type FlowState = "idle" | "quoting" | "payment_required" | "verifying" | "settled" | "searching" | "completed" | "failed";

interface Props {
  walletConnected: boolean;
  network: "testnet" | "mainnet";
}

export default function SearchConsole({ walletConnected, network }: Props) {
  const [query, setQuery] = useState("");
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [country, setCountry] = useState("US");
  const [resultCount, setResultCount] = useState(5);
  const [agentMode, setAgentMode] = useState(false);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;
    setFlowState("quoting");
    await delay(800);
    setFlowState("payment_required");
    await delay(1500);
    setFlowState("verifying");
    await delay(1200);
    setFlowState("settled");
    await delay(600);
    setFlowState("searching");
    await delay(1000);
    setFlowState("completed");
  }, [query]);

  const reset = () => { setFlowState("idle"); setQuery(""); };

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
      <h2 className="text-lg font-semibold mb-4">Search Console</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Query Composer */}
        <Card className="bg-card-gradient border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Query Composer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search query..."
              className="w-full h-10 px-3 bg-muted/50 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === "Enter" && flowState === "idle" && runSearch()}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Country</label>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full h-8 bg-muted/50 rounded-md border border-border/50 text-xs px-2 text-foreground">
                  <option value="US">US</option><option value="GB">GB</option><option value="DE">DE</option><option value="JP">JP</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Results</label>
                <select value={resultCount} onChange={(e) => setResultCount(Number(e.target.value))} className="w-full h-8 bg-muted/50 rounded-md border border-border/50 text-xs px-2 text-foreground">
                  <option value={3}>3</option><option value={5}>5</option><option value={10}>10</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Agent mode</span>
              <button
                onClick={() => setAgentMode(!agentMode)}
                className={`w-9 h-5 rounded-full transition-colors ${agentMode ? "bg-accent" : "bg-muted"} relative`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${agentMode ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            <Button
              onClick={flowState === "idle" ? runSearch : reset}
              className="w-full gap-1.5"
              disabled={!query.trim() && flowState === "idle"}
              variant={flowState === "completed" ? "outline" : "default"}
            >
              {flowState === "idle" ? <><Zap className="h-3.5 w-3.5" /> Search (${QUERY_COST_USDC} USDC)</> :
               flowState === "completed" || flowState === "failed" ? "New Search" :
               <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...</>}
            </Button>
            <div className="space-y-1">
              {SEARCH_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="block w-full text-left text-[11px] px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors truncate">
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Challenge Panel */}
        <Card className="bg-card-gradient border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Payment Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StepIndicator label="Quote" active={flowState === "quoting"} done={["payment_required","verifying","settled","searching","completed"].includes(flowState)} />
            <StepIndicator label="402 Payment Required" active={flowState === "payment_required"} done={["verifying","settled","searching","completed"].includes(flowState)} />
            <StepIndicator label="Verify Payment" active={flowState === "verifying"} done={["settled","searching","completed"].includes(flowState)} />
            <StepIndicator label="Settlement" active={flowState === "settled"} done={["searching","completed"].includes(flowState)} />
            <StepIndicator label="Search Results" active={flowState === "searching"} done={flowState === "completed"} />

            {flowState !== "idle" && (
              <Card className="bg-muted/30 border-border/30 mt-4">
                <CardContent className="p-3 text-xs font-mono space-y-1.5">
                  {flowState === "payment_required" || ["verifying","settled","searching","completed"].includes(flowState) ? (
                    <>
                      <div className="text-warning font-semibold">HTTP/1.1 402 Payment Required</div>
                      <div className="text-muted-foreground">
                        <span className="text-foreground">Token:</span> USDC<br />
                        <span className="text-foreground">Amount:</span> {QUERY_COST_USDC}<br />
                        <span className="text-foreground">Network:</span> stellar:{network}<br />
                        <span className="text-foreground">PayTo:</span> GDQP2K…X4RMFH<br />
                        <span className="text-foreground">Scheme:</span> exact
                      </div>
                    </>
                  ) : flowState === "quoting" ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Generating payment requirements…
                    </div>
                  ) : null}
                  {["settled","searching","completed"].includes(flowState) && (
                    <div className="pt-2 border-t border-border/30">
                      <div className="text-success flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Payment Verified
                      </div>
                      <div className="text-muted-foreground mt-1">
                        Tx: <code>abc123def456…</code>
                        <button className="ml-1 hover:text-accent"><Copy className="h-2.5 w-2.5 inline" /></button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {agentMode && (
              <div className="text-[10px] text-warning bg-warning/5 rounded-md p-2 border border-warning/10">
                Agent mode: Simulating autonomous MCP client workflow
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-card-gradient border-border/50 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {flowState === "completed" ? (
              <div className="space-y-3">
                {mockSearchResults.map((r, i) => (
                  <div key={i} className="space-y-1 pb-3 border-b border-border/30 last:border-0">
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
                      {r.title} <ExternalLink className="h-3 w-3" />
                    </a>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                    <span className="text-[10px] text-muted-foreground">{r.age}</span>
                  </div>
                ))}
                <div className="text-[10px] text-muted-foreground text-center pt-2">
                  {mockSearchResults.length} results · {QUERY_COST_USDC} USDC settled · {network}
                </div>
              </div>
            ) : flowState === "idle" ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Submit a query to see results
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin opacity-30" />
                Processing payment flow…
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {done ? <CheckCircle className="h-4 w-4 text-success shrink-0" /> :
       active ? <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" /> :
       <div className="h-4 w-4 rounded-full border border-border/50 shrink-0" />}
      <span className={`text-xs ${done ? "text-success" : active ? "text-accent" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
