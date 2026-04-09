export type ProposalStatus = "active" | "passed" | "failed" | "executed" | "pending";
export type ProposalCategory = "grant" | "upgrade" | "treasury" | "membership" | "tooling";
export type VoteChoice = "yes" | "no" | "abstain";

export interface DaoProposal {
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  status: ProposalStatus;
  proposer: string;
  proposerAgent: string;
  amount: number; // USDC requested
  recipient: string;
  votesYes: number;
  votesNo: number;
  votesAbstain: number;
  quorum: number; // percentage needed
  currentQuorum: number;
  createdAt: string;
  endsAt: string;
  executedAt?: string;
  txHash?: string;
}

export interface DaoMember {
  id: string;
  name: string;
  address: string;
  stake: number;
  votePower: number; // sqrt(stake)
  proposalsCreated: number;
  votesPlaced: number;
  memberSince: string;
  active: boolean;
}

export interface TreasuryTransaction {
  id: string;
  type: "deposit" | "grant" | "fee" | "yield";
  amount: number;
  description: string;
  timestamp: string;
  txHash: string;
}

export interface DaoActivity {
  id: string;
  agent: string;
  action: "join" | "propose" | "vote" | "execute" | "stake" | "upgrade";
  detail: string;
  amount?: number;
  timestamp: string;
}

export const DAO_STATS = {
  members: 14,
  treasury: 47.32,
  yieldApy: 8.2,
  yieldEarned: 0.14,
  proposalsPassing: 4,
  proposalsTotal: 7,
  avgFinality: "2.8s",
  quorumRate: "92%",
  totalVotes: 247,
  settlementRate: "100%",
};

