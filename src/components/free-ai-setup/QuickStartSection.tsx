import { useState } from "react";
import { promptExamples, type SetupPath } from "@/content/free-ai-setup-data";
import { Zap, Copy, Check } from "lucide-react";

const pathFilter: { label: string; value: SetupPath | "all" }[] = [
  { label: "All paths", value: "all" },
  { label: "Local only", value: "local" },
  { label: "Cloud only", value: "cloud" },
  { label: "GPU only", value: "gpu" },
];

const quickSteps = [
  { title: "Choose a path", benefit: "Local, cloud, or GPU — pick one." },
  { title: "Install the tool or sign up", benefit: "Ollama, a free API key, or a GPU rental." },
  { title: "Start the model", benefit: "Pull locally or point to an endpoint." },
  { title: "Connect Claude Code", benefit: "Set your ANTHROPIC_BASE_URL." },
  { title: "Test a prompt", benefit: "Send a quick test to verify." },
  { title: "Expand to your project", benefit: "Start building for real." },
];

export function QuickStartSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Quick start</h2>
        <p className="text-muted-foreground mb-8">Six steps to go from zero to coding with AI.</p>
        <div className="relative space-y-0">
          {quickSteps.map((s, i) => (
            <div key={i} className="flex gap-4 items-start pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                  {i + 1}
                </div>
                {i < quickSteps.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromptExamplesSection() {
  const [filter, setFilter] = useState<SetupPath | "all">("all");
  const filtered = filter === "all" ? promptExamples : promptExamples.filter((p) => p.path === filter);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">What to do after setup</h2>
        <p className="text-muted-foreground mb-6">Concrete tasks to try with your new AI assistant.</p>
        <div className="flex gap-2 mb-6">
          {pathFilter.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.goal} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">{p.goal}</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-medium">Model:</span> {p.model}
              </p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                p.path === "local" ? "bg-success/10 text-success" : p.path === "cloud" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
              }`}>
                {p.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
