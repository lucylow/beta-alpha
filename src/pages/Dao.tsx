import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Vote, Users, Wallet, TrendingUp, Clock, Zap, Shield,
  ThumbsUp, ThumbsDown, Minus, ChevronDown, ChevronUp, Bot,
  CircleDollarSign, Settings, Layers, Trophy, BarChart3,
  ArrowRightLeft, PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DAO_STATS, DAO_PROPOSALS, DAO_MEMBERS, TREASURY_TXS, DAO_ACTIVITIES,
  type DaoProposal, type ProposalStatus, type ProposalCategory,
} from "@/content/dao-mock-data";

/* ─── helpers ─── */
function timeLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
function sqrt(n: number) { return Math.floor(Math.sqrt(n)); }

const statusColor: Record<ProposalStatus, string> = {
  active: "bg-accent/20 text-accent-foreground border-accent/30",
  passed: "bg-success/20 text-success-foreground border-success/30",
  failed: "bg-destructive/20 text-destructive-foreground border-destructive/30",
  executed: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  pending: "bg-muted text-muted-foreground border-border",
};
const catIcon: Record<ProposalCategory, React.ReactNode> = {
  grant: <CircleDollarSign className="w-3.5 h-3.5" />,
  upgrade: <Settings className="w-3.5 h-3.5" />,
  treasury: <Wallet className="w-3.5 h-3.5" />,
  membership: <Users className="w-3.5 h-3.5" />,
  tooling: <Layers className="w-3.5 h-3.5" />,
};
const actIcon: Record<string, React.ReactNode> = {
  join: <Users className="w-3.5 h-3.5 text-accent" />,
  propose: <PlusCircle className="w-3.5 h-3.5 text-secondary" />,
  vote: <Vote className="w-3.5 h-3.5 text-warning" />,
  execute: <Zap className="w-3.5 h-3.5 text-success" />,
  stake: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
  upgrade: <Settings className="w-3.5 h-3.5 text-destructive" />,
};

/* ─── sub-components ─── */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-3 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex justify-center text-accent mb-1">{icon}</div>
      <p className="text-lg font-mono font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

