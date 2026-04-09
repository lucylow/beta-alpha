/**
 * Central mock data for the human-in-the-loop landing experience.
 * Labels clearly as demo / mock where shown in UI.
 */

export const globalDemoState = {
  wallet: {
    connected: true,
    address: "GMOCK…1234",
    balance: "5.000 USDC",
    network: "stellar:testnet",
  },
  approval: {
    status: "pending" as const,
    decision: "review" as const,
    required: true,
    budgetRemaining: "0.048 USDC",
  },
  demo: {
    query: "latest Stellar x402 news",
    estimatedCost: "0.001 USDC",
    humanOverrideEnabled: true,
  },
};

export const heroApprovalPreview = {
  steps: [
    { id: "agent", label: "Agent request", detail: "Web search proposed", active: true },
    { id: "review", label: "Human review", detail: "Cost + policy visible", active: true },
    { id: "pay", label: "Payment", detail: "Only after approve", active: false },
    { id: "result", label: "Results", detail: "Logged to audit", active: false },
  ],
  query: "latest Stellar x402 hackathon news",
  estimatedCost: "0.001 USDC",
  risk: "Low",
};

export const approvalWorkflowMock = {
  query: "latest Stellar x402 hackathon news",
  reason: "Need current event data for a summary.",
  estimatedCost: "0.001 USDC",
  sourceRequirement: "Brave Search · ranked web",
  confidence: "High",
  riskLevel: "Low",
  policy: {
    dailyLimit: "0.01 USDC",
    singleRequestLimit: "0.002 USDC",
    requiresApproval: true,
  },
  humanAction: "approve" as const,
};

export const painPointsMock = [
  {
    id: "runaway-loops",
    title: "Runaway loops",
    description: "Agents can repeat queries and spend without a human seeing the pattern.",
    quote: "Why did it search 17 times?",
  },
  {
    id: "accidental-spend",
    title: "Accidental spend",
    description: "A small request can quietly become a cost if nobody reviews it.",
    quote: "I did not expect that to cost money.",
  },
  {
    id: "low-quality-queries",
    title: "Low-quality queries",
    description: "The agent may search the wrong thing and still consume resources.",
    quote: "The output was fast, but it was not useful.",
  },
  {
    id: "no-audit",
    title: "No audit trail",
    description: "Without logs, it is hard to explain what the agent actually did.",
    quote: "We need to know who approved what.",
  },
];

export const policyControlsMock = {
  budget: {
    dailyLimit: "0.05 USDC",
    perQueryLimit: "0.002 USDC",
  },
  permissions: {
    allowSearch: true,
    allowExternalBrowsing: false,
    allowAutoRetry: false,
  },
  approval: {
    requiredAbove: "0.001 USDC",
    humanCanOverride: true,
  },
};

export const auditLogMock = [
  {
    time: "12:41:22",
    actor: "Human",
    action: "Approved query",
    amount: "0.001 USDC",
    status: "Confirmed",
    note: "Approved for summary generation",
  },
  {
    time: "12:40:58",
    actor: "Agent",
    action: "Drafted search request",
    amount: "Pending",
    status: "Awaiting review",
    note: "Need recent hackathon details",
  },
  {
    time: "12:38:19",
    actor: "Human",
    action: "Denied query",
    amount: "0 USDC",
    status: "Stopped",
    note: "Query was too broad",
  },
];

export const supervisedTransactionsMock = [
  {
    time: "12:34:05",
    amount: "0.001 USDC",
    from: "GA7…3X4",
    to: "GC8…9K2",
    hash: "TX-MOCK-7A3F9C2B",
    approvedBy: "Jordan",
    approvalMode: "manual" as const,
    status: "confirmed" as const,
  },
  {
    time: "12:33:12",
    amount: "0.001 USDC",
    from: "GB2…1L9",
    to: "GC8…9K2",
    hash: "TX-MOCK-2B9E8D4F",
    approvedBy: "Casey",
    approvalMode: "manual" as const,
    status: "confirmed" as const,
  },
  {
    time: "12:31:44",
    amount: "0.001 USDC",
    from: "GD9…4PQ",
    to: "GC8…9K2",
    hash: "TX-MOCK-1C4E0A91",
    approvedBy: "Policy",
    approvalMode: "auto" as const,
    status: "confirmed" as const,
  },
];

export const trustFaqs = [
  {
    q: "Does the human approve every search?",
    a: "Only when your policy says so. Above-threshold amounts, new domains, or sensitive runs can require review; small repeats can be auto-approved with caps. This UI demonstrates the supervised path clearly.",
  },
  {
    q: "Can I change approval thresholds?",
    a: "Yes. Set per-query caps, daily budgets, and the amount above which a human must confirm. Overrides remain available for edge cases.",
  },
  {
    q: "What happens if I deny a request?",
    a: "No payment is authorized and no search is executed. The agent receives a structured denial and can revise the plan—every step stays in the audit log.",
  },
  {
    q: "Can the agent edit the request?",
    a: "The agent proposes; humans can edit the query, tighten scope, or add notes before approval. Edited plans are stored for traceability.",
  },
  {
    q: "Is there an audit log?",
    a: "Yes. Drafts, approvals, denials, payments, and results are timestamped with actor, note, and amounts (demo uses mock rows; testnet uses your facilitator).",
  },
  {
    q: "What if the agent exceeds budget?",
    a: "Further requests queue for review or are blocked, depending on your policy. You can pause spending instantly.",
  },
  {
    q: "Is this testnet-only?",
    a: "The hackathon demo targets Stellar testnet with simulated rows where labeled. Mainnet is primarily configuration plus production facilitator endpoints.",
  },
  {
    q: "Which wallets work?",
    a: "Freighter is the smoothest for judges. Albedo, Hana, HOT, Klever, and OneKey can work where Soroban auth-entry signing is supported.",
  },
];

export const hitlUseCases = [
  {
    title: "Research assistant with approval",
    desc: "Deep dives that only spend after a human sanity-checks the query and ceiling.",
    outcome: "Useful answers without surprise usage.",
  },
  {
    title: "News monitoring with budget guardrails",
    desc: "Alerts when something changes—each pull respects daily limits and optional review.",
    outcome: "Fresh signal, predictable burn.",
  },
  {
    title: "Compliance-aware agent search",
    desc: "Blocklists, scope notes, and mandatory review for regulated topics.",
    outcome: "Defensible, traceable retrieval.",
  },
  {
    title: "Procurement or market research review",
    desc: "Compare vendors or pricing with a human gate before any paid pull.",
    outcome: "Cleaner comparisons, fewer wasted calls.",
  },
  {
    title: "Documentation lookup with spend controls",
    desc: "Agents fetch public docs but cannot loop unchecked across domains.",
    outcome: "Faster support with an audit trail.",
  },
  {
    title: "Internal knowledge assistant",
    desc: "Pair internal sources with optional external search under policy.",
    outcome: "Governance-friendly augmentation.",
  },
];
