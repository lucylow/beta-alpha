import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search, Route, Brain, CreditCard, Wallet, FileText, Database, Shield,
  Play, CheckCircle2, AlertCircle, Clock, ArrowRight, Zap, ChevronLeft,
  RefreshCw, Eye
} from "lucide-react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AgentDef {
  id: string;
  name: string;
  icon: React.ElementType;
  capability: string;
  description: string;
  price: string;
  status: "idle" | "running" | "done" | "error";
}

interface AuditEntry {
  time: string;
  actor: string;
  action: string;
  txHash?: string;
}

interface FlowStep {
  label: string;
  agent: string;
  status: "pending" | "active" | "done";
  detail?: string;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const AGENTS: AgentDef[] = [
  { id: "search", name: "SearchAgent", icon: Search, capability: "websearch", description: "Brave web search with x402 micropayment", price: "0.001 USDC", status: "idle" },
  { id: "router", name: "RouterAgent", icon: Route, capability: "routing", description: "Selects optimal agent by reputation, price & latency", price: "—", status: "idle" },
  { id: "orchestrator", name: "OrchestratorAgent", icon: Brain, capability: "orchestration", description: "Plans multi-step workflows across agents", price: "—", status: "idle" },
  { id: "payment", name: "PaymentAgent", icon: CreditCard, capability: "payment", description: "Builds x402 payment quotes & approvals", price: "variable", status: "idle" },
  { id: "wallet", name: "WalletAgent", icon: Wallet, capability: "wallet", description: "Tracks USDC balance & spend accounting", price: "—", status: "idle" },
  { id: "summarize", name: "SummarizeAgent", icon: FileText, capability: "summarize", description: "Truncates & summarizes search results", price: "—", status: "idle" },
  { id: "registry", name: "RegistryAgentStore", icon: Database, capability: "registry", description: "Registers & discovers agents by capability", price: "—", status: "idle" },
  { id: "audit", name: "AuditAgent", icon: Shield, capability: "audit", description: "Immutable event log with tx hash linking", price: "—", status: "idle" },
];

const INITIAL_FLOW: FlowStep[] = [
  { label: "User submits query", agent: "orchestrator", status: "pending" },
  { label: "Plan workflow", agent: "orchestrator", status: "pending" },
  { label: "Select best search agent", agent: "router", status: "pending" },
  { label: "Request payment quote", agent: "payment", status: "pending" },
  { label: "Debit wallet (0.001 USDC)", agent: "wallet", status: "pending" },
  { label: "Execute web search", agent: "search", status: "pending" },
  { label: "Summarize results", agent: "summarize", status: "pending" },
  { label: "Log audit trail", agent: "audit", status: "pending" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<AgentDef[]>(AGENTS);
  const [flow, setFlow] = useState<FlowStep[]>(INITIAL_FLOW);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [walletBalance, setWalletBalance] = useState(5.0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const cancelRef = useRef(false);

  const resetAll = useCallback(() => {
    cancelRef.current = true;
    setAgents(AGENTS);
    setFlow(INITIAL_FLOW);
    setAuditLog([]);
    setWalletBalance(5.0);
    setIsRunning(false);
    setSelectedAgent(null);
    setTimeout(() => { cancelRef.current = false; }, 100);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const addAudit = useCallback((actor: string, action: string, txHash?: string) => {
    setAuditLog((prev) => [
      { time: new Date().toLocaleTimeString(), actor, action, txHash },
      ...prev,
    ]);
  }, []);

  const setAgentStatus = useCallback((id: string, status: AgentDef["status"]) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const advanceFlow = useCallback((idx: number, status: FlowStep["status"], detail?: string) => {
    setFlow((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, status, detail: detail ?? s.detail } : s))
    );
  }, []);

  const runDemo = useCallback(async () => {
    cancelRef.current = false;
    setIsRunning(true);
    resetAll();
    await sleep(200);
    setIsRunning(true);

    const steps: Array<() => Promise<void>> = [
      // Step 0 — orchestrator receives query
      async () => {
        advanceFlow(0, "active");
        setAgentStatus("orchestrator", "running");
        addAudit("OrchestratorAgent", "Received query: 'Stellar x402 news'");
        await sleep(700);
        advanceFlow(0, "done");
        setAgentStatus("orchestrator", "done");
      },
      // Step 1 — plan
      async () => {
        advanceFlow(1, "active");
        setAgentStatus("orchestrator", "running");
        addAudit("OrchestratorAgent", "Planned 2-step workflow");
        await sleep(600);
        advanceFlow(1, "done", "websearch → summarize");
        setAgentStatus("orchestrator", "done");
      },
      // Step 2 — router selects
      async () => {
        advanceFlow(2, "active");
        setAgentStatus("router", "running");
        addAudit("RouterAgent", "Selected search-1 (rep 92, $0.001)");
        await sleep(500);
        advanceFlow(2, "done", "search-1 selected");
        setAgentStatus("router", "done");
      },
      // Step 3 — payment quote
      async () => {
        advanceFlow(3, "active");
        setAgentStatus("payment", "running");
        const payId = `pay_${Math.random().toString(36).slice(2, 8)}`;
        addAudit("PaymentAgent", `Quote ${payId}: 0.001 USDC`);
        await sleep(600);
        advanceFlow(3, "done", payId);
        setAgentStatus("payment", "done");
      },
      // Step 4 — wallet debit
      async () => {
        advanceFlow(4, "active");
        setAgentStatus("wallet", "running");
        setWalletBalance((b) => Math.round((b - 0.001) * 1e7) / 1e7);
        addAudit("WalletAgent", "Debited 0.001 USDC");
        await sleep(400);
        advanceFlow(4, "done");
        setAgentStatus("wallet", "done");
      },
      // Step 5 — search
      async () => {
        advanceFlow(5, "active");
        setAgentStatus("search", "running");
        addAudit("SearchAgent", "Querying Brave Search API");
        await sleep(900);
        const txHash = `0x${Math.random().toString(16).slice(2, 18)}`;
        addAudit("SearchAgent", "3 results returned", txHash);
        advanceFlow(5, "done", "3 results");
        setAgentStatus("search", "done");
      },
      // Step 6 — summarize
      async () => {
        advanceFlow(6, "active");
        setAgentStatus("summarize", "running");
        addAudit("SummarizeAgent", "Summarizing top result");
        await sleep(500);
        advanceFlow(6, "done");
        setAgentStatus("summarize", "done");
      },
      // Step 7 — audit
      async () => {
        advanceFlow(7, "active");
        setAgentStatus("audit", "running");
        addAudit("AuditAgent", "Logged 8 events to audit trail");
        await sleep(300);
        advanceFlow(7, "done");
        setAgentStatus("audit", "done");
      },
    ];

    for (const step of steps) {
      if (cancelRef.current) break;
      await step();
    }
    setIsRunning(false);
  }, [addAudit, advanceFlow, resetAll, setAgentStatus]);

  const activeAgent = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold">Agents Dashboard</h1>
            <Badge variant="outline" className="text-xs">8 agents</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm">
              <Wallet className="h-4 w-4 text-accent" />
              <span className="font-mono font-medium">{walletBalance.toFixed(4)}</span>
              <span className="text-muted-foreground">USDC</span>
            </div>
            <Button size="sm" variant="outline" onClick={resetAll} disabled={isRunning}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={runDemo} disabled={isRunning} className="bg-primary text-primary-foreground">
              <Play className="mr-1.5 h-3.5 w-3.5" /> {isRunning ? "Running…" : "Run Demo"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Agent Grid */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Agent Registry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              const isActive = agent.status === "running";
              const isDone = agent.status === "done";
              return (
                <Card
                  key={agent.id}
                  className={`cursor-pointer transition-all border ${
                    isActive
                      ? "border-accent shadow-[0_0_12px_hsl(var(--accent)/0.25)]"
                      : isDone
                      ? "border-success/50"
                      : selectedAgent === agent.id
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
                >
                  <CardContent className="p-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-md p-1.5 ${isActive ? "bg-accent/10" : isDone ? "bg-success/10" : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${isActive ? "text-accent animate-pulse" : isDone ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <StatusDot status={agent.status} />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{agent.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{agent.capability}</p>
                    </div>
                    {agent.price !== "—" && (
                      <Badge variant="secondary" className="w-fit text-[10px]">{agent.price}</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Selected Agent Detail */}
        {activeAgent && (
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <activeAgent.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{activeAgent.name}</CardTitle>
                <Badge variant="outline" className="text-xs">{activeAgent.capability}</Badge>
              </div>
              <CardDescription>{activeAgent.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">Price</span>
                  <p className="font-mono font-medium">{activeAgent.price}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Status</span>
                  <p className="flex items-center gap-1"><StatusDot status={activeAgent.status} /> {activeAgent.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Network</span>
                  <p>Stellar Testnet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="flow" className="w-full">
          <TabsList>
            <TabsTrigger value="flow" className="gap-1.5"><Zap className="h-3.5 w-3.5" /> Payment Flow</TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Audit Trail</TabsTrigger>
          </TabsList>

          {/* Payment Flow */}
          <TabsContent value="flow">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Mock x402 Payment Flow</CardTitle>
                <CardDescription className="text-xs">
                  End-to-end: query → orchestrate → pay → search → summarize → audit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {flow.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {step.status === "done" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : step.status === "active" ? (
                          <div className="h-4 w-4 rounded-full border-2 border-accent animate-pulse" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-border" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${step.status === "done" ? "text-foreground" : step.status === "active" ? "text-accent font-medium" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                          <Badge variant="outline" className="text-[10px] shrink-0">{step.agent}</Badge>
                        </div>
                        {step.detail && (
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{step.detail}</p>
                        )}
                      </div>
                      {i < flow.length - 1 && step.status === "done" && (
                        <ArrowRight className="h-3 w-3 text-success/50 mt-1 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail */}
          <TabsContent value="audit">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  Audit Trail
                  {auditLog.length > 0 && (
                    <Badge variant="secondary" className="text-[10px]">{auditLog.length} events</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLog.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
                    <Eye className="h-8 w-8 mb-2 opacity-40" />
                    <p>No events yet. Run the demo to generate audit entries.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-1">
                      {auditLog.map((entry, i) => (
                        <div key={i} className="flex items-start gap-3 py-1.5 text-sm border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground font-mono text-xs w-[70px] shrink-0">{entry.time}</span>
                          <Badge variant="outline" className="text-[10px] shrink-0 w-[130px] justify-center">{entry.actor}</Badge>
                          <span className="flex-1 text-foreground">{entry.action}</span>
                          {entry.txHash && (
                            <span className="font-mono text-xs text-accent shrink-0">{entry.txHash.slice(0, 10)}…</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: AgentDef["status"] }) {
  const colors: Record<string, string> = {
    idle: "bg-muted-foreground/30",
    running: "bg-accent animate-pulse",
    done: "bg-success",
    error: "bg-destructive",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status] ?? colors.idle}`} />;
}
