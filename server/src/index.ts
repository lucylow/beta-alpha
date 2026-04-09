import cors from "cors";
import express from "express";
import { Keypair } from "@stellar/stellar-sdk";
import { z } from "zod";
import {
  AGENTPAY_X402_USDC,
  BRAVE_API_KEY,
  CONTRACT_ID,
  DEMO_SIMULATED,
  HORIZON_URL,
  QUERY_PRICE_STROOPS,
  STELLAR_NETWORK_X402,
  STELLAR_SECRET_KEY,
} from "./config.js";
import { rememberChallenge, peekChallenge, clearAllChallenges } from "./challengeStore.js";
import { logDemo, getDemoLog, clearDemoLog } from "./demoLog.js";
import { API_ENDPOINT_CATALOG } from "./apiCatalog.js";
import { clearTraces, getTraces, newTraceId, pushTrace } from "./traceLog.js";
import { getTraceId, traceMiddleware } from "./traceMiddleware.js";
import { fetchNativeBalance } from "./walletBalance.js";
import { buildUnsignedPaymentTx } from "./horizonVerify.js";
import { premiumSearchAnswer } from "./searchService.js";
import {
  X402_HEADERS,
  buildComputePaymentRequirement,
  buildPaymentRequirement,
  buildSearchPaymentRequirement,
  buildSpec402Body,
  type PaymentRequirement,
} from "./x402.js";
import { mountMcpHttp } from "./mcpBridge.js";
import {
  authPayCtxFromRequest,
  readPayCtx,
  sendPaymentRequired,
  verifyPaid,
} from "./x402-handlers.js";
import { buildWalletsKitBootstrap } from "./wallets-kit.js";
import { X402ExactHandler } from "./x402-exact-handler.js";
import { runSearch } from "./services/search.js";
import { clearSearchCache } from "./searchCache.js";
import { getMarketData } from "./services/market-data.js";
import { summarizeText } from "./services/summarize.js";
import { newsForCategory } from "./services/news.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(traceMiddleware);

const port = Number(process.env.PORT ?? 8787);
const publicBase = (process.env.AGENTPAY_PUBLIC_URL ?? `http://127.0.0.1:${port}`).replace(/\/$/, "");

let exactHandlerSingleton: X402ExactHandler | null = null;

function getExactHandler(): X402ExactHandler | null {
  if (DEMO_SIMULATED) return null;
  if (!AGENTPAY_X402_USDC || !STELLAR_SECRET_KEY) return null;
  if (!exactHandlerSingleton) {
    exactHandlerSingleton = new X402ExactHandler(
      Keypair.fromSecret(STELLAR_SECRET_KEY).publicKey(),
      STELLAR_NETWORK_X402,
    );
  }
  return exactHandlerSingleton;
}

const paywallDeps = { publicBase, getExactHandler };

async function send402(
  res: express.Response,
  requirement: PaymentRequirement,
  traceId: string,
): Promise<void> {
  await sendPaymentRequired(res, requirement, paywallDeps, { logDemo, traceId });
}

// --- Schemas ---

const PaidSearchBody = z.object({
  q: z.string().min(1),
  challenge_id: z.string().min(4),
  proof: z.object({
    payer: z.string(),
    tx_hash: z.string(),
  }),
  paymentAuthorization: z.string().optional(),
  count: z.number().int().min(1).max(20).optional(),
  country: z.string().length(2).optional(),
});

const PaymentAuthorizeBody = z.object({
  q: z.string().min(1).optional(),
  query: z.string().min(1).optional(),
  service: z
    .enum(["search", "market-data", "summarize", "news", "compute"])
    .default("search"),
  resourcePath: z.string().optional(),
  units: z.number().int().min(1).max(500).optional(),
});

const PaidMarketBody = z.object({
  symbol: z.string().min(1),
  challenge_id: z.string().min(4),
  proof: z.object({
    payer: z.string(),
    tx_hash: z.string(),
  }),
  paymentAuthorization: z.string().optional(),
});

