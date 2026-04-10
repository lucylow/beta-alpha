import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, BookOpen } from "lucide-react";
import { DOCS_TABS } from "@/content/dapp-mock-data";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("quickstart");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [checklist, setChecklist] = useState<Set<number>>(new Set());
  const tab = DOCS_TABS.find((t) => t.id === activeTab)!;

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const toggleCheck = (idx: number) => {
    setChecklist((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const allChecked = activeTab === "quickstart" && checklist.size === tab.steps.length;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 pb-20 md:pb-8">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">Documentation</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-muted/30 p-1 rounded-lg">
        {DOCS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${activeTab === t.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {tab.steps.map((step, i) => (
          <Card key={i} className="bg-card-gradient border-border/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeTab === "quickstart" && (
                    <button onClick={() => toggleCheck(i)} className={`h-5 w-5 rounded border flex items-center justify-center text-[10px] transition-colors ${checklist.has(i) ? "bg-success border-success text-success-foreground" : "border-border/50"}`}>
                      {checklist.has(i) && <Check className="h-3 w-3" />}
                    </button>
                  )}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => copyCode(step.code, i)}
                >
                  {copiedIdx === i ? <><Check className="h-3 w-3 text-success" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                </Button>
              </div>
              <pre className="bg-muted/30 rounded-md p-3 text-[11px] font-mono text-foreground overflow-x-auto whitespace-pre-wrap">{step.code}</pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ready indicator */}
      {activeTab === "quickstart" && (
        <div className={`text-center p-3 rounded-lg border text-sm transition-colors ${allChecked ? "bg-success/10 border-success/20 text-success" : "bg-muted/20 border-border/30 text-muted-foreground"}`}>
          {allChecked ? "✓ Ready to launch!" : `${checklist.size}/${tab.steps.length} steps completed`}
        </div>
      )}

      {/* Architecture diagram */}
      <Card className="bg-card-gradient border-border/50">
        <CardContent className="p-4 text-center space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Architecture</p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
            {["MCP Client", "→", "x402 Server", "→", "Stellar", "→", "Brave API"].map((n, i) => (
              n === "→" ? <span key={i} className="text-accent font-bold">→</span> :
              <Badge key={i} variant="outline" className="text-[10px] font-mono">{n}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