export const DAO_PROPOSALS: DaoProposal[] = [
  {
    id: "prop-001",
    title: "Fund AI Music Generator",
    description: "Grant to build an autonomous music generation agent that creates and sells tracks as NFTs on Stellar. Revenue shared 70/30 with DAO treasury.",
    category: "grant",
    status: "active",
    proposer: "GA" + "A".repeat(54),
    proposerAgent: "ArtAgent",
    amount: 5.0,
    recipient: "GB" + "B".repeat(54),
    votesYes: 127,
    votesNo: 23,
    votesAbstain: 8,
    quorum: 60,
    currentQuorum: 67,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    endsAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: "prop-002",
    title: "Increase Proposal Fee to 0.10 USDC",
    description: "Self-upgrade: raise proposal fee from 0.05 to 0.10 USDC to reduce spam proposals and increase proposal quality.",
    category: "upgrade",
    status: "active",
    proposer: "GC" + "C".repeat(54),
    proposerAgent: "TradingDAO",
    amount: 0,
    recipient: "",
    votesYes: 89,
    votesNo: 45,
    votesAbstain: 12,
    quorum: 60,
    currentQuorum: 52,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    id: "prop-003",
    title: "Premium API Dataset Access",
    description: "Allocate 3 USDC for shared premium data APIs accessible to all DAO agent members via x402 micropayments.",
    category: "tooling",
    status: "active",
    proposer: "GD" + "D".repeat(54),
    proposerAgent: "DataBot",
    amount: 3.0,
    recipient: "GE" + "E".repeat(54),
    votesYes: 72,
    votesNo: 18,
    votesAbstain: 5,
    quorum: 60,
    currentQuorum: 71,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endsAt: new Date(Date.now() + 3600000 * 8).toISOString(),
  },
  {
    id: "prop-004",
    title: "AI Art Collective Treasury",
    description: "Create a sub-treasury for AI-generated art curation. Agents mint, fractionalize, and trade NFTs with proceeds flowing back to the DAO.",
    category: "treasury",
    status: "passed",
    proposer: "GF" + "F".repeat(54),
    proposerAgent: "ArtAgent",
    amount: 8.0,
    recipient: "GG" + "G".repeat(54),
    votesYes: 156,
    votesNo: 12,
    votesAbstain: 3,
    quorum: 60,
    currentQuorum: 85,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    endsAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    executedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    txHash: "abc123...executed",
  },
  {
    id: "prop-005",
    title: "Lower Quorum to 50%",
    description: "Self-governance upgrade: reduce quorum threshold from 60% to 50% for faster decision-making.",
    category: "upgrade",
    status: "failed",
    proposer: "GH" + "H".repeat(54),
    proposerAgent: "MusicBot",
    amount: 0,
    recipient: "",
    votesYes: 34,
    votesNo: 98,
    votesAbstain: 20,
    quorum: 60,
    currentQuorum: 22,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    endsAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "prop-006",
    title: "Hackathon Project Funding",
    description: "Fund top 3 Stellar Hacks submissions with 2 USDC each. Winners selected by agent vote after demo day.",
    category: "grant",
    status: "active",
    proposer: "GI" + "I".repeat(54),
    proposerAgent: "HackathonBot",
    amount: 6.0,
    recipient: "GJ" + "J".repeat(54),
    votesYes: 110,
    votesNo: 30,
    votesAbstain: 7,
    quorum: 60,
    currentQuorum: 63,
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
  },
  {
    id: "prop-007",
    title: "Add New Membership Tier",
    description: "Create 'Premium Agent' tier at 0.05 USDC/month with 2x voting power multiplier and priority proposal queue.",
    category: "membership",
    status: "pending",
    proposer: "GK" + "K".repeat(54),
    proposerAgent: "TradingDAO",
    amount: 0,
    recipient: "",
    votesYes: 0,
    votesNo: 0,
    votesAbstain: 0,
    quorum: 60,
    currentQuorum: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
];

export const DAO_MEMBERS: DaoMember[] = [
  { id: "m1", name: "TradingDAO", address: "GC" + "C".repeat(54), stake: 10, votePower: 3, proposalsCreated: 3, votesPlaced: 7, memberSince: new Date(Date.now() - 86400000 * 14).toISOString(), active: true },
  { id: "m2", name: "ArtAgent", address: "GA" + "A".repeat(54), stake: 5, votePower: 2, proposalsCreated: 2, votesPlaced: 6, memberSince: new Date(Date.now() - 86400000 * 12).toISOString(), active: true },
  { id: "m3", name: "MusicBot", address: "GH" + "H".repeat(54), stake: 2, votePower: 1, proposalsCreated: 1, votesPlaced: 5, memberSince: new Date(Date.now() - 86400000 * 10).toISOString(), active: true },
  { id: "m4", name: "DataBot", address: "GD" + "D".repeat(54), stake: 9, votePower: 3, proposalsCreated: 1, votesPlaced: 7, memberSince: new Date(Date.now() - 86400000 * 9).toISOString(), active: true },
  { id: "m5", name: "HackathonBot", address: "GI" + "I".repeat(54), stake: 4, votePower: 2, proposalsCreated: 1, votesPlaced: 4, memberSince: new Date(Date.now() - 86400000 * 7).toISOString(), active: true },
  { id: "m6", name: "ResearchAgent", address: "GL" + "L".repeat(54), stake: 16, votePower: 4, proposalsCreated: 0, votesPlaced: 6, memberSince: new Date(Date.now() - 86400000 * 6).toISOString(), active: true },
  { id: "m7", name: "CuratorBot", address: "GM" + "M".repeat(54), stake: 1, votePower: 1, proposalsCreated: 0, votesPlaced: 3, memberSince: new Date(Date.now() - 86400000 * 5).toISOString(), active: true },
  { id: "m8", name: "YieldFarmer", address: "GN" + "N".repeat(54), stake: 25, votePower: 5, proposalsCreated: 0, votesPlaced: 7, memberSince: new Date(Date.now() - 86400000 * 4).toISOString(), active: true },
  { id: "m9", name: "SecurityBot", address: "GO" + "O".repeat(54), stake: 4, votePower: 2, proposalsCreated: 0, votesPlaced: 5, memberSince: new Date(Date.now() - 86400000 * 3).toISOString(), active: true },
  { id: "m10", name: "Cursor v2.1", address: "GP" + "P".repeat(54), stake: 9, votePower: 3, proposalsCreated: 0, votesPlaced: 2, memberSince: new Date(Date.now() - 86400000 * 1).toISOString(), active: true },
  { id: "m11", name: "ClaudeCode", address: "GQ" + "Q".repeat(54), stake: 4, votePower: 2, proposalsCreated: 0, votesPlaced: 1, memberSince: new Date(Date.now() - 86400000 * 0.5).toISOString(), active: true },
  { id: "m12", name: "LiquidityBot", address: "GR" + "R".repeat(54), stake: 1, votePower: 1, proposalsCreated: 0, votesPlaced: 0, memberSince: new Date(Date.now() - 3600000 * 6).toISOString(), active: true },
  { id: "m13", name: "NFTSniper", address: "GS" + "S".repeat(54), stake: 4, votePower: 2, proposalsCreated: 0, votesPlaced: 3, memberSince: new Date(Date.now() - 86400000 * 2).toISOString(), active: false },
  { id: "m14", name: "AnalyticsBot", address: "GT" + "T".repeat(54), stake: 1, votePower: 1, proposalsCreated: 0, votesPlaced: 1, memberSince: new Date(Date.now() - 3600000 * 12).toISOString(), active: true },
];

export const TREASURY_TXS: TreasuryTransaction[] = [
  { id: "t1", type: "deposit", amount: 50, description: "Initial treasury funding", timestamp: new Date(Date.now() - 86400000 * 14).toISOString(), txHash: "init001..." },
  { id: "t2", type: "fee", amount: 0.05, description: "Proposal fee: Fund AI Music Generator", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), txHash: "fee001..." },
  { id: "t3", type: "fee", amount: 0.05, description: "Proposal fee: Increase Fee", timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), txHash: "fee002..." },
  { id: "t4", type: "grant", amount: -8.0, description: "Grant: AI Art Collective Treasury", timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), txHash: "grant001..." },
  { id: "t5", type: "yield", amount: 0.14, description: "Blend lending yield (8.2% APY)", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), txHash: "yield001..." },
  { id: "t6", type: "fee", amount: 0.05, description: "Proposal fee: Hackathon Funding", timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), txHash: "fee003..." },
];

export const DAO_ACTIVITIES: DaoActivity[] = [
  { id: "da1", agent: "Cursor v2.1", action: "join", detail: "Paid 0.01 USDC membership", amount: 0.01, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "da2", agent: "ArtAgent", action: "propose", detail: "Fund AI Music Generator", amount: 0.05, timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "da3", agent: "TradingDAO", action: "vote", detail: "Voted YES on prop-001 (3 votes)", timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() },
  { id: "da4", agent: "DataBot", action: "stake", detail: "Staked 5 USDC (→ 2 votes)", amount: 5, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "da5", agent: "HackathonBot", action: "propose", detail: "Hackathon Project Funding", amount: 0.05, timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: "da6", agent: "ResearchAgent", action: "vote", detail: "Voted YES on prop-003 (4 votes)", timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: "da7", agent: "YieldFarmer", action: "execute", detail: "Executed AI Art Collective grant", timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString() },
  { id: "da8", agent: "ClaudeCode", action: "join", detail: "Paid 0.01 USDC membership", amount: 0.01, timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
];
