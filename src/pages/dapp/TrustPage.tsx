import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, ExternalLink, Github, BookOpen, Zap, AlertTriangle } from "lucide-react";
import { FAQ_ITEMS } from "@/content/dapp-mock-data";
import { Link } from "react-router-dom";

export default function TrustPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
      <h2 className="text-lg font-semibold">Trust & FAQ</h2>

      {/* FAQ */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm">Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-1">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                <AccordionTrigger className="text-sm py-3 hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground pb-3">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Security & Limitations */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-success" /> Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>• Payments are signed client-side. The server never holds private keys.</p>
            <p>• All settlements are verified on Stellar before results are delivered.</p>
            <p>• Transaction hashes are returned for independent verification on Horizon or Stellar Expert.</p>
            <p>• x402 facilitator validates every payment cryptographically.</p>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>• Testnet transactions use test USDC and have no real monetary value.</p>
            <p>• Demo mode simulates payment flows without actual network settlement.</p>
            <p>• Mainnet support requires a funded Stellar wallet with real USDC.</p>
            <p>• Query results depend on Brave Search API availability and rate limits.</p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Disclaimer</p>
        <p>This project differentiates between testnet and mainnet operations. Testnet mode uses simulated funds and is suitable for development and demonstration. Mainnet mode involves real USDC on the Stellar network. Always verify the active network before authorizing payments.</p>
      </div>

      {/* CTA */}
      <Card className="bg-hero border-border/50 text-primary-foreground">
        <CardContent className="p-6 text-center space-y-3">
          <Zap className="h-8 w-8 mx-auto text-accent" />
          <h3 className="text-lg font-semibold">Ready to try a paid search?</h3>
          <p className="text-sm text-primary-foreground/70">Connect your wallet and run your first x402-powered query.</p>
          <div className="flex gap-2 justify-center">
            <Link to="/app/search">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Start Searching</Button>
            </Link>
            <Link to="/app/demo">
              <Button size="sm" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">Try Demo</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="border-t border-border/30 pt-6 space-y-4">
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <a href="https://github.com/lucylow/beta-alpha" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><Github className="h-3.5 w-3.5" /> GitHub</a>
          <Link to="/app/docs" className="flex items-center gap-1 hover:text-foreground"><BookOpen className="h-3.5 w-3.5" /> Docs</Link>
          <a href="https://developers.stellar.org" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /> Stellar</a>
          <a href="https://stellar.expert" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /> Stellar Expert</a>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">v0.1.0</Badge>
          <span>stellar:testnet</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Online</span>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Built for Stellar Hacks Agents. Pay only when your agent searches.
        </p>
      </footer>
    </div>
  );
}
