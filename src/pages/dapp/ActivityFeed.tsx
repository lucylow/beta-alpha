import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Copy, TrendingUp, DollarSign, CheckCircle, Clock } from "lucide-react";
import { ACTIVITY_FEED, ANALYTICS_DATA } from "@/content/dapp-mock-data";

export default function ActivityFeed() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending" | "failed">("all");
  const filtered = filter === "all" ? ACTIVITY_FEED : ACTIVITY_FEED.filter((a) => a.status === filter);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Activity Feed</h2>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {[
          { label: "Queries Today", value: ANALYTICS_DATA.today.queries.toLocaleString(), icon: TrendingUp, color: "text-accent" },
          { label: "Total Spend", value: `$${ANALYTICS_DATA.today.spend.toFixed(3)}`, icon: DollarSign, color: "text-success" },
          { label: "Avg Cost", value: `$${ANALYTICS_DATA.today.avgCost}`, icon: Clock, color: "text-muted-foreground" },
          { label: "Success Rate", value: `${ANALYTICS_DATA.today.successRate}%`, icon: CheckCircle, color: "text-success" },
        ].map((s) => (
          <Card key={s.label} className="bg-card-gradient border-border/50">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color} shrink-0`} />
              <div>
                <p className="text-lg font-bold font-mono">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {(["all", "confirmed", "pending", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors capitalize ${filter === f ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed Table */}
      <Card className="bg-card-gradient border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-[10px] uppercase tracking-wider">
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Query</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Wallet</th>
                <th className="text-left p-3">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">{item.time}</td>
                  <td className="p-3 truncate max-w-[200px]">{item.query}</td>
                  <td className="p-3 font-mono">{item.amount} USDC</td>
                  <td className="p-3">
                    <Badge variant="outline" className={
                      item.status === "confirmed" ? "text-success border-success/20 text-[10px]" :
                      item.status === "pending" ? "text-warning border-warning/20 text-[10px]" :
                      "text-destructive border-destructive/20 text-[10px]"
                    }>{item.status}</Badge>
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">{item.wallet}</td>
                  <td className="p-3">
                    <span className="font-mono text-muted-foreground">{item.txHash}</span>
                    <button className="ml-1 hover:text-accent"><Copy className="h-2.5 w-2.5 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