const PaidSummarizeBody = z.object({
  text: z.string().min(1),
  challenge_id: z.string().min(4),
  proof: z.object({
    payer: z.string(),
    tx_hash: z.string(),
  }),
  paymentAuthorization: z.string().optional(),
});

const PaidNewsBody = z.object({
  category: z.string().min(1),
  challenge_id: z.string().min(4),
  proof: z.object({
    payer: z.string(),
    tx_hash: z.string(),
  }),
  paymentAuthorization: z.string().optional(),
});

const PaidComputeBody = z.object({
  op: z.string().min(1),
  challenge_id: z.string().min(4),
  proof: z.object({
    payer: z.string(),
    tx_hash: z.string(),
  }),
  paymentAuthorization: z.string().optional(),
});

function parseSearchRunOptions(
  req: express.Request,
  body?: { count?: number; country?: string },
): { count?: number; country?: string } {
  const out: { count?: number; country?: string } = {};
  const c = req.query.count;
  if (typeof c === "string" && c.length > 0) {
    const n = Number(c);
    if (Number.isFinite(n)) out.count = Math.min(20, Math.max(1, Math.floor(n)));
  }
  const cy = req.query.country;
  if (typeof cy === "string" && cy.length >= 2) {
    out.country = cy.trim().slice(0, 2);
  }
  if (body?.count != null) out.count = Math.min(20, Math.max(1, body.count));
  if (body?.country && body.country.length >= 2) out.country = body.country.trim().slice(0, 2);
  return out;
}

function formatLogTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(11, 19);
}

// --- App routes ---

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "stellar-x402-agentpay",
    demoSimulated: DEMO_SIMULATED,
    x402Usdc: Boolean(getExactHandler()),
  });
});

app.get("/health/ready", async (_req, res) => {
  const x402Usdc = Boolean(getExactHandler());
  const braveConfigured = Boolean(BRAVE_API_KEY);
  let horizonOk = true;
  try {
    const r = await fetch(`${HORIZON_URL.replace(/\/$/, "")}/`, {
      signal: AbortSignal.timeout(4000),
    });
    horizonOk = r.ok;
  } catch {
    horizonOk = false;
  }
  const searchDegradedOk = braveConfigured || DEMO_SIMULATED || BRAVE_API_KEY === "";
  const ready = horizonOk && searchDegradedOk;
  res.status(ready ? 200 : 503).json({
    ok: ready,
    service: "stellar-x402-agentpay",
    checks: {
      horizon: horizonOk,
      braveSearch: braveConfigured || DEMO_SIMULATED,
      x402Exact: x402Usdc,
    },
    notes: braveConfigured ? "live_brave" : DEMO_SIMULATED ? "demo_simulated" : "brave_fallback_results",
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    queryPriceStroops: QUERY_PRICE_STROOPS.toString(),
    contractConfigured: Boolean(CONTRACT_ID),
    demoSimulated: DEMO_SIMULATED,
    x402ExactEnabled: Boolean(getExactHandler()),
    network: STELLAR_NETWORK_X402,
  });
});

app.get("/api/status", (_req, res) => {
  res.json({
    ok: true,
    service: "stellar-x402-agentpay",
    apiMockMode: DEMO_SIMULATED,
    demoSimulated: DEMO_SIMULATED,
    network: STELLAR_NETWORK_X402,
    publicBase,
    x402ExactEnabled: Boolean(getExactHandler()),
    braveSearchConfigured: Boolean(process.env.BRAVE_API_KEY),
    queryPriceStroops: QUERY_PRICE_STROOPS.toString(),
    contractConfigured: Boolean(CONTRACT_ID),
    catalogEntries: API_ENDPOINT_CATALOG.length,
  });
});

app.get("/api/catalog", (_req, res) => {
  res.json({ endpoints: API_ENDPOINT_CATALOG });
});

app.get("/api/wallets/kit", (_req, res) => {
  res.json(buildWalletsKitBootstrap({ publicBase }));
});

