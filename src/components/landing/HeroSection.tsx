import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, Play, Package, ShieldCheck, Search } from "lucide-react";
import { heroApprovalPreview } from "@/content/landing-mock-data";

/** Replace with your real demo when available */
const DEMO_VIDEO_ID = "dQw4w9WgXcQ";

const TRUST_BADGES = [
  { label: "Human-in-the-loop", title: "Review and approve before spend" },
  { label: "Guardrails enabled", title: "Policy controls on every action" },
  { label: "Stellar testnet ready", title: "USDC micropayments on testnet" },
  { label: "Open source", title: "Auditable MCP server and landing" },
  { label: "Audit log enabled", title: "Every approval is traceable" },
  { label: "Spending caps", title: "Budget limits prevent runaway cost" },
] as const;

function useSearchCounter() {
  const [count, setCount] = useState(12847);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => c + Math.floor(Math.random() * 3)), 4000);
    return () => clearInterval(t);
  }, []);
  return count;
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-25 pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(0,229,255,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(123,44,191,0.14) 0%, transparent 45%)",
        }}
      />
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(187 100% 50%)"
              strokeWidth="0.5"
              opacity="0.22"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  );
}

function smoothId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const searchCount = useSearchCounter();

  const openVideo = useCallback(() => {
    setVideoSrc(`https://www.youtube.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0`);
    setVideoOpen(true);
  }, []);

  const closeVideo = useCallback(() => {
    setVideoOpen(false);
    setVideoSrc(null);
  }, []);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [videoOpen, closeVideo]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden pt-20 md:pt-24">
      <AnimatedGrid />

      <div className="relative z-10 container mx-auto max-w-[1280px] px-4 sm:px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_min(440px,100%)] gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6 md:mb-8">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="text-accent text-xs font-mono">Supervised agent search · x402 · MCP · Stellar</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.65rem] xl:text-[2.85rem] font-display font-bold text-primary-foreground leading-[1.12] max-w-3xl mx-auto lg:mx-0">
                Let your AI agent search the web —{" "}
                <span className="text-gradient-hero">with guardrails on every step.</span>
              </h1>

              <p className="mt-5 md:mt-6 text-base md:text-lg text-primary-foreground/65 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                x402 Web Search MCP Server brings pay-per-query web search to Claude Code, Cursor, and other MCP clients on Stellar,
                with policy controls, approval gates, audit logs, and spending limits.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary-foreground/55 max-w-2xl mx-auto lg:mx-0">
                <Search className="h-3.5 w-3.5 text-accent" aria-hidden />
                <span className="font-mono text-accent tabular-nums">{searchCount.toLocaleString()}</span>
                <span>supervised searches processed</span>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {TRUST_BADGES.map((b) => (
                  <span
                    key={b.label}
                    title={b.title}
                    className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1 text-[10px] sm:text-[11px] font-mono text-primary-foreground/75"
                  >
                    {b.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => smoothId("demo")}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-accent-foreground font-semibold text-sm hover:shadow-glow transition-all motion-safe:hover:scale-[1.02] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent"
                >
                  Try the guardrail demo
                </button>
                <button
                  type="button"
                  onClick={() => smoothId("safety")}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-8 py-3.5 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden /> See policy controls
                </button>
                <button
                  type="button"
                  onClick={() => smoothId("install")}
                  className="hidden lg:flex items-center justify-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-6 py-3.5 text-primary-foreground/80 font-medium text-sm hover:bg-primary-foreground/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Package className="h-4 w-4" aria-hidden /> Install
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-1">
                <button
                  type="button"
                  onClick={() => smoothId("safety")}
                  className="text-sm font-medium text-primary-foreground/50 hover:text-accent transition-colors py-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                >
                  See the safety model ↓
                </button>
                <button
                  type="button"
                  onClick={openVideo}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/50 hover:text-accent transition-colors py-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  aria-label="Watch demo video"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden /> Watch video
                </button>
                <Link
                  to="/demo"
                  className="text-sm font-medium text-primary-foreground/45 hover:text-accent py-1.5 underline-offset-4 hover:underline"
                >
                  Full demo →
                </Link>
              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex justify-center lg:justify-start"
            >
              <button
                type="button"
                onClick={() => smoothId("problem")}
                className="inline-flex items-center gap-1 text-primary-foreground/35 hover:text-accent transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                aria-label="Scroll to pain points"
              >
                <ArrowDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            aria-label="Approval workflow preview (illustrative)"
          >
            <div className="absolute -inset-4 rounded-3xl bg-accent/10 blur-2xl opacity-50 pointer-events-none motion-reduce:opacity-30" />
            <div className="relative rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.07] backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-primary-foreground/10 bg-primary/40">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
                <span className="text-primary-foreground/50 text-xs font-mono ml-2">Approval preview · mock</span>
              </div>

              <div className="p-5 md:p-6 space-y-5 text-left">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase text-primary-foreground/45">Agent request</p>
                  <p className="text-sm text-primary-foreground/90 leading-snug line-clamp-2">{heroApprovalPreview.query}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">
                      Est. {heroApprovalPreview.estimatedCost}
                    </span>
                    <span className="rounded-md border border-primary-foreground/15 px-2 py-0.5 text-primary-foreground/70">
                      Risk {heroApprovalPreview.risk}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {heroApprovalPreview.steps.map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-xl border px-3 py-2.5 text-[11px] ${
                        s.active
                          ? "border-accent/35 bg-accent/10 text-primary-foreground/90"
                          : "border-primary-foreground/10 text-primary-foreground/45"
                      }`}
                    >
                      <p className="font-semibold">{s.label}</p>
                      <p className="text-primary-foreground/55 mt-0.5">{s.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <span className="flex-1 rounded-lg bg-success/20 border border-success/30 text-success text-center text-xs font-semibold py-2.5">
                    Approve
                  </span>
                  <span className="flex-1 rounded-lg border border-primary-foreground/15 text-primary-foreground/50 text-center text-xs font-semibold py-2.5">
                    Deny
                  </span>
                </div>

                <p className="text-[11px] text-primary-foreground/40 text-center">
                  Intentionally supervised — not fully autonomous spend.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {videoOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/80 dark:bg-background/90 backdrop-blur-sm p-4 sm:p-8"
          role="presentation"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl rounded-2xl bg-background border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Demo video"
          >
            <button
              type="button"
              onClick={closeVideo}
              className="absolute top-3 right-3 z-10 rounded-full bg-background/90 border border-border px-3 py-2 text-sm text-foreground hover:bg-muted cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Close
            </button>
            <div className="aspect-video w-full bg-muted">
              {videoSrc && (
                <iframe
                  title="x402 Web Search demo video"
                  src={videoSrc}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
