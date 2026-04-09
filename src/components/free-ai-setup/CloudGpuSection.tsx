import { useState } from "react";
import { cloudProviders, gpuProviders } from "@/content/free-ai-setup-data";
import { Copy, Check, Star, ExternalLink } from "lucide-react";

function CopyBtn({ text }: { text: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy">
      {c ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

type CloudGoal = "all" | "fastest" | "coding" | "context" | "easy";
const goalLabels: Record<CloudGoal, string> = { all: "All", fastest: "Fastest", coding: "Best coding", context: "Large context", easy: "Easiest setup" };
const goalMap: Record<CloudGoal, string[]> = {
  all: [],
  fastest: ["Groq"],
  coding: ["Mistral (Codestral)"],
  context: ["Google AI Studio"],
  easy: ["OpenRouter", "Groq"],
};

export function CloudSection() {
  const [goal, setGoal] = useState<CloudGoal>("all");
  const filtered = goal === "all" ? cloudProviders : cloudProviders.filter((p) => goalMap[goal].includes(p.name));

  return (
    <section id="cloud-apis" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Use free cloud APIs</h2>
        <p className="text-muted-foreground mb-6 max-w-lg">When you want speed over local setup. Great for starting immediately.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(goalLabels) as CloudGoal[]).map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                goal === g ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {goalLabels[g]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div key={p.name} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{p.name}</h3>
                {p.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{p.badge}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{p.freeNote}</p>
              <div className="rounded-lg bg-muted/30 p-3 flex items-center justify-between gap-2">
                <code className="text-xs font-mono text-accent truncate">{p.model}</code>
                <CopyBtn text={p.model} />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">Best for:</span> {p.bestFor}</p>
                <p><span className="text-foreground font-medium">Privacy:</span> {p.privacyNote}</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No providers match this filter.</p>}
      </div>
    </section>
  );
}

export function GpuSection() {
  return (
    <section id="gpu-rental" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Rent a GPU for a few dollars</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">When local hardware isn't enough. Good for 1–3 day hackathons. Cheaper than committing to a month.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gpuProviders.map((g) => (
            <div key={g.name} className={`rounded-xl border p-5 space-y-3 ${g.recommended ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">{g.name}</h3>
                {g.recommended && <Star className="w-4 h-4 text-accent" />}
              </div>
              <div className="text-sm font-mono text-accent font-bold">{g.pricePerHour}</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="text-foreground font-medium">GPU:</span> {g.gpu}</p>
                <p><span className="text-foreground font-medium">Best for:</span> {g.bestFor}</p>
                <p><span className="text-foreground font-medium">Billing:</span> {g.billing}</p>
                <p><span className="text-foreground font-medium">Setup:</span> {g.setupFriction} friction</p>
              </div>
            </div>
          ))}
        </div>

        {/* budget calculator */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-foreground mb-4">Quick budget estimate</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { hours: "8 hours", cost: "$1.20 – $6.40", note: "One coding day" },
              { hours: "24 hours", cost: "$3.60 – $19.20", note: "Full hackathon day" },
              { hours: "48 hours", cost: "$7.20 – $38.40", note: "Weekend hackathon" },
            ].map((e) => (
              <div key={e.hours} className="space-y-1">
                <p className="text-lg font-bold text-accent">{e.cost}</p>
                <p className="text-sm font-medium text-foreground">{e.hours}</p>
                <p className="text-xs text-muted-foreground">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
