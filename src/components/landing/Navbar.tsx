import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Play, Sun, Wallet, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { type NavSectionId, useActiveNavSection } from "@/hooks/useActiveNavSection";

const navLinks: { label: string; href: string; sectionId: NavSectionId }[] = [
  { label: "Guardrails", href: "#guardrails", sectionId: "guardrails" as NavSectionId },
  { label: "Demo", href: "#demo", sectionId: "demo" },
  { label: "Policies", href: "#safety", sectionId: "safety" },
  { label: "Logs", href: "#audit", sectionId: "audit" as NavSectionId },
  { label: "Pricing", href: "#pricing", sectionId: "pricing" },
  { label: "Install", href: "#install", sectionId: "install" as NavSectionId },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
];

function smoothScrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const walletModalRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveNavSection();
  const { setTheme, resolvedTheme } = useTheme();
  const { publicKey, truncatedAddress, usdcBalance, connecting, connect, disconnect, error } =
    useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch {
      setWalletModalOpen(true);
    }
  };

  useEffect(() => {
    if (!walletModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWalletModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [walletModalOpen]);

  useEffect(() => {
    if (!walletModalOpen) return;
    walletModalRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus();
  }, [walletModalOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-primary/85 dark:bg-primary/90 backdrop-blur-xl supports-[backdrop-filter]:bg-primary/75"
        aria-label="Primary"
      >
        <div className="container mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          >
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-mono font-bold text-sm">
              x4
            </div>
            <span className="text-primary-foreground font-display font-bold text-lg hidden sm:inline leading-tight">
              x402 Search<span className="text-accent"> · Stellar</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            <span className="mr-2 inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-mono text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse" />
              Guardrails enabled
            </span>
            {navLinks.map((l) => {
              const isActive = activeSection != null && activeSection === l.sectionId;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 ${
                    isActive ? "text-accent" : "text-primary-foreground/70 hover:text-accent"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo(l.href);
                  }}
                >
                  {l.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hidden lg:inline-flex text-primary-foreground/90 border border-primary-foreground/15 hover:bg-primary-foreground/10 rounded-full"
              asChild
            >
              <a
                href="#demo"
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo("#demo");
                }}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" aria-hidden />
                View Demo
              </a>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10"
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {publicKey ? (
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-mono text-accent max-w-[280px]">
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{truncatedAddress}</span>
                <span className="text-success shrink-0 tabular-nums">
                  {usdcBalance != null ? `${usdcBalance} USDC` : "—"}
                </span>
                <button
                  type="button"
                  onClick={disconnect}
                  className="text-primary-foreground/50 hover:text-primary-foreground text-[10px] uppercase shrink-0 cursor-pointer"
                  aria-label="Disconnect wallet"
                >
                  Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                disabled={connecting}
                className="hidden sm:flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors cursor-pointer disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Connect Stellar wallet with Freighter"
              >
                <Wallet className="h-4 w-4" />
                {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            )}

            <button
              type="button"
              className="md:hidden text-primary-foreground p-2 rounded-lg hover:bg-primary-foreground/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-0 right-0 bottom-0 top-[4.25rem] z-40 md:hidden bg-primary px-6 pb-8 pt-4 flex flex-col border-t border-primary-foreground/10"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
              {navLinks.map((l) => {
                const isActive = activeSection != null && activeSection === l.sectionId;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`py-4 px-2 rounded-xl text-lg font-medium border-b border-primary-foreground/10 cursor-pointer ${
                      isActive ? "text-accent" : "text-primary-foreground/90 hover:text-accent"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      smoothScrollTo(l.href);
                    }}
                  >
                    {l.label}
                  </a>
                );
              })}
              <Link
                to="/demo"
                className="py-4 px-2 rounded-xl text-lg font-medium border-b border-primary-foreground/10 text-primary-foreground/90 hover:text-accent"
                onClick={() => setMobileOpen(false)}
              >
                Full demo page
              </Link>
              <Link
                to="/specialized-agents"
                className="py-4 px-2 rounded-xl text-lg font-medium border-b border-primary-foreground/10 text-primary-foreground/90 hover:text-accent"
                onClick={() => setMobileOpen(false)}
              >
                Specialized agents framework
              </Link>
            </div>
            {!publicKey ? (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await connect();
                    setMobileOpen(false);
                  } catch {
                    setWalletModalOpen(true);
                  }
                }}
                disabled={connecting}
                className="mt-6 flex items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-4 text-accent font-semibold cursor-pointer disabled:opacity-60"
              >
                <Wallet className="h-5 w-5" /> {connecting ? "Connecting…" : "Connect Wallet"}
              </button>
            ) : (
              <div className="mt-6 space-y-3 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-primary-foreground/90">
                <div className="font-mono text-sm break-all">
                  <span className="text-accent">{truncatedAddress}</span>
                  <span className="block text-success mt-1">
                    {usdcBalance != null ? `${usdcBalance} USDC (testnet)` : "Balance unavailable — Horizon testnet"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    disconnect();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-full border border-primary-foreground/20 py-3 text-sm cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="mt-4 text-primary-foreground/50 text-sm cursor-pointer text-center"
            >
              Close menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {walletModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 dark:bg-foreground/80 backdrop-blur-sm p-6"
          role="presentation"
          onClick={() => setWalletModalOpen(false)}
        >
          <motion.div
            ref={walletModalRef}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
          >
            <h2 id="wallet-modal-title" className="text-lg font-display font-bold text-foreground">
              Install Freighter
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Connect a Stellar testnet wallet with the Freighter browser extension. We request your public key and read
              USDC balances from Horizon testnet only.
            </p>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-accent text-sm font-medium hover:underline"
            >
              Get Freighter →
            </a>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setWalletModalOpen(false)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await connect();
                    setWalletModalOpen(false);
                  } catch {
                    /* still open */
                  }
                }}
                className="flex-1 rounded-full bg-accent text-accent-foreground py-2.5 text-sm font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Retry
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
