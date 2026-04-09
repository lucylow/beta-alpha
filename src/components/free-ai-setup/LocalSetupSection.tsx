import { useState } from "react";
import { motion } from "framer-motion";
import { localSetupSteps, localModels, connectionSnippets } from "@/content/free-ai-setup-data";
import { Check, Copy, ChevronDown, ChevronRight, Clock, Star } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ── Local Setup Steps ── */
export function LocalStepsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<boolean[]>(new Array(localSetupSteps.length).fill(false));

  return (
    <section id="local-setup" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Run a local model with Ollama</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">Available on macOS, Linux, and Windows. Full privacy, zero recurring cost.</p>

        {/* progress */}
        <div className="flex items-center gap-2 mb-8">
          {localSetupSteps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${checklist[i] ? "bg-success" : "bg-muted"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-2">{checklist.filter(Boolean).length}/{localSetupSteps.length}</span>
        </div>

        <div className="space-y-3">
          {localSetupSteps.map((s) => {
            const isOpen = expanded === s.step;
            return (
              <div key={s.step} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : s.step)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setChecklist((c) => { const n = [...c]; n[s.step - 1] = !n[s.step - 1]; return n; }); }}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checklist[s.step - 1] ? "bg-success border-success" : "border-border"
                    }`}
                  >
                    {checklist[s.step - 1] && <Check className="w-3.5 h-3.5 text-success-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground">{s.step}. {s.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" /> {s.time}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </button>
                {isOpen && s.command && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-border">
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <pre className="font-mono text-xs text-accent whitespace-pre-wrap break-all">{s.command}</pre>
                        <CopyButton text={s.command} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Model Comparison ── */
export function ModelComparisonSection() {
  return (
    <section id="model-comparison" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Local model comparison</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">Choose the model that fits your hardware and use case.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {localModels.map((m) => (
            <div key={m.name} className={`rounded-xl border p-5 space-y-3 ${m.recommended ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{m.name}</h3>
                {m.recommended && (
                  <span className="flex items-center gap-1 text-xs text-accent font-medium">
                    <Star className="w-3 h-3" /> Recommended
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground">{m.param}</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p><span className="text-foreground font-medium">Best for:</span> {m.bestFor}</p>
                <p><span className="text-foreground font-medium">Hardware:</span> {m.hardware}</p>
                <p><span className="text-foreground font-medium">Speed:</span> {m.speed}</p>
                <p><span className="text-foreground font-medium">Tool calling:</span> {m.toolCalling}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <code className="text-xs font-mono text-accent truncate">{m.ollama}</code>
                <CopyButton text={m.ollama} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Claude Code Connection Tabs ── */
export function ConnectionSection() {
  const tabs = Object.keys(connectionSnippets);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const snippet = connectionSnippets[activeTab];

  return (
    <section id="connection" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Connect Claude Code to any provider</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">Point Claude Code to your chosen provider. Swap the base URL, keep the workflow the same.</p>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* tabs */}
          <div className="flex overflow-x-auto border-b border-border">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-3 text-xs font-mono whitespace-nowrap transition-colors ${
                  activeTab === t ? "bg-accent/10 text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {/* body */}
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <pre className="font-mono text-xs text-accent whitespace-pre-wrap flex-1">{snippet.envVars}</pre>
              <CopyButton text={snippet.envVars} />
            </div>
            <p className="text-sm text-muted-foreground">{snippet.note}</p>
            <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
              Best for: {snippet.bestFor}
            </span>
          </div>
        </div>

        {/* privacy callout */}
        <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-4 flex gap-3">
          <div className="w-1 rounded-full bg-warning flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Privacy note</p>
            <p className="text-xs text-muted-foreground mt-1">
              Some free cloud providers log prompts for model improvement. For sensitive or proprietary code,
              use local Ollama, a paid plan, or an EU-based provider. Use local when privacy matters most.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
