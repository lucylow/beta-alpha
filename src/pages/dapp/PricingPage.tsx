import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { PRICING_PLANS } from "@/content/dapp-mock-data";

export default function PricingPage() {
  const [isMainnet, setIsMainnet] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p className="text-sm text-muted-foreground">Per-query billing. No subscriptions. Pay only when your agent searches.</p>
        <div className="inline-flex items-center gap-2 bg-muted/50 rounded-full p-0.5">
          <button onClick={() => setIsMainnet(false)} className={`text-xs px-3 py-1 rounded-full transition-colors ${!isMainnet ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>Testnet</button>
          <button onClick={() => setIsMainnet(true)} className={`text-xs px-3 py-1 rounded-full transition-colors ${isMainnet ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}>Mainnet</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <Card key={plan.name} className={`bg-card-gradient border-border/50 relative ${plan.highlighted ? "border-accent/40 shadow-glow" : ""}`}>
            {plan.badge && (
              <Badge className={`absolute -top-2 right-4 text-[10px] ${plan.highlighted ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {plan.badge}
              </Badge>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono">{isMainnet && plan.price !== "Free" && plan.price !== "Custom" ? plan.price : plan.price}</span>
                {plan.unit && <span className="text-xs text-muted-foreground">{plan.unit}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full text-xs" variant={plan.highlighted ? "default" : "outline"} size="sm">
                {plan.name === "Demo" ? "Try Now" : plan.name === "Agent Fleet" ? "Contact Us" : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { icon: Zap, text: "~5s settlement" },
          { icon: Check, text: "No API keys for clients" },
          { icon: Check, text: "Agent-compatible via MCP" },
          { icon: Check, text: "Transparent per-query pricing" },
        ].map((t) => (
          <span key={t.text} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <t.icon className="h-3 w-3" /> {t.text}
          </span>
        ))}
      </div>
    </div>
  );
}
