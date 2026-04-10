import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, ChevronDown } from "lucide-react";
import { X402_STEPS } from "@/content/dapp-mock-data";

export default function ProtocolExplainer() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">How x402 Works on Stellar</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          x402 enables per-request payments. Instead of API keys, clients pay for each query via a Stellar-based micropayment flow.
        </p>
      </div>

      {/* Timeline */}
      <div className="grid md:grid-cols-5 gap-3">
        {X402_STEPS.map((step) => (
          <Card
            key={step.step}
            className="bg-card-gradient border-border/50 cursor-pointer hover:border-accent/30 transition-colors"
            onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">{step.step}</div>
                <span className="text-sm font-semibold">{step.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform mx-auto ${expandedStep === step.step ? "rotate-180" : ""}`} />
              {expandedStep === step.step && (
                <div className="pt-2 border-t border-border/30 space-y-2">
                  <code className="block text-[10px] font-mono bg-muted/30 p-2 rounded whitespace-pre-wrap break-all">{step.detail}</code>
                  {step.header && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground">Header:</p>
                      <code className="block text-[10px] font-mono bg-muted/30 p-2 rounded break-all">{step.header}</code>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Developer Notes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Authorization Model</h3>
            <p className="text-xs text-muted-foreground">
              x402 on Stellar uses Soroban authorization and signed auth entries for per-request payment flows. The client signs a Stellar transaction, the facilitator verifies it, and the server delivers results only after settlement.
            </p>
            <div className="bg-muted/30 rounded-md p-3">
              <code className="text-[11px] font-mono text-foreground whitespace-pre">{`Authorization: Stellar {
  "x402Version": 1,
  "scheme": "exact",
  "network": "stellar:testnet",
  "payload": { ... }
}`}</code>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /> Copy Header</Button>
              <Button variant="outline" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> View Sample Tx</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border/50">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Architecture</h3>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {["MCP Client", "→", "x402 Server", "→", "Stellar Network", "→", "Brave API"].map((n, i) => (
                n === "→" ? <span key={i} className="text-accent">→</span> :
                <Badge key={i} variant="outline" className="text-[10px]">{n}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              The MCP server wraps the Brave Search API with an x402 paywall. Payment verification happens via the x402 facilitator before results are proxied to the client.
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-muted/20 rounded p-2"><span className="text-muted-foreground">Settlement:</span> ~5s</div>
              <div className="bg-muted/20 rounded p-2"><span className="text-muted-foreground">Cost:</span> 0.001 USDC</div>
              <div className="bg-muted/20 rounded p-2"><span className="text-muted-foreground">Token:</span> USDC</div>
              <div className="bg-muted/20 rounded p-2"><span className="text-muted-foreground">Scheme:</span> exact</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
