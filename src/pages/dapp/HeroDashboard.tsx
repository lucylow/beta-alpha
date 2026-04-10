import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Zap, TrendingUp, Hash, Copy, ArrowRight } from "lucide-react";
import { ANALYTICS_DATA, QUERY_COST_USDC, ACTIVITY_FEED, SEARCH_SUGGESTIONS } from "@/content/dapp-mock-data";
import { Link } from "react-router-dom";

interface Props {
  walletConnected: boolean;
  network: "testnet" | "mainnet";
}

export default function HeroDashboard({ walletConnected, network }: Props) {
  const [query, setQuery] = useState("");
  const [queryCount] = useState(ANALYTICS_DATA.today.queries);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Area */}
      <div className="relative overflow-hidden rounded-2xl bg-hero p-6 md:p-10 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(187_100%_50%/0.12),_transparent_60%)]" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
              {network === "testnet" ? "⚡ Testnet" : "● Mainnet"} · x402 Protocol
            </Badge>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Search the web.<br />
              <span className="text-gradient-hero">Pay only when agents use it.</span>
            </h1>
            <p className="text-sm md:text-base text-primary-foreground/70 max-w-md">
              0.001 USDC per query. No subscriptions. No API keys for clients. Settle on Stellar in seconds.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/app/search">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                  <Search className="h-3.5 w-3.5" /> Start Searching
                </Button>
              </Link>
              <Link to="/app/protocol">
                <Button size="sm" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 gap-1.5">
                  How x402 Works <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Stats Preview */}
          <div className="space-y-3">
            <Card className="bg-background/10 backdrop-blur-sm border-primary-foreground/10">
              <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold font-mono text-accent">{queryCount.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50">Queries Today</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono">{ANALYTICS_DATA.today.successRate}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50">Success Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-success">${ANALYTICS_DATA.today.spend.toFixed(3)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50">Total Spend</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Query Input */}
      <Card className="bg-card-gradient border-border/50">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web via x402..."
                className="w-full h-10 pl-10 pr-4 bg-muted/50 rounded-lg border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Link to="/app/search">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Search
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SEARCH_SUGGESTIONS.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="text-[11px] px-2 py-1 rounded-md bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Balance Card */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-bold font-mono">
              {walletConnected ? "12.450" : "—"} <span className="text-sm text-muted-foreground">USDC</span>
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>≈ {walletConnected ? "12,450" : "—"} queries remaining</span>
              <Badge variant="outline" className="text-[10px]">{QUERY_COST_USDC} USDC/query</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Stellar {network === "testnet" ? "Testnet" : "Mainnet"}</span>
            </div>
            <p className="text-xs text-muted-foreground">x402 facilitator: online · Horizon: synced</p>
          </CardContent>
        </Card>

        {/* Last Settlement */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Settlement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <code className="font-mono text-xs">abc123…f9e2</code>
              <button className="p-0.5 hover:text-accent transition-colors">
                <Copy className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">12 seconds ago · 0.001 USDC · Confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Preview */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" /> Recent Activity
          </CardTitle>
          <Link to="/app/activity" className="text-xs text-accent hover:underline">View all →</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ACTIVITY_FEED.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-14 shrink-0">{item.time}</span>
                  <span className="truncate max-w-[200px] md:max-w-[300px]">{item.query}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      item.status === "confirmed" ? "text-success border-success/20 text-[10px]" :
                      item.status === "pending" ? "text-warning border-warning/20 text-[10px]" :
                      "text-destructive border-destructive/20 text-[10px]"
                    }
                  >
                    {item.status}
                  </Badge>
                  <span className="font-mono text-muted-foreground">{item.amount} USDC</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {["x402", "Stellar", "Soroban", "MCP", "Brave Search", "USDC", "Claude Code", "Cursor"].map((chip) => (
          <span key={chip} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return <TrendingUp {...props} />;
}
