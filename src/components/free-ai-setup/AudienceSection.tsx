import { audiences } from "@/content/free-ai-setup-data";
import { User, Cloud, Zap, DollarSign, Cpu } from "lucide-react";

const icons = [User, Cloud, Zap, DollarSign, Cpu];
const pathLabels: Record<string, string> = { local: "Go Local", cloud: "Use Cloud", gpu: "Rent GPU" };

export default function AudienceSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Who this is for</h2>
        <p className="text-muted-foreground mb-10 max-w-xl">Find the path that matches your hardware and goals.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {audiences.map((a, i) => {
            const Icon = icons[i];
            return (
              <div
                key={a.label}
                className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-accent/50 transition-colors"
              >
                <Icon className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-sm text-foreground">{a.label}</h3>
                <p className="text-xs text-muted-foreground">{a.benefit}</p>
                <p className="text-xs text-muted-foreground font-mono">{a.hardware}</p>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                  {pathLabels[a.recommendation]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