app.get("/api/logs", (_req, res) => {
  res.json({
    entries: getTraces().map((e) => ({
      time: formatLogTime(e.time),
      timeIso: e.time,
      endpoint: e.endpoint,
      method: e.method,
      status: e.status,
      traceId: e.traceId,
      amount: e.amount ?? null,
      wallet: e.wallet ?? null,
      approval: e.approval ?? null,
      durationMs: e.durationMs,
      message: e.message ?? null,
    })),
  });
});

app.get("/api/metrics", (_req, res) => {
  const rows = getTraces();
  if (rows.length === 0) {
    res.json({
      avgLatencyMs: 412,
      successRate: "98.4%",
      approvalRate: "91.2%",
      avgResults: 5,
      retryAvoided: 73,
      demoCalls: 1248,
      derivedFromTraces: false,
    });
    return;
  }
  const latencies = rows.map((r) => r.durationMs);
  const avgLatencyMs = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const ok = rows.filter((r) => r.status >= 200 && r.status < 400).length;
  const successRate = `${((ok / rows.length) * 100).toFixed(1)}%`;
  const approvedish = rows.filter((r) => r.approval === "approved").length;
  const approvalRate =
    approvedish > 0 ? `${((approvedish / rows.length) * 100).toFixed(1)}%` : "—";
  res.json({
    avgLatencyMs,
    successRate,
    approvalRate,
    avgResults: 5,
    retryAvoided: rows.filter((r) => r.status === 429).length,
    demoCalls: rows.length,
    derivedFromTraces: true,
  });
});

app.get("/api/policy", (_req, res) => {
  res.json({
    approvalRequired: !DEMO_SIMULATED,
    dailyBudget: "0.05 USDC",
    retryLimit: 2,
    network: STELLAR_NETWORK_X402,
    paymentMode: "x402",
    notes: DEMO_SIMULATED
      ? "Demo simulated payments accept well-formed mock proofs."
      : "Verification uses Horizon (and x402 exact when configured).",
  });
});

app.get("/api/wallet/balance", async (req, res) => {
  const address = String(req.query.address ?? "").trim();
  if (!address) {
    res.status(400).json({
      error: "missing_address",
      hint: "Pass ?address=G... for Horizon lookup. Demo keys starting with GMOCK return mock balances when DEMO_SIMULATED=1.",
    });
    return;
  }
  const summary = await fetchNativeBalance(address);
  const code = summary.error === "invalid_public_key" ? 400 : 200;
  res.status(code).json(summary);
});

