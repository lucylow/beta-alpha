import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Plus, X, Globe } from "lucide-react";

const initialAllowlist = [
  "developers.stellar.org",
  "api.search.brave.com",
  "stellar.org",
];

const initialBlocklist = [
  "unknown.example",
  "suspicious.example",
  "malware.example",
];

function DomainList({
  title,
  icon: Icon,
  iconColor,
  items,
  onRemove,
  onAdd,
  addPlaceholder,
  borderColor,
}: {
  title: string;
  icon: typeof CheckCircle2;
  iconColor: string;
  items: string[];
  onRemove: (d: string) => void;
  onAdd: (d: string) => void;
  addPlaceholder: string;
  borderColor: string;
}) {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setValue("");
    }
  };

  return (
    <div className={`rounded-2xl border ${borderColor} bg-card p-6 shadow-card`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden />
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {items.map((d) => (
          <span
            key={d}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-mono text-foreground"
          >
            {d}
            <button
              type="button"
              onClick={() => onRemove(d)}
              className="hover:text-destructive transition-colors cursor-pointer"
              aria-label={`Remove ${d}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-muted-foreground italic">No entries</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder={addPlaceholder}
          className="flex-1 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!value.trim()}
          className="flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

export default function AllowlistBlocklistSection() {
  const [allowlist, setAllowlist] = useState(initialAllowlist);
  const [blocklist, setBlocklist] = useState(initialBlocklist);

  return (
    <section id="lists" className="py-20 md:py-32 bg-background scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Globe className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              Allowlist &amp; blocklist
            </h2>
          </div>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Agents should search the web, not wander the web. Control which domains are permitted or forbidden.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <DomainList
              title="Allowed domains"
              icon={CheckCircle2}
              iconColor="text-success"
              items={allowlist}
              onRemove={(d) => setAllowlist((l) => l.filter((x) => x !== d))}
              onAdd={(d) => setAllowlist((l) => [...l, d])}
              addPlaceholder="e.g. docs.stellar.org"
              borderColor="border-success/20"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
          >
            <DomainList
              title="Blocked domains"
              icon={XCircle}
              iconColor="text-destructive"
              items={blocklist}
              onRemove={(d) => setBlocklist((l) => l.filter((x) => x !== d))}
              onAdd={(d) => setBlocklist((l) => [...l, d])}
              addPlaceholder="e.g. risky.example"
              borderColor="border-destructive/20"
            />
          </motion.div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground max-w-5xl">
          Demo mode · edits are local and not persisted. In production, lists sync with your policy engine.
        </p>
      </div>
    </section>
  );
}
