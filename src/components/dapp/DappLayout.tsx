import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search, Wallet, Activity, FileText, DollarSign, BookOpen,
  Play, BarChart3, Shield, Home, Menu, X, Zap
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/app", label: "Dashboard", icon: Home },
  { path: "/app/search", label: "Search", icon: Search },
  { path: "/app/wallet", label: "Wallet", icon: Wallet },
  { path: "/app/activity", label: "Activity", icon: Activity },
  { path: "/app/protocol", label: "x402", icon: Zap },
  { path: "/app/pricing", label: "Pricing", icon: DollarSign },
  { path: "/app/docs", label: "Docs", icon: BookOpen },
  { path: "/app/demo", label: "Demo", icon: Play },
  { path: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/app/trust", label: "Trust", icon: Shield },
];

interface DappLayoutProps {
  children: React.ReactNode;
  walletConnected: boolean;
  onToggleWallet: () => void;
  network: "testnet" | "mainnet";
  onToggleNetwork: () => void;
}

export default function DappLayout({ children, walletConnected, onToggleWallet, network, onToggleNetwork }: DappLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Status Bar */}
      <header className="sticky top-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-3">
        <Link to="/app" className="flex items-center gap-2 mr-2">
          <div className="h-7 w-7 rounded-md bg-accent/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <span className="font-semibold text-sm hidden sm:inline">x402 Search</span>
        </Link>

        <button
          onClick={onToggleNetwork}
          className={cn(
            "text-xs font-mono px-2 py-0.5 rounded-full border cursor-pointer transition-colors",
            network === "testnet"
              ? "bg-warning/10 text-warning border-warning/20"
              : "bg-success/10 text-success border-success/20"
          )}
        >
          {network === "testnet" ? "⚡ Testnet" : "● Mainnet"}
        </button>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-xs px-2.5 py-1.5 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Button
          size="sm"
          variant={walletConnected ? "outline" : "default"}
          onClick={onToggleWallet}
          className={cn("text-xs gap-1.5", walletConnected && "border-success/30 text-success")}
        >
          <Wallet className="h-3.5 w-3.5" />
          {walletConnected ? "GDQP…MFH" : "Connect Wallet"}
        </Button>

        <button
          className="md:hidden p-1.5 rounded-md hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Nav Rail */}
        <nav className="hidden md:flex flex-col w-14 border-r border-border/50 bg-background/50 py-2 gap-1 items-center shrink-0">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center transition-all",
                  active
                    ? "bg-accent/10 text-accent shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Nav Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <nav
              className="absolute left-0 top-14 w-56 bg-card border-r border-border shadow-lg p-3 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      active ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 border-t border-border/50 bg-background/90 backdrop-blur-xl flex items-center justify-around px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[10px] p-1.5 rounded-lg transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
