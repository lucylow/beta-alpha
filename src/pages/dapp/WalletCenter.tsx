import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, Copy, ExternalLink, Link2, CheckCircle, Zap, Search } from "lucide-react";
import { WALLET_MOCK, WALLET_TIMELINE } from "@/content/dapp-mock-data";

interface Props {
  walletConnected: boolean;
  onToggleWallet: () => void;
  network: "testnet" | "mainnet";
}

export default function WalletCenter({ walletConnected, onToggleWallet, network }: Props) {
  const iconMap = { link: Link2, check: CheckCircle, zap: Zap, search: Search };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 pb-20 md:pb-8">
      <h2 className="text-lg font-semibold">Wallet Center</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Wallet Info */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Wallet className="h-4 w-4" /> Account</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {walletConnected ? (
              <>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted/50 px-3 py-1.5 rounded-md flex-1 truncate">{WALLET_MOCK.fullAddress}</code>
                  <button className="p-1.5 hover:text-accent transition-colors"><Copy className="h-3.5 w-3.5" /></button>
                  <a href={`https://stellar.expert/explorer/${network}/account/${WALLET_MOCK.fullAddress}`} target="_blank" rel="noreferrer" className="p-1.5 hover:text-accent transition-colors"><ExternalLink className="h-3.5 w-3.5" /></a>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold font-mono">{WALLET_MOCK.xlmBalance.toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">XLM Balance</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold font-mono text-accent">{WALLET_MOCK.usdcBalance}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">USDC Balance</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-success border-success/20 text-[10px]">Connected</Badge>
                  <Badge variant="outline" className="text-[10px]">Stellar {network}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={onToggleWallet} className="w-full text-xs">Disconnect</Button>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <Wallet className="h-10 w-10 mx-auto text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">Connect your Stellar wallet to view balance and authorize payments.</p>
                <Button onClick={onToggleWallet} className="gap-1.5"><Wallet className="h-3.5 w-3.5" /> Connect Wallet</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Permissions & Security */}
        <Card className="bg-card-gradient border-border/50">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Permissions & Security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {[
                { label: "View balance", desc: "Read-only access to XLM and USDC balances", allowed: true },
                { label: "Sign transactions", desc: "Explicit approval required for each payment", allowed: true },
                { label: "Auto-pay", desc: "Automatic payment without wallet popup", allowed: false },
                { label: "Transfer assets", desc: "Move funds to external addresses", allowed: false },
              ].map((p) => (
                <div key={p.label} className="flex items-start gap-3 p-2 rounded-md bg-muted/20">
                  <div className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${p.allowed ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                    {p.allowed ? "✓" : "✕"}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{p.label}</p>
                    <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground bg-muted/20 p-2 rounded-md border border-border/30">
              Payments are signed explicitly before settlement. The app never holds your private keys.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testnet Funding */}
      {network === "testnet" && (
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-accent" /> Fund Testnet Wallet</h3>
            <p className="text-xs text-muted-foreground">Get free testnet XLM from Friendbot to start testing.</p>
            <div className="bg-muted/30 rounded-md p-2">
              <code className="text-[11px] font-mono text-foreground break-all">
                curl "https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY"
              </code>
            </div>
            <p className="text-[10px] text-muted-foreground">After funding, add a USDC trustline to receive test USDC.</p>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader className="pb-3"><CardTitle className="text-sm">Wallet Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border/50" />
            {WALLET_TIMELINE.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <div key={i} className="relative flex items-start gap-3">
                  <div className="absolute -left-6 mt-0.5 h-[18px] w-[18px] rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
                    <Icon className="h-2.5 w-2.5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{item.event}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
