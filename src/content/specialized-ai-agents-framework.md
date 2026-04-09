# SPECIALIZED AI AGENTS — MODELS, ORCHESTRATION, MCP & X402

## A design & implementation framework for Stellar Hacks: Agents

This guide combines three lenses: **(A)** how to choose, tune, and run **small language models (SLMs)** for deterministic, cost-aware agent behavior; **(B)** how to **orchestrate** many specialized providers with discovery, routing, and x402 micropayments on Stellar; and **(C)** how to ship **MCP tools** so assistants can discover, pay for, and invoke your services from Cursor / Claude Code.

---

# Part A: AI models for specialized agents

## A.1 Introduction — the shift from LLMs to SLMs in agentic AI

For years the industry chased parameter count; for **agentic** workloads, the decisive metric is often **reliable, schema- and API-constrained accuracy**, not open-ended chat. **SLMs** (roughly 1–12B parameters, sometimes up to ~20B) are frequently **sufficient and superior** for tool calling, function JSON, and orchestration steps—especially when paired with **guided decoding** and clear budgets.

For Stellar Hacks: Agents, where agents may autonomously pay via **x402**, model choice directly affects **cost per task**, **latency**, **determinism**, and whether your economics close loop.

## A.2 Why SLMs often outperform frontier models for agentic work

| Metric | Frontier LLM (e.g. GPT-4 class) | SLM (1–12B) | Advantage |
|--------|-----------------------------------|-------------|-----------|
| **Cost per 1M tokens** | roughly \$2–\$15 | roughly \$0.01–\$0.50 | orders of magnitude cheaper |
| **Latency (p95)** | seconds | sub-second to low seconds | better interactive UX |
| **Determinism** | low (stochastic) | high with constrained decoding | critical for payments |
| **Deployment** | cloud-first | on-device / edge possible | privacy, offline |
| **Fine-tuning cost** | high | LoRA-class budgets | viable for hackathons |

Research and practice show that modest models trained or steered for **tool use** can match or beat generalists on **function calling** when outputs are grammar- or schema-bound—closing much of the gap with larger models for **payment-shaped** tasks (parse 402 payload → build auth → retry → interpret tx status).

**Hackathon insight:** If your agent must call Stellar-related APIs, read payment requirements, or emit structured transaction intents, an **SLM + constraints** is often faster, cheaper, and more reliable than an unconstrained frontier call.

## A.3 State-of-the-art SLMs for agentic AI (indicative 2026 landscape)

### Tier 1 — highly capable (roughly 7B–12B)

| Model | Parameters | Agentic notes |
|-------|------------|----------------|
| **Qwen3-8B** | 8B | Strong function calling; very long context in some variants |
| **Meta Llama 3.1 8B Instruct** | 8B | Broad ecosystem; solid tool-use baselines |
| **Nemotron 3 Nano 30B (A3B)** | ~30B total, ~3.6B active (MoE) | Hybrid MoE; long context; configurable “reasoning” modes in family positioning |
| **DeepSeek R1 Distill 8B** | 8B | Strong distilled reasoning for planning-heavy steps |
| **Phi-4 Mini** | ~7B | Strong code/reasoning per Microsoft line |

### Tier 2 — compact (roughly 1B–9B)

| Model | Parameters | Best for |
|-------|------------|----------|
| **Nemotron 3 Nano 4B** | 4B | On-device / edge; relatively low VRAM |
| **Nanbeige 4.1 3B** | 3B | Long tool-heavy trajectories in public reports |
| **Gemma 2 9B** | 9B | Safety-conscious generalist + tools |
| **FunctionGemma 270M** | 270M | Ultra-light **native function calling** |
| **LFM 2.5 (Liquid AI)** | ~3B | On-device agent positioning |

### Tier 3 — ultra-lightweight (&lt; ~1B)

| Model | Parameters | Use case |
|-------|------------|----------|
| **FunctionGemma 270M** | 270M | Edge function calling; smallest footprint |
| **Llama 3.2 1B / 3B** | 1B / 3B | Basic tools + RAG |
| **Smol / “Tiny” multilingual lines** | ~100M+ | Offline or ultra-cheap routing |

**Practical hackathon default:** **Nemotron 3 Nano 4B** or **Nanbeige 4.1 3B** for balance of capability and efficiency; **FunctionGemma 270M** when you need **extreme** cost and on-device calls.

## A.4 Architectures and controls that matter

### Hybrid MoE (e.g. Nemotron-style)

**Mixture-of-experts** designs can keep **active parameters** low per token while retaining model capacity—helpful for **throughput** and **cost** at fixed quality.

### Reasoning / “thinking” budgets

For agents that pay per token, **cap reasoning length** or separate a **planner** step from **executor** steps so spend stays predictable.

### Long context

Long context helps **RAG**, pasted API docs, and **long tool traces**—but for production, prefer **summary + structured state** over unbounded history to control cost.

## A.5 Model selection framework (CLEAR-style)

| Dimension | What to measure | Practical target (directional) |
|-----------|-----------------|--------------------------------|
| **Accuracy** | task completion on your eval set | high for money-moving steps |
| **Cost** | \$ per 1M tokens or per successful task | minimize CPS: cost per successful task |
| **Latency** | p50 / p95 | sub-second to low seconds for interactive agents |
| **Assurance** | schema-valid outputs | very high for payment JSON |
| **Reliability** | executable tool calls / retries needed | high; measure in production |

