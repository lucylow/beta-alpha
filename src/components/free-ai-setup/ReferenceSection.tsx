import { useState } from "react";
import { troubleshooting, faqs, roadmap, resources } from "@/content/free-ai-setup-data";
import { ChevronDown, ExternalLink, CheckCircle2, Clock, Circle, MessageSquare, Send } from "lucide-react";

/* ── Troubleshooting ── */
export function TroubleshootingSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Troubleshooting</h2>
        <p className="text-muted-foreground mb-8">Common issues and quick fixes.</p>
        <div className="space-y-2">
          {troubleshooting.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{t.symptom}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 space-y-2 text-xs border-t border-border pt-3">
                  <p><span className="text-foreground font-medium">Cause:</span> <span className="text-muted-foreground">{t.cause}</span></p>
                  <p><span className="text-foreground font-medium">Fix:</span> <span className="text-muted-foreground">{t.fix}</span></p>
                  <p className="text-accent">Fallback: {t.fallback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Privacy ── */
export function PrivacySection() {
  const cards = [
    { label: "Local Ollama", badge: "Best privacy", badgeColor: "bg-success/10 text-success", desc: "All inference stays on your machine. No data leaves your network." },
    { label: "Free Cloud API", badge: "Moderate privacy", badgeColor: "bg-warning/10 text-warning", desc: "Prompts may be logged for model improvement. Not ideal for sensitive code." },
    { label: "GPU Rental", badge: "You control it", badgeColor: "bg-accent/10 text-accent", desc: "Your instance, your data. Tear it down when you're done." },
  ];
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Privacy & safety</h2>
        <p className="text-muted-foreground mb-8">Choose convenience when you need speed. Choose local when privacy matters.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-bold text-foreground">{c.label}</h3>
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${c.badgeColor}`}>{c.badge}</span>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="text-sm font-medium text-foreground">{f.question}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground">{f.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Resources ── */
export function ResourcesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Resources</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div key={r.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="font-bold text-foreground">{r.title}</h3>
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <p className="text-xs text-accent">{r.why}</p>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Roadmap ── */
export function RoadmapSection() {
  const statusIcon = { done: CheckCircle2, "in-progress": Clock, planned: Circle };
  const statusColor = { done: "text-success", "in-progress": "text-accent", planned: "text-muted-foreground" };
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Roadmap</h2>
        <div className="space-y-3">
          {roadmap.map((r) => {
            const Icon = statusIcon[r.status];
            return (
              <div key={r.title} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <Icon className={`w-4 h-4 ${statusColor[r.status]}`} />
                <span className="text-sm text-foreground flex-1">{r.title}</span>
                <span className="text-xs text-muted-foreground capitalize">{r.status.replace("-", " ")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Community ── */
export function CommunitySection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <MessageSquare className="w-8 h-8 text-accent mx-auto" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Community & support</h2>
        <p className="text-muted-foreground">If you found a better free setup, share it.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {["Share your setup", "Ask for help", "Suggest a model", "Report a broken preset"].map((a) => (
            <button key={a} className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:border-accent transition-colors">
              {a}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
export function FooterSection() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">Free AI Setup</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The best AI setup is the one you can start today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          <span>Local models</span>
          <span>•</span>
          <span>Free cloud APIs</span>
          <span>•</span>
          <span>GPU rental</span>
          <span>•</span>
          <span>Claude Code integration</span>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Privacy note: Free cloud providers may log prompts. Use local Ollama for sensitive work. Built for hackathons, students, and indie devs.
        </p>
      </div>
    </footer>
  );
}
