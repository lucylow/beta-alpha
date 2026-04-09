import { paths } from "@/content/free-ai-setup-data";
import { Shield, Zap, DollarSign, Clock, Wifi, User } from "lucide-react";

const dims = [
  { label: "Cost", icon: DollarSign, values: ["$0", "$0 (free tier)", "$0.15–$0.80/hr"] },
  { label: "Privacy", icon: Shield, values: ["Full privacy", "Prompts may be logged", "You control instance"] },
  { label: "Speed", icon: Zap, values: ["Depends on hardware", "Fast (cloud infra)", "Fast (remote GPU)"] },
  { label: "Setup", icon: Clock, values: ["10–20 min", "2–5 min", "15–30 min"] },
  { label: "Reliability", icon: Wifi, values: ["Always available", "Rate limits apply", "Instance may timeout"] },
  { label: "Ideal for", icon: User, values: ["Privacy-first devs", "Quick starters", "Heavy workloads"] },
];

export default function TradeoffSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Compare the three paths</h2>
        <p className="text-muted-foreground mb-8 max-w-lg">If privacy matters most, go local. If speed matters most, use free cloud. If performance matters most, rent a GPU briefly.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-muted-foreground font-medium text-xs" />
                {paths.map((p) => (
                  <th key={p.id} className="text-left py-3 px-4 text-foreground font-semibold">{p.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dims.map((d) => (
                <tr key={d.label} className="border-b border-border/50">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <d.icon className="w-3.5 h-3.5" /> {d.label}
                    </span>
                  </td>
                  {d.values.map((v, i) => (
                    <td key={i} className="py-3 px-4 text-xs text-foreground">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
