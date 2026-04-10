import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { ANALYTICS_DATA } from "@/content/dapp-mock-data";
import { TrendingUp, DollarSign, CheckCircle, Search } from "lucide-react";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("week");
  const data = ANALYTICS_DATA[period];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <div className="flex gap-1 bg-muted/30 p-0.5 rounded-lg">
          {(["today", "week", "month"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`text-xs px-3 py-1 rounded-md capitalize transition-colors ${period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Queries", value: data.queries.toLocaleString(), icon: Search, accent: "text-accent" },
          { label: "Total Spend", value: `$${data.spend.toFixed(3)}`, icon: DollarSign, accent: "text-success" },
          { label: "Success Rate", value: `${data.successRate}%`, icon: CheckCircle, accent: "text-success" },
          { label: "Avg Cost", value: `$${data.avgCost}`, icon: TrendingUp, accent: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="bg-card-gradient border-border/50">
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.accent} shrink-0`} />
              <div>
                <p className="text-lg font-bold font-mono">{s.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Queries Per Day</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ANALYTICS_DATA.chartData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(217 32% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="queries" fill="hsl(187 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Spend Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={ANALYTICS_DATA.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 32% 18%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 40% 10%)", border: "1px solid hsl(217 32% 18%)", borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="spend" stroke="hsl(152 80% 40%)" strokeWidth={2} dot={{ fill: "hsl(152 80% 40%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent insights */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Agent Behavior Insights</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Top Query", value: "Stellar x402 updates", note: "23% of all queries" },
              { label: "Peak Hour", value: "14:00 UTC", note: "~120 queries/hour" },
              { label: "Primary Network", value: "stellar:testnet", note: "98% of traffic" },
            ].map((insight) => (
              <div key={insight.label} className="bg-muted/20 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{insight.label}</p>
                <p className="text-sm font-medium mt-1">{insight.value}</p>
                <p className="text-[10px] text-muted-foreground">{insight.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