### AgentOpt (optional tooling)

[AgentOpt](https://github.com/AgentOptimizer/agentopt) searches **combinations** of models per pipeline stage (planner vs solver vs verifier) against a small eval set and surfaces **Pareto** trade-offs (accuracy vs cost vs latency). Useful when your stack has **multiple LLM calls**.

### SLM-default, LLM-fallback

Recommended pattern: **SLM first** with **confidence / verifier** gates; escalate to a larger model only on **parse failure**, **low verifier score**, or **unknown intent**. Keeps median cost down while preserving a safety net.

## A.6 Fine-tuning specialized agents

### Why fine-tune?

Domain **natural language → tool JSON** mappings improve sharply with **1k–10k** high-quality examples plus **execution feedback** (did the call succeed on testnet?).

### Techniques (summary)

| Technique | Best for | Notes |
|-----------|----------|--------|
| **LoRA / QLoRA** | hackathon budgets | often runs on consumer GPUs |
| **Full fine-tune** | big shifts | needs more VRAM / time |
| **RL-style tool tuning** | large toolsets | research frameworks (e.g. ATLAS-class work) |
| **Distillation** | compress teacher → student | needs teacher access |

**Stacks:** Hugging Face Transformers, Unsloth, Axolotl, NeMo, DeepSpeed (depending on scale).

## A.7 Inference optimization

| Technique | Speed | Quality impact | Effort |
|-----------|-------|----------------|--------|
| **Post-training quantization (PTQ)** | large win | small if calibrated | low |
| **Quantization-aware training (QAT)** | large win | can recover PTQ loss | medium |
| **Speculative decoding** | large win | minimal if draft matches | medium |
| **Pruning + distillation** | very large | varies | high |

**Hackathon path:** **GGUF / INT4–INT8** via **llama.cpp**, or **vLLM** for throughput; add **grammar / schema** in the serving stack when supported.

## A.8 On-device and edge deployment

| Platform | Role |
|----------|------|
| **llama.cpp** | CPU / edge GGUF |
| **vLLM** | high-throughput serving |
| **Ollama** | developer-friendly local |
| **MLX** | Apple Silicon |
| **LiteRT / TFLite** | mobile / embedded paths |
| **NVIDIA Triton** | production serving |

**Hybrid:** on-device SLM for **routine** tool picks; small cloud SLM for **heavier** reasoning; frontier only for **escapes**.

## A.9 Determinism and reliability for payment agents

Non-determinism is a **business risk** when a bad JSON shape can mis-send value. Prefer:

| Technique | Role |
|-----------|------|
| **JSON Schema** in API | validate outputs |
| **CFG / grammar-constrained decoding** | cap token space (XGrammar, Outlines, server-native constraints) |
| **Schema-first prompts** | fewer degrees of freedom |

Example schema-first shape for **payment-shaped** outputs (adapt to your facilitator):

```typescript
const x402PaymentSchema = {
  type: "object",
  properties: {
    amount: { type: "string", pattern: "^0\\.001$" },
    token: { type: "string", enum: ["USDC"] },
    network: { type: "string", const: "stellar:testnet" },
    recipient: { type: "string", pattern: "^G[A-Z0-9]{55}$" },
  },
  required: ["amount", "token", "network", "recipient"],
  additionalProperties: false,
} as const;
```

## A.10 MCP integration and model choice

**MCP** exposes tools to clients (Cursor, Claude Code, etc.). The **protocol** is separate from **which model** parses user intent:

- **Lightweight tools** (read balance, simple query) → on-device or tiny SLM.
- **Multi-step DeFi / planning** → larger SLM or frontier **only** for the planner.

**Part C** (below) is the full **MCP tools** blueprint: server setup with the TypeScript SDK, Zod schemas, x402 payment patterns inside tool handlers, Stellar helpers, testing with the Inspector, Cursor/Claude `mcp.json`, troubleshooting, and a submission checklist. Use it when you are implementing the tool surface judges can call directly from an IDE.

**Example tool surface (Stellar payment agent):**

```typescript
{
  name: "send_stellar_payment",
  description:
    "Send USDC on Stellar testnet using x402. Example cost: 0.001 USDC per call — adjust to your server.",
  inputSchema: {
    type: "object",
    properties: {
      recipient: { type: "string", description: "Stellar G-address" },
      amount: { type: "string", description: "Decimal string, e.g. 0.001" },
      memo: { type: "string", description: "Optional memo text" },
    },
    required: ["recipient", "amount"],
  },
}
```

## A.11 Stellar + x402: what the model must get right

1. Parse **402** bodies + `paymentRequirements` consistently.  
2. Build **authorization** payloads compatible with your stack (`@x402/stellar`, facilitator, headers).  
3. **Retry** safely with idempotency keys where supported.  
4. Interpret **tx hashes** / errors without inventing state.

**Stack sketch**

| Layer | Tech | Model role |
|-------|------|------------|
| User / IDE | MCP client | optional frontier planner |
| Tool execution | Your agent server | SLM emits structured ops |
| Payments | x402 | strict JSON + signing |
| Settlement | Stellar testnet / mainnet | observability, not hallucination |

**Prompt pattern (illustrative):**

```typescript
const prompt = `
You are a Stellar payment agent. Output ONLY one JSON function call.

Functions:
- create_x402_auth(amount, token, recipient, network)
- check_balance(asset)
- get_transaction_status(tx_hash)

User: "Pay 0.001 USDC to G... for web search"

Output:
{
  "function": "create_x402_auth",
  "parameters": {
    "amount": "0.001",
    "token": "USDC",
    "recipient": "<G-address>",
    "network": "stellar:testnet"
  }
}
`;
```

## A.12 Evaluation and production metrics

### Benchmarks (directional)

| Benchmark | Focus |
|-----------|--------|
| **BFCL** (versions vary) | function calling |
| **SWE-bench-class** | coding agents |
| **Your internal suite** | **Stellar + x402** parse/build/auth success |

### Production metrics

| Metric | Definition |
|--------|------------|
| **CPS** | total \$ / successful tasks |
| **Schema validity** | % outputs validating |
| **Executable rate** | % tool calls that run without fix-up |
| **p50 / p95 latency** | server-side |
| **Energy / $** | edge deployments |

## A.13 Hackathon model quick picks

| Agent type | Suggested model | Why |
|------------|-----------------|-----|
| **Web search** | Nemotron 3 Nano 4B (or similar) | fast tool loops |
| **Payment executor** | FunctionGemma 270M | tiny, call-shaped |
| **DeFi / many tools** | Nanbeige 4.1 3B class | longer trajectories |
| **Orchestrator / planner** | Qwen3-8B class | long context planning |
| **Reputation / policy narrative** | Gemma 2 9B class | cautious tone |

### Five-day model integration track

| Day | Focus |
|-----|--------|
| **1** | Pick SLM; local inference (Ollama / llama.cpp); MCP stub |
| **2** | Real inference + **schema validation** on all outputs |
| **3** | LoRA / small SFT on **your** JSON examples |
| **4** | Quantize; wire **x402** loop; measure latency |
| **5** | CPS benchmark; README rationale; demo |

### Local run sketch (llama.cpp class)

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && cmake -B build && cmake --build build -j
# Then download a GGUF matching your chosen model card and run the binary
# appropriate for your build (e.g. ./build/bin/llama-cli ...).
```

Use the exact **model repo** and **GGUF filename** from the publisher’s card; names change with releases.

## A.14 Cost framing (API vs local)

Directional **1,000 tasks** illustration:

| Mode | Rough cost | Tradeoff |
|------|------------|----------|
| **API frontier** | pricing × tokens | easy, variable CPS |
| **API small** | lower | still token-variable |
| **Local SLM** | electricity + your time | best CPS if you ship it |

If you charge **0.001 USDC** per query, **inference** should be **negligible** vs API keys (e.g. search) unless you rout everything through expensive models.

## A.15 Model stack summary (submission-friendly)

- **Model:** Nemotron 3 Nano 4B–class **local** or **FunctionGemma 270M** on edge.  
- **Serving:** llama.cpp or vLLM.  
- **Optimization:** INT4–INT8 + optional speculative decoding.  
- **Interface:** MCP (`@modelcontextprotocol/sdk`).  
- **Payments:** x402 on Stellar (e.g. `@x402/stellar` patterns).

## A.16 Model implementation resources

| Resource | URL | Role |
|----------|-----|------|
| Nemotron 3 Nano 4B | `https://huggingface.co/nvidia` (find Nano 4B card) | compact SLM |
| FunctionGemma 270M | `https://huggingface.co/google/functiongemma-270m-it` | tiny tools |
| AgentOpt | `https://github.com/AgentOptimizer/agentopt` | combo search |
| vLLM | `https://github.com/vllm-project/vllm` | serving |
| llama.cpp | `https://github.com/ggerganov/llama.cpp` | edge / CPU |
| Outlines | `https://github.com/outlines-dev/outlines` | structured generation |
| Unsloth | `https://github.com/unslothai/unsloth` | fast LoRA |
| MCP TypeScript SDK | `https://github.com/modelcontextprotocol/typescript-sdk` | MCP server |

---

# Part B: Orchestration, registry, and specialized providers

## B.1 Introduction — swarms, specialists, and the orchestrator

Generalist models excel at reasoning; **specialized agents** excel at one job (search, swaps, yields, reputation). The agentic economy is not one assistant—it is **many specialists** that must be composed for real tasks.

A single user request often needs **multiple agents**. Example: *“Find the best USDC yield on Stellar and move my USDC there”* may require:

1. A **market data agent** for yields  
2. A **swap agent** if the vault expects another asset  
3. A **liquidity / deposit agent**  
4. A **reporting agent** for a human-readable summary  

Without orchestration, the user wires each step by hand. **Routing and orchestration** provide:

- **Discovery** — who offers which capability, at what price and reputation  
- **Routing** — one agent or a **DAG of steps** with dependencies  
- **Payments** — batched spend, budgets, optional escrow patterns  
- **Resilience** — retries, fallbacks, compensation notes  
- **Observability** — tracing and audit-friendly step records  

An **Orchestrator Agent** is itself a specialist: it parses goals, plans workflows, selects providers from a **registry**, executes steps via x402 (often from **one** orchestrator wallet), and returns a single result to the user. On Stellar, **contract accounts** are a natural fit for spending policies and escrow-style patterns (release aligned with verified outcomes where your design allows).

**Specialization still matters:** orchestrators coordinate; **provider agents** do the domain work. **Part A** above helps you pick **models** for the parser/planner/router; **Part B** is how those steps **find and pay** providers.

---

## B.2 Core concepts

### x402, Stellar, and MPP (payment rails)

| Protocol | Best for | How it works |
|----------|----------|--------------|
| **x402** | Pay-per-request, sporadic usage | HTTP 402, auth entry, settlement per request |
| **MPP (Charge)** | One-off higher value | Pull/push credential, single on-chain tx |
| **MPP (Session)** | High-frequency streams | Off-chain channel, periodic settlement |

**Stellar advantages:** USDC, low fees, **contract accounts** (limits, allowlists), **sponsorship** for onboarding.

**x402 flow (recap):** request → 402 + payment requirements → client signs Soroban auth → retry with authorization → facilitator verifies and settles → resource delivered.

### Orchestration vs simple chaining

| Dimension | Simple chaining | Orchestration |
|-----------|-----------------|---------------|
| **Discovery** | Hardcoded URLs | Registry lookup (on-chain or API) |
| **Payment** | Pay each provider ad hoc | Budget-aware routing; optional batching |
| **Errors** | Stop on first failure | Retries, backoff, **fallback** to next registry entry |
| **State** | None | **Workflow + step results** (resume after crash) |
| **Observability** | Ad hoc logs | **Traces**, step IDs, payment tx hashes |
| **Cost** | No global optimization | Prefer cheaper / faster / higher-reputation agents |

**Orchestrator responsibilities:** accept a high-level task → build a **workflow DAG** → for each step, **query registry** → **score and select** agents → **execute** with x402 → aggregate results → optional **settlement / refund** story documented honest limits (x402 settlement is generally final—design accordingly).

---

## B.3 Taxonomy of specialized agents (providers)

| Category | Function | Example capabilities |
|----------|----------|----------------------|
| **Data acquisition** | Fresh facts | `web_search`, market data, news |
| **Data processing** | Transform / analyze | `summarize`, `translate`, structure extraction |
| **Transaction execution** | On-chain actions | `swap_tokens`, `deposit`, `withdraw` |
| **Orchestration** | Plan + coordinate | `run_workflow` (MCP tool), DAG execution |
| **Reputation** | Trust signals | `rate_agent`, `get_reputation` |
| **Security / infra** | Safety & plumbing | scanning, caching, oracles |
| **Content & automation** | Outputs & triggers | reports, cron, webhooks |

Provider agents **register** capabilities; the orchestrator **consumes** the registry and calls them.

---

## B.4 Orchestration architecture (high level)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         User / AI Client (Cursor, Claude Code, …)           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Orchestrator Agent (your project)                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Task parser │ │ Registry    │ │ Router      │ │ Executor (x402)     │   │
│  │ (SLM+JSON)  │ │ client      │ │ cost/rep    │ │                     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ State mgr   │ │ Payment /   │ │ Errors &    │ │ Tracing (e.g. OTel) │   │
│  │             │ │ escrow plan │ │ retries     │ │                     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│          Registry (Soroban contract, REST API, or curated JSON)             │
│   agent_id, endpoint, capabilities[], price, reputation, active flag        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              Specialized agents: search, data, swap, yield, …              │
└─────────────────────────────────────────────────────────────────────────────┘
```

Expose the orchestrator as an **MCP server** so one tool (e.g. `run_workflow`) hides all sub-calls.

---

## B.5 Component 1 — Agent registry (discovery)

The registry is the backbone of dynamic routing.

### Option A: On-chain Soroban (strong hackathon signal)

**Sketch of an interface:**

```rust
pub trait AgentRegistry {
    fn register_agent(
        env: Env,
        endpoint: String,
        capabilities: Vec<Bytes>,
        price: i128,  // smallest units, e.g. 10^-7 USDC
        metadata: String,
    ) -> u64; // agent_id

    fn rate_agent(env: Env, agent_id: u64, score: u8, comment: String, tx_hash: Bytes);

    fn find_agents(env: Env, capability: Bytes, max_price: i128, limit: u32) -> Vec<AgentInfo>;

    fn get_agent(env: Env, agent_id: u64) -> AgentInfo;
}
```

```rust
struct AgentInfo {
    id: u64,
    owner: Address,
    endpoint: String,
    capabilities: Vec<Bytes>,
    price: i128,
    reputation_score: u32, // 0–100
    rating_count: u32,
    is_active: bool,
}
```

Deploy with Soroban CLI (`stellar contract deploy`, testnet).

### Option B: Off-chain MVP

JSON on GitHub/IPFS or a small REST service—fast to ship; say you’d harden with Soroban for production.

---

## B.6 Component 2 — Task parser (workflow DAG)

Input: natural language or structured goal. Output: validated **workflow** whose step **capabilities** exist in the registry.

**Types (illustrative):**

```typescript
interface Workflow {
  steps: Step[];
  dependencies: { step_id: string; depends_on: string[] }[];
}

interface Step {
  id: string;
  capability: string; // e.g. web_search, summarize, swap_tokens
  input: Record<string, unknown>;
  output_key: string;
}
```

**Parser flow:**

1. SLM (or templates for MVP) emits JSON matching the schema.  
2. Validate DAG: no cycles, dependencies reference real `step.id` values.  
3. **Validate capabilities** against registry (or a known capability union for mock demos).  
4. Substitute placeholders in later steps (`{{output_key}}`) after each step completes.

**Prompting pattern:** give the model the **list of available capabilities** and require `dependencies` only where outputs feed forward.

---

## B.7 Component 3 — Router (agent selection)

For each step, fetch candidates: `findAgents(capability, maxPrice)` then rank.

**Example score** (tune weights):

```text
score = w1 * (1 - price/maxPrice) + w2 * (reputation/100) + w3 * (1 / latency)
```

```typescript
async function selectAgent(capability: string, userBudget: number): Promise<Agent> {
  const agents = await registry.findAgents(capability, userBudget);
  if (agents.length === 0) throw new Error(`No agent available for ${capability}`);
  agents.sort((a, b) => scoreFn(b) - scoreFn(a));
  return agents[0];
}
```

**Cache** registry reads (e.g. 30s) to avoid hammering chain/API.  
**Fallback:** on failure, try the **next** best agent from the sorted list.

---

## B.8 Component 4 — Payment & escrow patterns

Two common models:

**Model A (recommended for demos):** User **pre-pays** orchestrator (or per workflow). Orchestrator spends from **its** wallet via x402 to each provider. Unused budget returned or tracked transparently.

**Model B:** User signs **each** provider payment—flexible but poor UX for multi-step flows.

**Escrow direction:** Use a **contract account** with allowlists and per-tx / daily limits; or a dedicated Stellar account + policy in code. Full “pay only after verifiable success” may need **custom Soroban** logic—document what you guarantee vs accept as hackathon risk.

---

## B.9 Component 5 — Executor (calling sub-agents)

Typical x402 client loop for the orchestrator’s wallet:

1. Merge prior step outputs into `input` (resolve `{{placeholders}}`).  
2. `POST` to agent endpoint **without** payment → expect **402** + requirements.  
3. Build authorization (`@x402/stellar` / `ExactStellarScheme` pattern).  
4. Retry with `X-Payment-Authorization` (or your stack’s header convention).  
5. Parse JSON result → store under `output_key`.  
6. Record **payment tx hash** on the step row for demo / judges.

```typescript
async function callAgent(agent: Agent, input: unknown, orchestratorWallet: StellarWallet) {
  let res = await fetch(agent.endpoint, { method: "POST", body: JSON.stringify(input) });
  if (res.status !== 402) throw new Error(`Unexpected response: ${res.status}`);
  const paymentReq = await res.json();
  const scheme = new ExactStellarScheme({
    network: "stellar:testnet",
    tokenAddress: paymentReq.token,
    destinationAddress: paymentReq.destination,
    amount: paymentReq.amount,
  });
  const auth = await scheme.createAuthorization({ signer: orchestratorWallet });
  res = await fetch(agent.endpoint, {
    method: "POST",
    headers: { "X-Payment-Authorization": auth },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Agent failed: ${res.status}`);
  return res.json();
}
```

Use a unique **`request_id`** / idempotency key where providers support it to avoid duplicate paid work.

---

## B.10 Component 6 — State & persistence

**Minimal schema:**

```sql
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT, -- pending, running, completed, failed
  workflow_json TEXT,
  created_at INTEGER
);

CREATE TABLE step_results (
  workflow_id TEXT,
  step_id TEXT,
  output TEXT,
  status TEXT,
  error TEXT,
  agent_id TEXT,
  payment_tx_hash TEXT,
  completed_at INTEGER
);
```

In-memory is fine if you label it demo-only; SQLite or a hosted DB shows production intent. **Resume:** reload `running` workflows and skip steps that already `completed`.

---

## B.11 Component 7 — Errors, retries, compensation

| Situation | Policy |
|-----------|--------|
| Network / 5xx | Retry with **exponential backoff** (cap at 3 attempts) |
| 400 / bad input | Fail step; surface to user |
| 402 / insufficient orchestrator balance | Fail fast with clear budget message |
| Provider timeout | Retry then **fallback** to next registry candidate |

**Compensation:** x402 payments are typically **final**—prefer designs that minimize pay-then-fail (e.g. cheap validation step, reputation, idempotency). Call out honestly in README.

---

## B.12 Example — multi-agent yield workflow

**User:** “Find the highest USDC APY on Stellar testnet context and describe the move.”

**Planned steps:**

1. `get_yields` — paid market-data agent  
2. `select_best` — **internal** (no payment): pick max APY  
3. `swap_if_needed` — optional paid swap agent  
4. `deposit` — paid yield agent (or simulated on testnet)  
5. `summarize` — paid summarization agent  

**Trace narrative:** registry lookup per capability → router picks price/reputation → executor pays via x402 → final narrative + **hashes** for judges.

---

## B.13 Stellar — advanced angles (optional)

- **Contract-account escrow** — programmatic release tied to proof (stretch goal).  
- **MPP sessions** — many calls to the same provider: reduce per-request overhead.  
- **Sponsorship** — onboard provider agents without XLM friction.  
- **Reputation asset** — separate Soroban token or scores in the registry contract.

---

## B.14 MCP — orchestrator tool surface

For SDK mechanics, transports, x402-in-tool patterns, Inspector, and `mcp.json`, see **Part C**. Here we only specify the **orchestrator** contract.

Expose one high-level tool:

```typescript
{
  name: "run_workflow",
  description:
    "Execute a multi-step task: discover agents, pay via x402 on Stellar, return aggregated results.",
  inputSchema: {
    type: "object",
    properties: {
      task: { type: "string", description: "Natural language goal" },
      max_budget: { type: "number", description: "Max USDC for sub-agent calls (optional)" },
    },
    required: ["task"],
  },
}
```

**Handler outline:** parse → validate → budget check → topological execution of DAG → return final text + structured trace (step ids, agents, optional tx hashes).

Orchestrator **fee:** e.g. small fixed + % of provider spend—document in README.

---

## B.15 Hackathon submission checklist (orchestrator + providers)

**Repository:** source, README, env examples, license.

**Demo video (2–3 min):** complex task → **registry** visible → **at least one** x402 payment **orchestrator → provider** on Stellar testnet → final output.

**On-chain proof:** explorer link(s) for real testnet activity.

**Judges care about:** real x402/Stellar usage, **non-trivial** routing (not a single hardcoded URL), error handling story, clear user value.

**If you only ship a provider agent:** emphasize MCP + x402 + registry metadata so an orchestrator could discover you later.

---

## B.16 Roadmap & resources (orchestration)

### Five-day sketch

| Day | Focus |
|-----|--------|
| **1** | TypeScript MCP server + `run_workflow` stub; orchestrator testnet wallet |
| **2** | Registry (Soroban or JSON) + client; 2–3 mock providers |
| **3** | Parser (SLM or templates) + router + x402 executor; one-step e2e |
| **4** | State store, retries, fallbacks, multi-step DAG |
| **5** | README, video, deploy registry if on-chain, submit (e.g. DoraHacks) |

### Essential links

- [x402 on Stellar](https://developers.stellar.org/docs/build/agentic-payments/x402)  
- [x402 Quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide)  
- [MPP on Stellar](https://developers.stellar.org/docs/build/agentic-payments/mpp)  
- [Contract accounts](https://developers.stellar.org/docs/build/guides/contract-accounts)  
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)  
- [stellar/x402-stellar](https://github.com/stellar/x402-stellar)  
- [x402-mcp-stellar](https://github.com/jamesbachini/x402-mcp-stellar) (example MCP)  
- [Soroban registry example](https://github.com/stellar/soroban-examples/tree/main/registry)  
- [Stellar Dev Skills](https://github.com/stellar/stellar-dev-skill) · [OpenZeppelin Skills](https://github.com/OpenZeppelin/openzeppelin-skills)  

**Community:** Stellar Dev Discord (#agentic-payments, #soroban), Stellar Hacks Telegram.

---

# Part C: MCP tools for specialized AI agents

## C.1 Introduction — why MCP matters for Stellar Hacks: Agents

The **Model Context Protocol (MCP)** is an open standard for connecting assistants (Claude Code, Cursor, Windsurf, etc.) to **tools** and **data** over a simple transport. For hackathon submissions, MCP is the fastest way for judges to **discover**, **invoke**, and **pay** for your agent without a custom UI.

**Why prioritize MCP in your repo:**

- Judges can attach your server in one `mcp.json` block and call tools immediately.
- Tools return **structured, typed** arguments (validated before your handler runs).
- You can demonstrate **x402 on Stellar** inside normal tool flows (see **C.5**).
- Official patterns and examples exist (`@modelcontextprotocol/sdk`, Stellar x402 docs, community MCP servers such as `x402-mcp-stellar`).

This part complements **Part A** (which model does the planning) and **Part B** (orchestration and registry). **Part C** is the **implementation surface**: how to ship production-shaped MCP tools that wrap x402-paid APIs.

---

## C.2 MCP architecture at a glance

```text
┌──────────────────────────────┐
│   MCP client (IDE assistant) │
└──────────────┬───────────────┘
               │  stdio (local) or SSE (remote)
               ▼
┌──────────────────────────────┐
│        MCP server            │
│  Tools · Resources · Prompts │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│  APIs, Horizon, facilitators │
└──────────────────────────────┘
```

| Primitive | Purpose | Hackathon focus |
|-----------|---------|-----------------|
| **Tools** | Callable functions with JSON args | Primary: search, pay, balance, workflow |
| **Resources** | Readable URIs (`balance://…`) | Optional: session balance, config |
| **Prompts** | Reusable prompt templates | Optional: “explain this tx” |
| **Sampling** | Server-initiated LLM calls | Advanced; skip for most demos |

**Transports:** use **stdio** for local MCP (Claude Code, Cursor). SSE is for hosted servers later.

---

## C.3 TypeScript server with `@modelcontextprotocol/sdk`

**Prerequisites:** Node.js 20+, TypeScript 5+, `zod`, `@modelcontextprotocol/sdk`.

The current TypeScript SDK exposes **`McpServer`** and **`registerTool`** (name, metadata + Zod `inputSchema`, handler). This matches how this repository’s `x402-web-search-mcp` registers tools:

```typescript
#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'my-stellar-agent',
  version: '1.0.0',
});

server.registerTool(
  'ping',
  {
    description: 'Health check; returns pong.',
    inputSchema: z.object({}),
  },
  async () => ({
    content: [{ type: 'text' as const, text: 'pong' }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Build and run:** `npm run build` then `node dist/index.js`. Point your IDE MCP config at that entry file (see **C.13**).

**Logging:** use `console.error` (or a logger) for diagnostics so **stdout** stays clean for the MCP JSON-RPC stream.

---

## C.4 Tool definitions — schemas, handlers, responses

### Input schema (Zod)

Zod objects map to JSON Schema for the client. Prefer **`.describe()`** on every field so the model knows how to fill arguments.

```typescript
const WebSearchSchema = z.object({
  query: z.string().min(1).describe('Search query'),
  country: z.string().optional().describe("Two-letter country code, e.g. 'US'"),
  count: z.number().int().min(1).max(20).default(10).describe('Number of results'),
});
```

### Handler return shape

Return **`content`** as an array of parts. Most tools only need `{ type: 'text', text: '...' }`. Use **markdown** in `text` for readable results (headings, lists, links).

```typescript
return {
  content: [
    {
      type: 'text' as const,
      text: `## Results for “${query}”\n\n` + lines.join('\n\n'),
    },
  ],
};
```

### Errors

For expected failures (payment required, validation upstream, HTTP errors), return **`isError: true`** with a clear message instead of throwing—so the client surfaces a tool error, not a crashed server.

---

## C.5 x402 inside MCP tools (no HTTP 402 round-trip in the protocol)

MCP tool calls are **single request/response**. The browser pattern “GET → 402 → pay → retry” still applies **logically**, but you implement it as one of these **server-side patterns**:

### Pattern A — Payment payload on the tool (recommended for demos)

**First call:** handler returns `isError: true` plus serialized **payment requirements** (what the wallet must satisfy). **Second call:** same tool, plus `paymentAuthorization` (or your stack’s field) carrying the signed / facilitator-verified payload.

This repo’s `web_search` tool follows this shape: omit `paymentAuthorization` → receive instructions + `PaymentRequired` JSON; retry with authorization → search runs.

**Pros:** One tool name; minimal state; easy to demonstrate in Claude/Cursor.  
**Cons:** The model must learn the two-step dance (document it in `SKILL.md` and tool descriptions).

### Pattern B — Prepaid session credits

Separate tools such as `deposit_credits` / `search_balance` / `web_search` with an in-memory `Map` keyed by **session id** or **user public key** (see **C.12** for session caveats).

**Pros:** Matches “wallet tops up once” UX.  
**Cons:** You must define how deposits are verified (facilitator, server trust boundary).

### Pattern C — Dedicated “pay” MCP tool

A tool only builds or verifies payments; other tools assume a prior successful pay record. Good when your facilitator exposes a clean verify API.

**Security:** never log **private keys** or full raw signatures; log tool names, amounts, and tx hashes only.

---

## C.6 Stellar-flavored MCP tools

These patterns pair well with **Horizon** (testnet: `https://horizon-testnet.stellar.org`) and USDC on Stellar.

### Balance snapshot

Resolve the account, then filter `balances` for **native** vs **credit_alphanum4** / **credit_alphanum12**. Match **asset code** (e.g. `USDC`) and **issuer** your deployment uses—USDC is not implicit on “`asset_code === 'USDC'`” alone on public networks.

### Transaction status

`GET /transactions/{hash}` via the SDK’s builder. Handle **404** as “not found or not yet ingested”; suggest retry for recent submits.

### x402 client loop *from* a tool

If a tool calls an **external** x402 HTTP API: `fetch` → if `402`, parse requirements → build authorization with your stack (`@x402/stellar`, facilitator) → retry with the payment header your service expects → return body to the model as markdown or JSON text.

Keep **idempotency** keys in tool args when the downstream API supports them (**B.8**, **B.9**).

---

## C.7 Advanced patterns (optional)

### Orchestrator-shaped tool

**Part B**’s `run_workflow` is the right abstraction: one MCP tool that parses a goal, runs an internal DAG, and returns a trace (step ids, agents, tx hashes). Implement orchestration with **ordinary TypeScript functions** shared with your HTTP API—do not try to “call MCP from MCP” recursively.

### Resources for live session state

Expose `balance://session` or `config://network` so curious clients can read small state blobs. Keep resources **small** and non-secret.

### Prompt templates

Register **prompts** for repetitive judge flows (“Summarize this Stellar transaction hash …”) so the IDE can offer them in the prompt picker.

---

## C.8 Errors, UX, and long-running work

| Situation | What to return |
|-----------|----------------|
| Bad args | Zod failing before handler is ideal; otherwise `isError` + exact constraint |
| Insufficient prepay balance | `isError` + “call X tool first” |
| Upstream timeout | `isError` + retry suggestion |
| x402 verify failed | `isError` + check network / token / facilitator |

MCP is **one shot** per call: for work > ~30s, split into **start_job** + **get_job_status** tools.

---

## C.9 Security notes

- **Secrets** live in env vars referenced from `mcp.json`, not in tool args.
- **Rate limit** per process key (`publicKey` + tool name) if you expose expensive APIs.
- **Sanitize** string inputs: cap length, strip control characters; never pass user text to a shell. If you expose regex-powered filters, build them safely (no unbounded user-supplied regex).
- **Authorization:** sensitive tools can require a server-side allowlist or API key checked from env.

---

## C.10 Testing

**MCP Inspector:** `npx @modelcontextprotocol/inspector node dist/index.js` — exercise tools interactively.

**Unit tests:** construct the server (or individual handlers) and assert JSON shapes; mock Brave, Horizon, and facilitator clients.

**Integration:** a dedicated testnet wallet, small USDC, and one real end-to-end tool call makes a compelling README screenshot + video anchor.

---

## C.11 Example tool trio (web search + credits)

Conceptual sketch combining **Pattern B** credits with Brave-like search (adapt to your clients):

```typescript
const COST = 0.001;
const credits = new Map<string, number>();

function creditKey(extra: { sessionId?: string }, pubkey?: string) {
  return pubkey ?? extra.sessionId ?? 'anonymous';
}

// deposit_credits: verify payment off-chain, then credits.set(key, += amount)
// search_balance: return credits.get(key) ?? 0
// web_search: if balance < COST → isError; else decrement and run search; refund on failure
```

Cross-link prepaid maps with a **stable key** (see **C.12**).

---

## C.12 Troubleshooting

| Symptom | Likely cause | Mitigation |
|--------|----------------|------------|
| Tool not listed | Wrong entry path / not built | Absolute path in `mcp.json`; run build |
| Silent hang | `console.log` on stdout | Log to stderr only |
| “Balance” resets | New MCP session each launch | Key credits by **Stellar public key** from args or env |
| Invalid x402 payload | Wrong network / issuer | Pin `stellar:testnet` + USDC issuer in docs |
| Timeouts | Slow upstream | Split tool; increase client timeout in IDE if available |

---

## C.13 Deploying — Claude Code, Cursor

**Claude Code** (`~/.claude/mcp.json` on macOS/Linux):

```json
{
  "mcpServers": {
    "stellar-agent": {
      "command": "node",
      "args": ["/absolute/path/to/your-server/dist/index.js"],
      "env": {
        "STELLAR_NETWORK": "testnet",
        "STELLAR_PRIVATE_KEY": "S...",
        "BRAVE_API_KEY": "..."
      }
    }
  }
}
```

**Cursor:** project `.cursor/mcp.json` (or workspace settings) with the same `command` / `args` / `env` shape.

After editing, restart the editor MCP connection; list tools from the MCP panel.

---

## C.14 Submission checklist (MCP + x402)

Cross-check with **B.15** for orchestration—this list is **MCP-specific**:

- [ ] **MCP server** with ≥1 tool that exercises **real** (or honestly mocked) x402 verification you can explain.
- [ ] **README:** setup, env vars, `npm install && npm run build`, sample `mcp.json`, and a **two-step** payment example if you use Pattern A.
- [ ] **`SKILL.md`** (or equivalent) describing tool names, arguments, and the payment flow for assistant products.
- [ ] **Demo (2–3 min):** IDE calling the tool, payment visible, Stellar testnet hash or facilitator receipt where applicable.
- [ ] **Inspector or test** proving tools register and return structured errors for missing payment.

---

## C.15 Quick reference — minimal tool skeleton

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'my-agent', version: '1.0.0' });

server.registerTool(
  'my_tool',
  {
    description: 'One clear sentence on what it does and what it costs.',
    inputSchema: z.object({
      param: z.string().describe('Purpose of param'),
    }),
  },
  async (args) => ({
    content: [{ type: 'text' as const, text: `Result for ${args.param}` }],
  }),
);

async function main() {
  await server.connect(new StdioServerTransport());
}
main().catch(console.error);
```

---

## Appendix C — Provider agent building blocks

Every **specialized provider** should align with:

```text
┌─────────────────────────────────────────┐
│            Specialized provider         │
├─────────────────────────────────────────┤
│ Wallet / signer  │ x402 server handler │
│ Domain logic     │ MCP tool(s)         │
│ Rate limits      │ Registry registration│
└─────────────────────────────────────────┘
```

**As provider (x402 server):** return 402 + requirements unsigned; verify auth via facilitator; do work.

**As consumer (orchestrator):** 402 → `createAuthorization` → retry with header.

**Security:** budgets, allowlists, nonce/idempotency, balance checks—see orchestrator sections above.

---

## Appendix D — Example provider recipes (short)

| Agent | Capability tag | Idea |
|-------|------------------|------|
| **Market data** | `get_price` | Price + volume JSON; cache 10s |
| **Web scrape** | `fetch_page` | URL → markdown/JSON; higher price |
| **Web search** | `web_search` | Brave/etc.; MCP tool; classic demo |
| **DeFi monitor** | `get_yields` | Poll protocols; MPP session if high frequency |
| **Reputation** | `get_reputation` / `submit_rating` | Ratings with payment proof |

These are **registered endpoints** the orchestrator discovers—they are not a substitute for the DAG planner in Part B.

---

## Final instructions

Use **Part A** to pick and run **models** (SLM-first, constrained, measurable CPS). Use **Part B** to build either a **provider** specialized agent, an **orchestrator** MCP server, or **both**. Use **Part C** to implement the **MCP tool surface** (schemas, x402 patterns, testing, IDE config) so judges can run your agent from Claude Code or Cursor. Show **real Stellar testnet** x402 flow in your demo; make discovery and routing **legible** to judges; open-source your repo.

Submit before **April 13, 2026** on DoraHacks (or your track’s platform).

Good luck.