function ProposalCard({ p }: { p: DaoProposal }) {
  const [open, setOpen] = useState(false);
  const totalVotes = p.votesYes + p.votesNo + p.votesAbstain;
  const yPct = totalVotes ? Math.round((p.votesYes / totalVotes) * 100) : 0;
  const nPct = totalVotes ? Math.round((p.votesNo / totalVotes) * 100) : 0;

  return (
    <motion.div layout className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
      <button className="w-full text-left p-4 flex items-start gap-3" onClick={() => setOpen(!open)}>
        <div className="mt-0.5 text-muted-foreground">{catIcon[p.category]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{p.title}</span>
            <Badge variant="outline" className={`text-[10px] ${statusColor[p.status]}`}>{p.status}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">by {p.proposerAgent} · {p.amount > 0 ? `${p.amount} USDC` : "Governance"}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {p.status === "active" && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeLeft(p.endsAt)}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">{p.description}</p>

              {/* vote bars */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <ThumbsUp className="w-3 h-3 text-success" />
                  <div className="flex-1"><Progress value={yPct} className="h-2 [&>div]:bg-success" /></div>
                  <span className="font-mono text-foreground w-10 text-right">{yPct}%</span>
                  <span className="text-muted-foreground w-12 text-right">{p.votesYes}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ThumbsDown className="w-3 h-3 text-destructive" />
                  <div className="flex-1"><Progress value={nPct} className="h-2 [&>div]:bg-destructive" /></div>
                  <span className="font-mono text-foreground w-10 text-right">{nPct}%</span>
                  <span className="text-muted-foreground w-12 text-right">{p.votesNo}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Minus className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Abstain: {p.votesAbstain}</span>
                </div>
              </div>

              {/* quorum */}
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-accent" />
                <span className="text-muted-foreground">Quorum</span>
                <div className="flex-1"><Progress value={p.currentQuorum} className="h-1.5" /></div>
                <span className="font-mono text-foreground">{p.currentQuorum}% / {p.quorum}%</span>
              </div>

              {p.status === "active" && (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-xs h-8"><ThumbsUp className="w-3 h-3 mr-1" /> Vote YES (0.001 USDC)</Button>
                  <Button size="sm" variant="outline" className="text-xs h-8"><ThumbsDown className="w-3 h-3 mr-1" /> NO</Button>
                </div>
              )}
              {p.status === "passed" && (
                <Button size="sm" variant="secondary" className="w-full text-xs h-8"><Zap className="w-3 h-3 mr-1" /> Execute Proposal</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuadraticCalculator() {
  const [stake, setStake] = useState(1);
  const presets = [1, 4, 9, 16, 25, 100];
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <BarChart3 className="w-4 h-4 text-accent" /> Quadratic Voting Calculator
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((v) => (
          <Badge key={v} variant={stake === v ? "default" : "outline"} className="cursor-pointer text-xs" onClick={() => setStake(v)}>
            {v} USDC
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border p-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase">Stake</p>
          <p className="text-lg font-mono font-bold text-foreground">{stake} USDC</p>
        </div>
        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase">Vote Power</p>
          <p className="text-lg font-mono font-bold text-accent">√{stake} = {sqrt(stake)}</p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">Quadratic voting: vote power = √(stake). Prevents whale dominance.</p>
    </div>
  );
}

/* ─── main page ─── */
export default function Dao() {
  const [tab, setTab] = useState("proposals");
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "all">("all");

  const filteredProposals = useMemo(() => {
    if (statusFilter === "all") return DAO_PROPOSALS;
    return DAO_PROPOSALS.filter((p) => p.status === statusFilter);
  }, [statusFilter]);

  const sortedMembers = useMemo(() => [...DAO_MEMBERS].sort((a, b) => b.stake - a.stake), []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 py-3">
          <Link to="/"><Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground"><ArrowLeft className="w-4 h-4" /> Back</Button></Link>
          <h1 className="text-lg font-bold text-foreground font-display">⚖️ AgentDAO</h1>
          <div className="flex-1" />
          <Badge variant="outline" className="text-xs font-mono">Stellar Testnet</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} label="Members" value={DAO_STATS.members} />
          <StatCard icon={<Wallet className="w-4 h-4" />} label="Treasury" value={`$${DAO_STATS.treasury}`} />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Yield APY" value={`${DAO_STATS.yieldApy}%`} />
          <StatCard icon={<Vote className="w-4 h-4" />} label="Proposals" value={`${DAO_STATS.proposalsPassing}/${DAO_STATS.proposalsTotal}`} />
          <StatCard icon={<Zap className="w-4 h-4" />} label="Total Votes" value={DAO_STATS.totalVotes} />
          <StatCard icon={<Shield className="w-4 h-4" />} label="Settlement" value={DAO_STATS.settlementRate} />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="proposals" className="text-xs">Proposals</TabsTrigger>
            <TabsTrigger value="treasury" className="text-xs">Treasury</TabsTrigger>
            <TabsTrigger value="members" className="text-xs">Agents</TabsTrigger>
          </TabsList>

          {/* ── Proposals ── */}
          <TabsContent value="proposals">
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "active", "passed", "failed", "executed", "pending"] as const).map((s) => (
                    <Badge key={s} variant={statusFilter === s ? "default" : "outline"} className="cursor-pointer text-xs capitalize" onClick={() => setStatusFilter(s)}>{s}</Badge>
                  ))}
                </div>
                {filteredProposals.map((p) => <ProposalCard key={p.id} p={p} />)}
                {filteredProposals.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No proposals match filter.</p>}
              </div>
              <aside className="space-y-4">
                <QuadraticCalculator />
                {/* Activity feed */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Bot className="w-4 h-4 text-accent" /> Agent Activity</h3>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {DAO_ACTIVITIES.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 text-xs rounded-lg bg-muted/20 px-2.5 py-1.5">
                        {actIcon[a.action]}
                        <span className="font-medium text-foreground">{a.agent}</span>
                        <span className="text-muted-foreground truncate flex-1">{a.detail}</span>
                        <span className="text-muted-foreground whitespace-nowrap">{timeAgo(a.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* x402 pricing */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-2" style={{ boxShadow: "var(--shadow-card)" }}>
                  <h3 className="text-sm font-semibold text-foreground">x402 DAO Fees</h3>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex justify-between"><span>Membership</span><span className="font-mono text-accent">0.01 USDC/mo</span></li>
                    <li className="flex justify-between"><span>Propose</span><span className="font-mono text-accent">0.05 USDC</span></li>
                    <li className="flex justify-between"><span>Vote</span><span className="font-mono text-accent">0.001 USDC</span></li>
                    <li className="flex justify-between"><span>Execute</span><span className="font-mono text-accent">Free</span></li>
                  </ul>
                </div>
              </aside>
            </div>
          </TabsContent>

          {/* ── Treasury ── */}
          <TabsContent value="treasury">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
                <h3 className="font-semibold text-foreground">Treasury Balance</h3>
                <p className="text-3xl font-mono font-bold text-accent">${DAO_STATS.treasury} <span className="text-sm text-muted-foreground">USDC</span></p>
                <div className="flex gap-4 text-xs">
                  <div><p className="text-muted-foreground">Yield (APY)</p><p className="font-mono font-bold text-success">{DAO_STATS.yieldApy}%</p></div>
                  <div><p className="text-muted-foreground">Earned</p><p className="font-mono font-bold text-foreground">${DAO_STATS.yieldEarned}</p></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
                <h3 className="font-semibold text-foreground">Transaction History</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {TREASURY_TXS.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-2 text-xs border-b border-border pb-1.5 last:border-0">
                      <span className={`font-mono font-bold ${tx.amount >= 0 ? "text-success" : "text-destructive"}`}>
                        {tx.amount >= 0 ? "+" : ""}{tx.amount} USDC
                      </span>
                      <span className="text-muted-foreground truncate flex-1">{tx.description}</span>
                      <span className="text-muted-foreground whitespace-nowrap">{timeAgo(tx.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── Members ── */}
          <TabsContent value="members">
            <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left p-3">#</th>
                      <th className="text-left p-3">Agent</th>
                      <th className="text-right p-3">Stake</th>
                      <th className="text-right p-3">Votes</th>
                      <th className="text-right p-3">Proposals</th>
                      <th className="text-right p-3">Voted</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.map((m, i) => (
                      <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-3 text-muted-foreground">{i === 0 ? <Trophy className="w-3.5 h-3.5 text-warning" /> : i + 1}</td>
                        <td className="p-3 font-medium text-foreground flex items-center gap-1.5"><Bot className="w-3 h-3 text-accent" /> {m.name}</td>
                        <td className="p-3 text-right font-mono text-accent">{m.stake} USDC</td>
                        <td className="p-3 text-right font-mono text-foreground">√{m.stake} = {m.votePower}</td>
                        <td className="p-3 text-right text-muted-foreground">{m.proposalsCreated}</td>
                        <td className="p-3 text-right text-muted-foreground">{m.votesPlaced}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block w-2 h-2 rounded-full ${m.active ? "bg-success" : "bg-muted-foreground"}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
