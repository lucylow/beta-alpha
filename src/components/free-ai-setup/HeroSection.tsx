import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ChevronRight } from "lucide-react";
import { heroChips } from "@/content/free-ai-setup-data";

const terminalStates = [
  { label: "Local", lines: ["$ ollama pull qwen2.5-coder:7b", "pulling manifest...", "✓ Model ready", "$ claude", "● Connected to local model", "Ready to code ✓"] },
  { label: "Cloud", lines: ["$ export ANTHROPIC_BASE_URL=https://api.groq.com/openai/v1", "$ export ANTHROPIC_API_KEY=gsk_...", "$ claude", "● Connected to Groq", "Ready to code ✓"] },
  { label: "GPU", lines: ["$ ssh root@gpu-instance", "$ ollama serve &", "$ ollama pull llama3.1:70b", "✓ Model loaded on A100", "$ claude", "Ready to code ✓"] },
];

export default function HeroSection({ onPathClick }: { onPathClick: (p: string) => void }) {
  const [activeTerminal, setActiveTerminal] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActiveTerminal((p) => (p + 1) % 3), 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4">
      {/* subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* left */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            Build with AI for free,{" "}
            <span className="text-accent">locally or in the cloud.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-lg"
          >
            Use open-source models with Ollama, connect Claude Code to a local or cloud endpoint, and fall back to low-cost GPUs only when you need more power.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {(["local", "cloud", "gpu"] as const).map((p, i) => (
              <button
                key={p}
                onClick={() => onPathClick(p)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                {["Start Local Setup", "Compare Free Cloud Options", "See GPU Fallbacks"][i]}
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </motion.div>
          {/* chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {heroChips.map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-full bg-muted text-xs font-mono text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* right — terminal preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card/80 backdrop-blur overflow-hidden shadow-lg"
        >
          {/* tab bar */}
          <div className="flex border-b border-border">
            {terminalStates.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActiveTerminal(i)}
                className={`flex-1 px-4 py-2.5 text-xs font-mono transition-colors ${
                  activeTerminal === i
                    ? "bg-accent/10 text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* terminal body */}
          <div className="p-5 min-h-[220px] font-mono text-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTerminal}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-1.5"
              >
                {terminalStates[activeTerminal].lines.map((line, li) => (
                  <div
                    key={li}
                    className={
                      line.startsWith("$")
                        ? "text-accent"
                        : line.includes("✓") || line.includes("Ready")
                        ? "text-success"
                        : line.startsWith("●")
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {line}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
