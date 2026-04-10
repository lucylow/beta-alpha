import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { DEMO_STEPS, QUERY_COST_USDC } from "@/content/dapp-mock-data";

type ChatLine = { role: "user" | "agent" | "system"; text: string };

export default function DemoMode() {
  const [isLive, setIsLive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [chat, setChat] = useState<ChatLine[]>([]);

  const runDemo = useCallback(async () => {
    setRunning(true);
    setChat([]);
    setCurrentStep(0);

    const script: ChatLine[] = [
      { role: "user", text: "Search for latest Stellar x402 news" },
      { role: "system", text: `Generating payment requirements... Cost: ${QUERY_COST_USDC} USDC` },
      { role: "agent", text: "402 Payment Required. Please authorize 0.001 USDC." },
      { role: "user", text: "Approve payment" },
      { role: "system", text: "Verifying payment with facilitator..." },
      { role: "system", text: "✓ Payment settled. Tx: abc123def456..." },
      { role: "system", text: "Searching Brave API..." },
      { role: "agent", text: "Found 5 results for \"Stellar x402\":\n1. Stellar Hacks Agents - DoraHacks\n2. x402 on Stellar Docs\n3. MCP Server Guide" },
    ];

    for (let i = 0; i < script.length; i++) {
      await delay(800 + Math.random() * 400);
      setChat((prev) => [...prev, script[i]]);
      const stepMap = [0, 1, 1, 2, 3, 4, 5, 6];
      setCurrentStep(stepMap[i] ?? 6);
    }
    setRunning(false);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Demo Simulator</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{isLive ? "Testnet Live" : "Mock Demo"}</span>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`w-9 h-5 rounded-full transition-colors ${isLive ? "bg-success" : "bg-muted"} relative`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${isLive ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {!isLive && (
        <div className="text-[10px] text-warning bg-warning/5 rounded-md p-2 border border-warning/10">
          ⚠ Demo mode: All payments and transactions are simulated. No real funds are used.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Terminal Chat */}
        <Card className="bg-card-gradient border-border/50 lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono">Terminal</CardTitle>
            <div className="flex gap-1">
              {!running && (
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={runDemo}>
                  <Play className="h-3 w-3" /> Run Demo
                </Button>
              )}
              <Button size="sm" variant="ghost" className="text-xs gap-1" onClick={() => { setChat([]); setCurrentStep(0); setRunning(false); }}>
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-background rounded-lg border border-border/50 p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-xs space-y-2">
              {chat.length === 0 && !running && (
                <span className="text-muted-foreground">Click "Run Demo" to simulate a paid search query lifecycle.</span>
              )}
              {chat.map((line, i) => (
                <div key={i} className={`${line.role === "user" ? "text-accent" : line.role === "agent" ? "text-foreground" : "text-muted-foreground"}`}>
                  <span className="font-bold">{line.role === "user" ? "You" : line.role === "agent" ? "Agent" : "System"}:</span>{" "}
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              ))}
              {running && <span className="text-muted-foreground animate-pulse">▍</span>}
            </div>
          </CardContent>
        </Card>

        {/* State Machine */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm">State Machine</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {DEMO_STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep && running;
              return (
                <div key={i} className="flex items-center gap-2">
                  {done ? <CheckCircle className="h-4 w-4 text-success shrink-0" /> :
                   active ? <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" /> :
                   <div className="h-4 w-4 rounded-full border border-border/50 shrink-0" />}
                  <div>
                    <p className={`text-xs font-medium ${done ? "text-success" : active ? "text-accent" : "text-muted-foreground"}`}>{step.label}</p>
                    <p className="text-[10px] text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Fake tx hash */}
            {currentStep >= 4 && (
              <div className="mt-3 p-2 bg-muted/20 rounded-md text-[10px] font-mono">
                <p className="text-muted-foreground">Tx Hash:</p>
                <p className="break-all">abc123def456789012345678901234567890abcdef</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