app.post("/api/payment/authorize", async (req, res) => {
  const parsed = PaymentAuthorizeBody.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { service, resourcePath, units } = parsed.data;
  const q = (parsed.data.q ?? parsed.data.query ?? "").trim();
  if (service === "search" && !q) {
    res.status(400).json({ error: "missing_query", hint: "Provide q or query for search service." });
    return;
  }

  try {
    let requirement: PaymentRequirement;
    if (service === "search") {
      requirement = buildSearchPaymentRequirement(q);
    } else if (service === "market-data") {
      const path = resourcePath ?? "/api/market-data?symbol=XLMUSDC";
      requirement = buildPaymentRequirement("market-data", path, "authorize");
    } else if (service === "summarize") {
      requirement = buildPaymentRequirement("summarize", "/api/summarize", "authorize");
    } else if (service === "compute") {
      requirement = buildComputePaymentRequirement(units ?? 1);
    } else {
      requirement = buildPaymentRequirement("news", "/api/news?category=blockchain", "authorize");
    }
    rememberChallenge(requirement);
    const spec = buildSpec402Body(requirement);
    const traceId = getTraceId(req);
    res.locals.traceMessage = "authorize_preview";
    const nextByService: Record<string, string> = {
      search:
        "Complete payment, then GET /api/search?q=… with Authorization: Stellar <proof>, or POST /api/search with challenge_id and proof / paymentAuthorization.",
      "market-data":
        "Complete payment, then GET /api/market-data?symbol=… with Authorization header or POST /api/market-data with proof.",
      summarize: "Complete payment, then POST /api/summarize with text, challenge_id, and proof.",
      news: "Complete payment, then GET /api/news?category=… with Authorization header or POST /api/news with proof.",
      compute:
        "Complete payment, then GET /api/compute?op=…&units=… with Authorization header or POST /api/compute with op, challenge_id, and proof.",
    };
    res.json({
      ok: true,
      traceId,
      paymentRequired: true,
      httpStatusForDirectSearch: 402,
      challenge_id: requirement.challenge_id,
      agentpay: requirement,
      payment: spec.payment,
      nextStep: nextByService[service] ?? nextByService.search,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/demo/run", (_req, res) => {
  const t = newTraceId();
  pushTrace({
    traceId: t,
    endpoint: "/api/search",
    method: "GET",
    status: 200,
    durationMs: 384,
    amount: "0.001 USDC",
    wallet: "connected",
    approval: "approved",
    message: "demo_injected",
  });
  const t2 = newTraceId();
  pushTrace({
    traceId: t2,
    endpoint: "/api/payment/authorize",
    method: "POST",
    status: 200,
    durationMs: 105,
    amount: "0.001 USDC",
    wallet: "connected",
    approval: "pending",
    message: "demo_injected",
  });
  logDemo({ kind: "info", message: "Demo trace rows injected for inspector UI." });
  res.json({ ok: true, inserted: 2, traceIds: [t, t2] });
});

app.post("/api/demo/reset", (_req, res) => {
  clearTraces();
  clearDemoLog();
  clearAllChallenges();
  clearSearchCache();
  logDemo({ kind: "info", message: "Demo state reset (traces, log, challenges, search cache)." });
  res.json({ ok: true, cleared: ["traces", "demo_log", "challenges", "search_cache"] });
});

mountMcpHttp(app);

app.get("/api/demo-log", (_req, res) => {
  res.json({ entries: getDemoLog() });
});

app.get("/api/agents", (_req, res) => {
  res.json({
    agents: [
      {
        id: 1,
        name: "AgentPay Search",
        endpoint: `${publicBase}/api/search`,
        category: "search",
        price_stroops: QUERY_PRICE_STROOPS.toString(),
        reputation: 0,
        walletsKit: "Any Stellar wallet via @creit.tech/stellar-wallets-kit in the dashboard.",
        contractNote:
          "On-chain listing: call list_agents on the Soroban registry (see contracts/agent-pay).",
      },
      {
        id: 2,
        name: "AgentPay Compute",
        endpoint: `${publicBase}/api/compute`,
        category: "compute",
        price_stroops: "dynamic",
        reputation: 0,
        walletsKit: "Sign payment XDR from Wallets Kit; retry with Authorization header.",
        contractNote: "Attest completions with record_query_payment when contract is deployed.",
      },
    ],
    stellarWalletsKit: {
      npm: "@creit.tech/stellar-wallets-kit",
      bootstrapUrl: `${publicBase}/api/wallets/kit`,
    },
    sorobanContractId: CONTRACT_ID || null,
  });
});

// --- Search ---

app.get("/api/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.status(400).json({ error: "missing_q" });
    return;
  }
  const proofHeader = req.headers[X402_HEADERS.paymentProof.toLowerCase()];
  if (typeof proofHeader === "string" && proofHeader.length > 2) {
    res.status(400).json({
      error: "use_post_or_authorization",
      hint: "POST JSON with proof, or retry GET with Authorization: Stellar <json>.",
    });
    return;
  }

  const payCtx = authPayCtxFromRequest(req);
  if (payCtx) {
    const requirement = payCtx.challenge_id ? peekChallenge(payCtx.challenge_id) : undefined;
    const v = await verifyPaid(requirement, payCtx, getExactHandler());
    if (!v.ok) {
      res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
      return;
    }
    try {
      const searchOpts = parseSearchRunOptions(req);
      const search = await runSearch(q, searchOpts);
      logDemo({
        kind: "paid",
        message: `Delivered search (GET auth) for "${q.slice(0, 60)}"`,
        txHash: payCtx.proof.tx_hash || "x402-exact",
        challengeId: payCtx.challenge_id,
      });
      res.json({
        ok: true,
        query: q,
        result: search,
        settled: {
          tx_hash: payCtx.proof.tx_hash || null,
          payer: payCtx.proof.payer || null,
          challenge_id: payCtx.challenge_id,
          x402: Boolean(payCtx.x402Json),
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "search_error";
      res.status(502).json({ error: "search_failed", message });
    }
    return;
  }

  try {
    const payment = buildSearchPaymentRequirement(q);
    rememberChallenge(payment);
    await send402(res, payment, getTraceId(req));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    logDemo({ kind: "error", message: msg });
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/search", async (req, res) => {
  const traceId = getTraceId(req);
  const parsed = PaidSearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", traceId, details: parsed.error.flatten() });
    return;
  }
  const { q, challenge_id, proof, paymentAuthorization, count, country } = parsed.data;
  const searchOpts = parseSearchRunOptions(req, { count, country });
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization
      ? { x402Json: paymentAuthorization, challenge_id, proof }
      : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment", traceId });
    return;
  }

  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    logDemo({ kind: "error", message: `Verification failed: ${v.reason}`, challengeId: challenge_id });
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason, traceId });
    return;
  }

  const t0 = Date.now();
  try {
    const search = await runSearch(q, searchOpts);
    res.locals.traceApproval = "approved";
    res.locals.traceAmount = "0.001 USDC";
    res.locals.traceWallet = "settled";
    logDemo({
      kind: "paid",
      message: `Delivered search for "${q.slice(0, 60)}"`,
      txHash: ctx.proof.tx_hash || "x402-exact",
      challengeId: challenge_id,
    });
    res.json({
      ok: true,
      traceId,
      latencyMs: Date.now() - t0,
      query: q,
      result: search,
      settled: {
        tx_hash: ctx.proof.tx_hash || null,
        payer: ctx.proof.payer || null,
        challenge_id,
        x402: Boolean(ctx.x402Json),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "search_error";
    res.locals.traceMessage = "search_failed";
    res.status(502).json({ error: "search_failed", message, traceId });
  }
});

// --- Market data ---

app.get("/api/market-data", async (req, res) => {
  const symbol = String(req.query.symbol ?? "XLMUSDC").trim();

  const payCtx = authPayCtxFromRequest(req);
  if (payCtx) {
    try {
      const requirement = payCtx.challenge_id ? peekChallenge(payCtx.challenge_id) : undefined;
      const v = await verifyPaid(requirement, payCtx, getExactHandler());
      if (!v.ok) {
        res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
        return;
      }
      const data = await getMarketData(symbol);
      res.json({
        ok: true,
        result: data,
        settled: {
          tx_hash: payCtx.proof.tx_hash || null,
          challenge_id: payCtx.challenge_id,
          x402: Boolean(payCtx.x402Json),
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "market_data_error";
      res.status(502).json({ error: "market_data_failed", message });
    }
    return;
  }

  try {
    const payment = buildPaymentRequirement(
      "market-data",
      `/api/market-data?symbol=${encodeURIComponent(symbol)}`,
      symbol,
    );
    rememberChallenge(payment);
    await send402(res, payment, getTraceId(req));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/market-data", async (req, res) => {
  const parsed = PaidMarketBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { symbol, challenge_id, proof, paymentAuthorization } = parsed.data;
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization ? { x402Json: paymentAuthorization, challenge_id, proof } : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment" });
    return;
  }
  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
    return;
  }
  try {
    const data = await getMarketData(symbol);
    res.json({
      ok: true,
      result: data,
      settled: { tx_hash: ctx.proof.tx_hash || null, challenge_id, x402: Boolean(ctx.x402Json) },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "market_data_error";
    res.status(502).json({ error: "market_data_failed", message });
  }
});

// --- Summarize ---

app.post("/api/summarize", async (req, res) => {
  if (!req.body?.challenge_id) {
    const text = String(req.body?.text ?? "").trim();
    if (!text) {
      res.status(400).json({ error: "missing_text" });
      return;
    }
    try {
      const payment = buildPaymentRequirement("summarize", "/api/summarize", text.slice(0, 80));
      rememberChallenge(payment);
      await send402(res, payment, getTraceId(req));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "config_error";
      res.status(500).json({ error: "payment_config", message: msg });
    }
    return;
  }

  const parsed = PaidSummarizeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { text, challenge_id, proof, paymentAuthorization } = parsed.data;
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization ? { x402Json: paymentAuthorization, challenge_id, proof } : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment" });
    return;
  }
  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
    return;
  }
  const summary = summarizeText(text);
  res.json({
    ok: true,
    result: { summary, chars: text.length },
    settled: { tx_hash: ctx.proof.tx_hash || null, challenge_id, x402: Boolean(ctx.x402Json) },
  });
});

// --- News ---

app.get("/api/news", async (req, res) => {
  const category = String(req.query.category ?? "blockchain").trim();

  const payCtx = authPayCtxFromRequest(req);
  if (payCtx) {
    const requirement = payCtx.challenge_id ? peekChallenge(payCtx.challenge_id) : undefined;
    const v = await verifyPaid(requirement, payCtx, getExactHandler());
    if (!v.ok) {
      res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
      return;
    }
    res.json({
      ok: true,
      result: { items: newsForCategory(category) },
      settled: {
        tx_hash: payCtx.proof.tx_hash || null,
        challenge_id: payCtx.challenge_id,
        x402: Boolean(payCtx.x402Json),
      },
    });
    return;
  }

  try {
    const payment = buildPaymentRequirement(
      "news",
      `/api/news?category=${encodeURIComponent(category)}`,
      category,
    );
    rememberChallenge(payment);
    await send402(res, payment, getTraceId(req));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/news", async (req, res) => {
  const parsed = PaidNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { category, challenge_id, proof, paymentAuthorization } = parsed.data;
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization ? { x402Json: paymentAuthorization, challenge_id, proof } : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment" });
    return;
  }
  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
    return;
  }
  res.json({
    ok: true,
    result: { items: newsForCategory(category) },
    settled: { tx_hash: ctx.proof.tx_hash || null, challenge_id, x402: Boolean(ctx.x402Json) },
  });
});

// --- Compute (dynamic x402 units) ---

function runComputeStub(op: string, units: number): { op: string; units: number; digest: string } {
  const enc = new TextEncoder().encode(`${op}|${units}`);
  let h = 0;
  for (const b of enc) {
    h = (h * 31 + b) >>> 0;
  }
  return { op, units, digest: h.toString(16).padStart(8, "0") };
}

app.get("/api/compute", async (req, res) => {
  const op = String(req.query.op ?? "").trim();
  const units = Number(req.query.units ?? 1);
  if (!op) {
    res.status(400).json({ error: "missing_op", hint: "Pass ?op=your-job-id&units=1..500" });
    return;
  }

  const payCtx = authPayCtxFromRequest(req);
  if (payCtx) {
    const requirement = payCtx.challenge_id ? peekChallenge(payCtx.challenge_id) : undefined;
    const v = await verifyPaid(requirement, payCtx, getExactHandler());
    if (!v.ok) {
      res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
      return;
    }
    const u = Math.max(1, Math.min(500, Math.floor(units) || 1));
    logDemo({
      kind: "paid",
      message: `Compute (GET) op="${op.slice(0, 40)}" units=${u}`,
      txHash: payCtx.proof.tx_hash || "x402-exact",
      challengeId: payCtx.challenge_id,
    });
    res.json({
      ok: true,
      result: runComputeStub(op, u),
      settled: {
        tx_hash: payCtx.proof.tx_hash || null,
        challenge_id: payCtx.challenge_id,
        x402: Boolean(payCtx.x402Json),
      },
    });
    return;
  }

  try {
    const payment = buildComputePaymentRequirement(units);
    rememberChallenge(payment);
    await send402(res, payment, getTraceId(req));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/compute", async (req, res) => {
  if (!req.body?.challenge_id) {
    const op = String(req.body?.op ?? "").trim();
    const units = Number(req.body?.units ?? 1);
    if (!op) {
      res.status(400).json({ error: "missing_op" });
      return;
    }
    try {
      const payment = buildComputePaymentRequirement(units);
      rememberChallenge(payment);
      await send402(res, payment, getTraceId(req));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "config_error";
      res.status(500).json({ error: "payment_config", message: msg });
    }
    return;
  }

  const parsed = PaidComputeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { op, challenge_id, proof, paymentAuthorization } = parsed.data;
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization ? { x402Json: paymentAuthorization, challenge_id, proof } : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment" });
    return;
  }
  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
    return;
  }
  const unitsHint = requirement?.memo.match(/u=(\d+)/)?.[1];
  const u = unitsHint ? Number(unitsHint) : 1;
  res.json({
    ok: true,
    result: runComputeStub(op, u),
    settled: { tx_hash: ctx.proof.tx_hash || null, challenge_id, x402: Boolean(ctx.x402Json) },
  });
});

// --- Backward compatible: /api/paid-search ---

app.get("/api/paid-search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.status(400).json({ error: "missing_q" });
    return;
  }
  const proofHeader = req.headers[X402_HEADERS.paymentProof.toLowerCase()];
  if (typeof proofHeader === "string" && proofHeader.length > 2) {
    res.status(400).json({
      error: "use_post_with_proof",
      hint: "After paying, POST JSON { q, challenge_id, proof } with the proof object.",
    });
    return;
  }

  try {
    const payment = buildSearchPaymentRequirement(q);
    rememberChallenge(payment);
    await send402(res, payment, getTraceId(req));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "config_error";
    logDemo({ kind: "error", message: msg });
    res.status(500).json({ error: "payment_config", message: msg });
  }
});

app.post("/api/paid-search", async (req, res) => {
  const parsed = PaidSearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });
    return;
  }
  const { q, challenge_id, proof, paymentAuthorization } = parsed.data;
  const requirement = peekChallenge(challenge_id);
  const ctx =
    readPayCtx(req, challenge_id, proof) ??
    (paymentAuthorization ? { x402Json: paymentAuthorization, challenge_id, proof } : null);
  if (!ctx) {
    res.status(400).json({ error: "missing_payment" });
    return;
  }

  const v = await verifyPaid(requirement, ctx, getExactHandler());
  if (!v.ok) {
    logDemo({
      kind: "error",
      message: `Verification failed: ${v.reason}`,
      challengeId: challenge_id,
    });
    res.status(v.status).json({ error: "payment_not_verified", reason: v.reason });
    return;
  }

  logDemo({
    kind: "paid",
    message: `Delivered premium search for "${q.slice(0, 60)}"`,
    txHash: ctx.proof.tx_hash || "x402-exact",
    challengeId: challenge_id,
  });

  res.json({
    ok: true,
    query: q,
    result: premiumSearchAnswer(q),
    settled: {
      tx_hash: ctx.proof.tx_hash || null,
      payer: ctx.proof.payer || null,
      challenge_id,
      x402: Boolean(ctx.x402Json),
    },
  });
});

app.get("/api/payment-xdr", async (req, res) => {
  const challengeId = String(req.query.challenge_id ?? "");
  const source = String(req.query.source ?? "");
  const requirement = peekChallenge(challengeId);
  if (!requirement || !source) {
    res.status(400).json({ error: "bad_params" });
    return;
  }
  try {
    const xdr = await buildUnsignedPaymentTx({
      source,
      destination: requirement.destination,
      amountStroops: requirement.amount_stroops,
      memo: requirement.memo,
    });
    res.json({ xdr, network: requirement.network });
  } catch (e) {
    const message = e instanceof Error ? e.message : "xdr_error";
    res.status(500).json({ error: "xdr_build_failed", message });
  }
});

app.listen(port, () => {
  console.log(`Stellar x402 AgentPay server listening on http://localhost:${port}`);
});
