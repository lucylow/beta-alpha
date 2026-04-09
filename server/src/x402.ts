import { getUsdcAddress } from "@x402/stellar";
import {
  DEMO_SIMULATED,
  PAYMENT_DESTINATION,
  PRICE_COMPUTE_BASE_STROOPS,
  PRICE_COMPUTE_PER_UNIT_STROOPS,
  PRICE_MARKET_STROOPS,
  PRICE_NEWS_STROOPS,
  PRICE_SUMMARIZE_STROOPS,
  QUERY_PRICE_STROOPS,
  STELLAR_NETWORK_X402,
} from "./config.js";

const X402_VERSION = "agentpay-v1";

export type PaidServiceId = "search" | "market-data" | "summarize" | "news" | "compute";

/** Native-XLM memo micropayment requirement (AgentPay / hackathon demo). */
export type PaymentRequirement = {
  scheme: "stellar-x402";
  version: string;
  network: "testnet" | "public";
  service: PaidServiceId;
  challenge_id: string;
  amount_stroops: string;
  asset: "native";
  destination: string;
  memo: string;
  horizon_hint: string;
  /** Human-readable context for judges / UI. */
  resource: string;
  /** Approximate USDC-equivalent list price for hackathon narrative (settlement is native XLM below). */
  usdc_amount: string;
  simulated?: boolean;
};

/** Hackathon / interop JSON shape (HTTP 402 body). */
export type StellarPaymentSpec = {
  type: "stellar";
  network: string;
  token: string;
  token_address: string;
  destination: string;
  amount: string;
  destination_tag: string;
  authorization_scheme: "native-memo-payment" | "soroban-auth-entry";
};

export type Spec402Body = {
  "402": "payment-required";
  payment: StellarPaymentSpec;
  agentpay: PaymentRequirement;
};

export const X402_HEADERS = {
  acceptPayment: "Accept-Payment",
  paymentProof: "X-AgentPay-Proof",
} as const;

const SERVICE_USDC_LABEL: Record<PaidServiceId, string> = {
  search: "0.001",
  "market-data": "0.005",
  summarize: "0.002",
  news: "0.003",
  compute: "dynamic",
};

const SERVICE_STROOPS: Record<PaidServiceId, bigint> = {
  search: QUERY_PRICE_STROOPS,
  "market-data": PRICE_MARKET_STROOPS,
  summarize: PRICE_SUMMARIZE_STROOPS,
  news: PRICE_NEWS_STROOPS,
  compute: PRICE_COMPUTE_BASE_STROOPS,
};

function cryptoRandomId(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function tokenAddressForNetwork(): string {
  try {
    return getUsdcAddress(STELLAR_NETWORK_X402);
  } catch {
    return "";
  }
}

export function buildPaymentRequirement(
  service: PaidServiceId,
  resource: string,
  memoPayload: string,
): PaymentRequirement {
  const challenge_id = cryptoRandomId();
  const safePayload = memoPayload.slice(0, 200);
  const memo = `AP|${service}|${challenge_id}|${encodeURIComponent(safePayload)}`;

  if (!PAYMENT_DESTINATION && !DEMO_SIMULATED) {
    throw new Error(
      "PAYMENT_DESTINATION is not configured. Set it in .env or enable DEMO_SIMULATED=1 for local-only demo.",
    );
  }

  const amount_stroops = SERVICE_STROOPS[service];

  return {
    scheme: "stellar-x402",
    version: X402_VERSION,
    network: "testnet",
    service,
    challenge_id,
    amount_stroops: amount_stroops.toString(),
    asset: "native",
    destination: PAYMENT_DESTINATION || "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    memo,
    horizon_hint: process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org",
    resource,
    usdc_amount: SERVICE_USDC_LABEL[service],
    simulated: DEMO_SIMULATED,
  };
}

export function buildSearchPaymentRequirement(query: string): PaymentRequirement {
  const q = query.trim();
  return buildPaymentRequirement("search", `/api/search?q=${encodeURIComponent(q)}`, q);
}

/** Dynamic compute units (1–500): price = base + (units-1) * per_unit stroops. */
export function buildComputePaymentRequirement(rawUnits: number): PaymentRequirement {
  const u = Math.max(1, Math.min(500, Math.floor(Number(rawUnits) || 1)));
  const amount_stroops =
    PRICE_COMPUTE_BASE_STROOPS + BigInt(u - 1) * PRICE_COMPUTE_PER_UNIT_STROOPS;
  const challenge_id = cryptoRandomId();
  const memo = `AP|compute|${challenge_id}|u=${u}`;
  if (!PAYMENT_DESTINATION && !DEMO_SIMULATED) {
    throw new Error(
      "PAYMENT_DESTINATION is not configured. Set it in .env or enable DEMO_SIMULATED=1 for local-only demo.",
    );
  }
  const usdc_amount = (0.001 * u).toFixed(4);
  return {
    scheme: "stellar-x402",
    version: X402_VERSION,
    network: "testnet",
    service: "compute",
    challenge_id,
    amount_stroops: amount_stroops.toString(),
    asset: "native",
    destination: PAYMENT_DESTINATION || "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
    memo,
    horizon_hint: process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org",
    resource: `/api/compute?units=${u}`,
    usdc_amount,
    simulated: DEMO_SIMULATED,
  };
}

/** Canonical 402 JSON for UI, MCP, and agent clients (includes legacy `agentpay` block). */
export function buildSpec402Body(req: PaymentRequirement): Spec402Body {
  const tokenAddress = tokenAddressForNetwork();
  const payment: StellarPaymentSpec = {
    type: "stellar",
    network: "testnet",
    token: "USDC",
    token_address: tokenAddress || "CDLZFC3SYJYDZT7K67XSZLHMSGVY2Z6Q6RYMXYD4QN4KGNT56V4Q2U6L",
    destination: req.destination,
    amount: req.usdc_amount,
    destination_tag: req.memo,
    authorization_scheme: "native-memo-payment",
  };

  return {
    "402": "payment-required",
    payment,
    agentpay: req,
  };
}
