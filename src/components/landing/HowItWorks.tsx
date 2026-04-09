import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserRound, Banknote, Send, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const steps = [
  {
    icon: Search,
    title: "Agent drafts the search request",
    desc: "MCP proposes intent, scope, and estimated cost.",
    expand:
      "The tool call includes the query plus hints (timebox, domains). No settlement happens at this stage in supervised mode.",
    code: `await client.callTool("web_search", {\n  query: "latest Stellar x402 news",\n  policyHints: { maxCost: "0.002" }\n});`,
    modalPayload: {
      request: `{ "query": "latest Stellar x402 news", "estCost": "0.001 USDC" }`,
      approval: "queued_for_human",
      txNote: "—",
      result: "—",
    },
  },
  {
    icon: UserRound,
    title: "Human reviews the request and cost",
    desc: "Approve, deny, edit, or escalate with an audit note.",
    expand:
      "The reviewer sees policy context, remaining budget, and risk hints. This is the deliberate checkpoint — not a rubber stamp.",
    code: `// Human decision recorded\n{\n  "decision": "approve",\n  "note": "OK for summary",\n  "editedQuery": null\n}`,
    modalPayload: {
      request: `{ "query": "latest Stellar x402 news" }`,
      approval: "approve · Jordan · note: OK for summary",
      txNote: "Approval envelope signed (mock)",
      result: "—",
    },
  },
  {
    icon: Banknote,
    title: "x402 payment executes",
    desc: "Wallet authorizes the 402 challenge after consent.",
    expand:
      "The client retries with Stellar authorization once policy and human gates pass. Denied requests never reach this step.",
    code: `HTTP/1.1 402 Payment Required\n// … then retry with\nAuthorization: Stellar <signed proof>`,
    modalPayload: {
      request: `{ "amount": "0.001", "token": "USDC" }`,
      approval: "confirmed by facilitator (testnet)",
      txNote: "Settlement for successful delivery",
      result: "pending",
    },
  },
  {
    icon: Send,
    title: "Facilitator settles on Stellar",
    desc: "Proof verified; transaction lands on network.",
    expand:
      "Facilitator validates proof-of-payment, submits the transaction, and returns the explorer-friendly hash to the client.",
    code: `const settled = await facilitator.settle(auth, {\n  network: "stellar:testnet"\n});`,
    modalPayload: {
      request: `{ "proof": "…" }`,
      approval: "automatic after valid proof",
      txNote: "Testnet hash emitted",
      result: `{ "tx_hash": "…" }`,
    },
  },
  {
    icon: FileText,
    title: "Search results return and are logged",
    desc: "Agent gets citations; audit log captures the chain.",
    expand:
      "Ranked results are returned to the MCP client. Logs correlate payer, approver, query, cost, and outcome for later review.",
    code: `{\n  "results": [{ "title": "…", "url": "…" }],\n  "audit": { "ref": "a8f3c21" }\n}`,
    modalPayload: {
      request: `{ "deliver": true }`,
      approval: "logged · Confirmed",
      txNote: "Receipt linked to audit ref",
      result: `{ "results": [ … ], "settled": true }`,
    },
  },
];

export default function HowItWorks() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30 scroll-mt-28">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            How it works: <span className="text-gradient-hero">five transparent steps</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            The human checkpoint is explicit — not buried in middleware. Click a step for payloads and notes.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto relative">
          <div
            className="pointer-events-none absolute left-0 right-0 top-[52px] h-0.5 bg-gradient-to-r from-accent/0 via-accent/35 to-accent/0 hidden xl:block rounded-full"
            aria-hidden
          />
          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 relative">
            {steps.map((step, i) => (
              <motion.button
                type="button"
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setModalIndex(i)}
                className="group text-left rounded-2xl border border-border bg-card p-4 md:p-5 shadow-card hover:shadow-card-hover transition-all duration-300 motion-safe:hover:-translate-y-1 min-h-[150px] flex flex-col cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:border-t-2 xl:border-t-accent/20"
              >
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                  <step.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-[10px] font-mono text-accent">Step {i + 1}</span>
                <h3 className="text-sm md:text-base font-display font-semibold text-foreground mt-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{step.desc}</p>
                <p className="text-xs text-muted-foreground mt-2 opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-28 transition-all duration-300 motion-reduce:opacity-100 motion-reduce:max-h-28">
                  {step.expand}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-12 rounded-2xl border border-border bg-card/80 p-6 md:p-8 shadow-card"
        >
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">Transparency, not magic</h3>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Each step emits structured events for your audit pipeline. In production, map them to your SIEM or data
            warehouse — here, we show the shape so judges and developers can reason about responsibility.
          </p>
        </motion.div>
      </div>

      <Dialog open={modalIndex !== null} onOpenChange={(o) => !o && setModalIndex(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {modalIndex !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{steps[modalIndex].title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">{steps[modalIndex].expand}</p>
              <div className="mt-4 space-y-3 text-xs font-mono text-muted-foreground">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/80 mb-1">Request / payload</p>
                  <pre className="rounded-lg bg-muted p-3 overflow-x-auto text-foreground/90">
                    <code>{steps[modalIndex].modalPayload.request}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/80 mb-1">Approval action</p>
                  <pre className="rounded-lg bg-muted p-3 overflow-x-auto text-foreground/90">
                    <code>{steps[modalIndex].modalPayload.approval}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/80 mb-1">Transaction note</p>
                  <pre className="rounded-lg bg-muted p-3 overflow-x-auto text-foreground/90">
                    <code>{steps[modalIndex].modalPayload.txNote}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/80 mb-1">Result payload</p>
                  <pre className="rounded-lg bg-muted p-3 overflow-x-auto text-foreground/90">
                    <code>{steps[modalIndex].modalPayload.result}</code>
                  </pre>
                </div>
              </div>
              <pre className="mt-4 rounded-xl bg-primary p-4 text-xs text-primary-foreground/85 font-mono overflow-x-auto">
                <code>{steps[modalIndex].code}</code>
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
