import { useState } from "react";
import { motion } from "framer-motion";
import { paths, type SetupPath } from "@/content/free-ai-setup-data";
import { HardDrive, Cloud, Cpu, Shield, Clock, DollarSign, Monitor } from "lucide-react";

const iconMap: Record<string, React.ElementType> = { HardDrive, Cloud, Cpu };
const detailIcons = [DollarSign, Clock, Shield, Monitor];
const detailLabels = ["Cost", "Setup time", "Privacy", "Hardware"];

export default function PathSelector({ scrollRef }: { scrollRef?: Record<string, React.RefObject<HTMLDivElement | null>> }) {
  const [selected, setSelected] = useState<SetupPath>("local");
  const active = paths.find((p) => p.id === selected)!;

  return (
    <section id="path-selector" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose your setup path</h2>
        <p className="text-muted-foreground mb-10 max-w-lg">Pick the path that fits your hardware and goals. You can always switch later.</p>

        <div className="grid md:grid-cols-[1fr_1fr] gap-8">
          {/* cards */}
          <div className="space-y-4">
            {paths.map((p) => {
              const Icon = iconMap[p.icon];
              const isActive = p.id === selected;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`w-full text-left rounded-xl border p-5 transition-all ${
                    isActive
                      ? "border-accent bg-accent/5 shadow-md"
                      : "border-border bg-card hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                    <div>
                      <h3 className="font-semibold text-foreground">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{p.tagline}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.bestFor.map((b) => (
                          <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* detail panel */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-border bg-card p-6 space-y-5"
          >
            <h3 className="text-lg font-bold text-foreground">{active.title} — Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[active.cost, active.setupTime, active.privacy, active.hardware].map((val, i) => {
                const DIcon = detailIcons[i];
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DIcon className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{detailLabels[i]}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{val}</p>
                  </div>
                );
              })}
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Recommended assistant</p>
              <p className="text-sm font-mono text-accent">{active.assistant}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
