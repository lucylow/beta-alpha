import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFreighterWallet } from "@/hooks/useFreighterWallet";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Database, Play, Radio, Wallet } from "lucide-react";

type PaymentRequirement = {
  scheme: string;
  challenge_id: string;
  amount_stroops: string;
  destination: string;
  memo: string;
  network: string;
  simulated?: boolean;
};

type TimelineStep = { label: string; detail?: string; done: boolean };

export default function Demo() {
  const { state: wallet, connect, signAndSubmitPayment } = useFreighterWallet();
  const [query, setQuery] = useState("stellar smart contracts agents x402");
  const [payment, setPayment] = useState<PaymentRequirement | null>(null);
  const [result, setResult] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<{ demoSimulated?: boolean } | null>(null);
  const [agents, setAgents] = useState<unknown>(null);
  const [log, setLog] = useState<unknown>(null);
  const [timeline, setTimeline] = useState<TimelineStep[]>([
    { label: "Request paid resource", done: false },
    { label: "Receive x402 payment challenge", done: false },
    { label: "Sign + submit Stellar payment", done: false },
    { label: "Verify on Horizon + unlock response", done: false },
  ]);

  const loadMeta = useCallback(async () => {
    const [c, a, l] = await Promise.all([
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/agents").then((r) => r.json()),
      fetch("/api/demo-log").then((r) => r.json()),
    ]);
    setConfig(c);
    setAgents(a);
    setLog(l);
  }, []);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const markTimeline = (idx: number) => {
    setTimeline((prev) => prev.map((s, i) => ({ ...s, done: i <= idx })));
  };

  const runDemo = async () => {
    setBusy(true);
    setResult("");
    setPayment(null);
    setTxHash("");
    setTimeline([
      { label: "Request paid resource", done: true },
      { label: "Receive x402 payment challenge", done: false },
      { label: "Sign + submit Stellar payment", done: false },
      { label: "Verify on Horizon + unlock response", done: false },
    ]);
    try {
      const res = await fetch(`/api/paid-search?q=${encodeURIComponent(query)}`);
      if (res.status !== 402) {
        const t = await res.text();
        throw new Error(`Expected 402, got ${res.status}: ${t.slice(0, 200)}`);
      }
      const body = (await res.json()) as { payment?: PaymentRequirement };
      const p = body.payment;
      if (!p) {
        throw new Error("missing_payment_payload");
      }
      setPayment(p);
      markTimeline(1);
      toast.message("Payment required", { description: "x402 challenge received from AgentPay API." });

      const sim = config?.demoSimulated === true;
      if (sim) {
        const fakeHash = `demo-${crypto.randomUUID().replace(/-/g, "")}`;
        setTxHash(fakeHash);
        markTimeline(2);
        const paid = await fetch("/api/paid-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: query,
            challenge_id: p.challenge_id,
            proof: {
              payer: wallet.status === "connected" ? wallet.address : "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
              tx_hash: fakeHash,
            },
          }),
        });
        if (!paid.ok) {
          throw new Error(await paid.text());
        }
        const pr = (await paid.json()) as { result?: string };
        setResult(pr.result ?? JSON.stringify(pr));
        markTimeline(3);
        toast.success("Demo mode: response unlocked (simulated settlement)");
        await loadMeta();
        setBusy(false);
        return;
      }

      if (wallet.status !== "connected") {
        toast.error("Connect Freighter for live testnet flow, or set DEMO_SIMULATED=1 on the API.");
        setBusy(false);
        return;
      }

      const xdrRes = await fetch(
        `/api/payment-xdr?challenge_id=${encodeURIComponent(p.challenge_id)}&source=${encodeURIComponent(wallet.address)}`,
      );
      if (!xdrRes.ok) {
        throw new Error(await xdrRes.text());
      }
      const { xdr } = (await xdrRes.json()) as { xdr: string };
      const hash = await signAndSubmitPayment(xdr, wallet.passphrase);
      setTxHash(hash);
      markTimeline(2);
      toast.message("Payment submitted", { description: hash });

      const paid = await fetch("/api/paid-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: query,
          challenge_id: p.challenge_id,
          proof: { payer: wallet.address, tx_hash: hash },
        }),
      });
      if (!paid.ok) {
        throw new Error(await paid.text());
      }
      const pr = (await paid.json()) as { result?: string };
      setResult(pr.result ?? JSON.stringify(pr));
      markTimeline(3);
      toast.success("Premium search delivered");
      await loadMeta();
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      toast.error(m);
      markTimeline(0);
    } finally {
      setBusy(false);
    }
  };

  const simLabel = config?.demoSimulated ? "Simulated settlement" : "Testnet (Horizon verify)";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Home
            </Link>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="hidden min-w-0 items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent font-mono text-xs font-bold text-accent-foreground">
                x4
              </div>
              <div className="min-w-0">
                <div className="font-display text-lg font-bold leading-tight tracking-tight">x402 Web Search · Demo</div>
                <div className="truncate text-xs text-muted-foreground">
                  AgentPay-style paid API — HTTP 402, Freighter, Horizon
                </div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 border-accent/40 font-mono text-xs text-accent">
            {simLabel}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wallet className="h-5 w-5 text-accent" aria-hidden />
                Wallet &amp; network
              </CardTitle>
              <CardDescription>
                Freighter signs the live path. If the extension is missing, run the API with{" "}
                <code className="text-xs text-foreground/90">DEMO_SIMULATED=true</code> for a no-wallet flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {wallet.status === "connected" ? (
                <div className="space-y-1 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs">
                  <div className="text-muted-foreground">Address</div>
                  <div className="break-all text-foreground">{wallet.address}</div>
                  <div className="pt-2 text-muted-foreground">Network</div>
                  <div>{wallet.network}</div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {wallet.status === "no_extension"
                    ? "Freighter not detected. Install Freighter or enable simulated settlement on the server."
                    : "Connect your Stellar wallet to run the live payment path."}
                </p>
              )}
              <Button type="button" variant="secondary" onClick={() => void connect()}>
                Refresh / request access
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="h-5 w-5 text-accent" aria-hidden />
                Pay-per-query search
              </CardTitle>
              <CardDescription>
                Expects <span className="font-mono text-foreground/90">402</span> with a payment payload, then{" "}
                <span className="font-mono text-foreground/90">POST</span> with proof to unlock the body — same shape as
                MCP <span className="font-mono text-foreground/90">web_search</span> behind HTTP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search query…"
                className="font-mono text-sm"
              />
              <Button type="button" disabled={busy} className="w-full sm:w-auto" onClick={() => void runDemo()}>
                <Play className="mr-2 h-4 w-4" aria-hidden />
                Run demo flow
              </Button>
              {payment && (
                <div className="space-y-2 rounded-lg border border-accent/30 bg-accent/5 p-3 font-mono text-xs">
                  <div className="font-sans text-sm font-semibold text-foreground">Active x402 challenge</div>
                  <div>
                    <span className="text-muted-foreground">challenge_id</span> {payment.challenge_id}
                  </div>
                  <div>
                    <span className="text-muted-foreground">amount (stroops)</span> {payment.amount_stroops}
                  </div>
                  <div>
                    <span className="text-muted-foreground">destination</span>{" "}
                    <span className="break-all text-foreground">{payment.destination}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">memo</span>{" "}
                    <span className="break-all text-accent/90">{payment.memo}</span>
                  </div>
                </div>
              )}
              {txHash && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Tx hash</span>{" "}
                  <a
                    className="break-all text-accent hover:underline"
                    href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {txHash}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Radio className="h-5 w-5 text-success" aria-hidden />
                Payment timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {timeline.map((s) => (
                  <li key={s.label} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        s.done ? "bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)]" : "bg-muted-foreground/30"
                      }`}
                    />
                    <span className={s.done ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Service result</CardTitle>
              <CardDescription>Returned only after payment verification.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] rounded-md border border-border bg-muted/30 p-3">
                <pre className="whitespace-pre-wrap font-mono text-xs text-foreground/90">{result || "—"}</pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Database className="h-5 w-5 text-warning" aria-hidden />
                Contract &amp; registry snapshot
              </CardTitle>
              <CardDescription>
                Soroban contract stores agent metadata and payer attestations. Below is API-level state for this demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[220px] rounded-md border border-border bg-muted/30 p-3">
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-muted-foreground">
                  {JSON.stringify({ agents, demoLog: log }, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
