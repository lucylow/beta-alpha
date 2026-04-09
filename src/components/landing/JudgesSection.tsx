import { motion } from "framer-motion";
import { Trophy, Check, ExternalLink, Download } from "lucide-react";

const points = [
  "Human-in-the-loop story told end-to-end: review, approve, pay, audit — not autonomous blind spend",
  "Real x402 integration path with @x402/stellar on Stellar testnet",
  "MCP server works with Claude Code / Cursor with explicit confirmation UX in the landing demo",
  "Demo video slot + open-source repo with SKILL.md",
  "Supervised transaction feed, policy panel, and audit trail mock panels for judges",
  "Fast to grok: 3‑minute walkthrough of the approval path",
];

function downloadPlaceholderPitch() {
  const minimal = `%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
trailer<</Root 1 0 R/Size 4>>
%%EOF`;
  const blob = new Blob([minimal], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "x402-search-pitch-placeholder.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

export default function JudgesSection() {
  return (
    <section id="judges" className="py-20 md:py-32 bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/12 via-card to-secondary/5 p-6 md:p-10 shadow-card-hover border-l-[5px] border-l-amber-500"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Trophy className="h-8 w-8 text-amber-500 shrink-0" />
            <h2 className="text-xl md:text-3xl font-display font-bold text-foreground">
              🏆 Stellar Hacks: Agents submission – why we win
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {points.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 text-sm text-foreground"
              >
                <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                {p}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://dorahacks.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" /> View Submission on DoraHacks
            </a>
            <button
              type="button"
              onClick={downloadPlaceholderPitch}
              className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-foreground text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" /> Download Pitch Deck
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
