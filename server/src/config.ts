import "dotenv/config";

/** Stellar testnet public Horizon; override for custom infra. */
export const HORIZON_URL = process.env.HORIZON_URL ?? "https://horizon-testnet.stellar.org";

/** Soroban RPC for simulation / future contract calls from backend. */
export const SOROBAN_RPC_URL =
  process.env.SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";

/** Merchant / service destination for native XLM demo micropayments. */
export const PAYMENT_DESTINATION = process.env.PAYMENT_DESTINATION ?? "";

/** Merchant secret for x402 `exact` scheme pay-to keypair (optional). */
export const STELLAR_SECRET_KEY = process.env.STELLAR_SECRET_KEY ?? "";

/** x402 network id used by @x402/stellar (`stellar:testnet` | `stellar:pubnet`). */
export const STELLAR_NETWORK_X402 =
  (process.env.STELLAR_NETWORK_X402 as "stellar:testnet" | "stellar:pubnet") || "stellar:testnet";

/** When set with STELLAR_SECRET_KEY, paid routes can emit facilitator-backed USDC requirements. */
export const AGENTPAY_X402_USDC =
  process.env.AGENTPAY_X402_USDC === "1" || process.env.AGENTPAY_X402_USDC === "true";

/** Facilitator URL (x402 HTTP facilitator). */
export const X402_FACILITATOR_URL =
  process.env.X402_FACILITATOR_URL ?? "https://www.x402.org/facilitator";

/** If false, x402 PaymentPayload verification skips facilitator (local only). */
export const AGENTPAY_CONFIRM_X402 =
  process.env.AGENTPAY_CONFIRM_X402 !== "0" && process.env.AGENTPAY_CONFIRM_X402 !== "false";

/** Brave Search API token for /api/search when not in fallback mode. */
export const BRAVE_API_KEY = process.env.BRAVE_API_KEY ?? "";

/** Price per premium query in stroops (1 XLM = 10_000_000 stroops). */
export const QUERY_PRICE_STROOPS = BigInt(process.env.QUERY_PRICE_STROOPS ?? "100000");

/** Per-service native XLM prices (micropayment demo); USDC amounts in `x402.ts` are labels for judges. */
export const PRICE_MARKET_STROOPS = BigInt(process.env.PRICE_MARKET_STROOPS ?? "500000");
export const PRICE_SUMMARIZE_STROOPS = BigInt(process.env.PRICE_SUMMARIZE_STROOPS ?? "200000");
export const PRICE_NEWS_STROOPS = BigInt(process.env.PRICE_NEWS_STROOPS ?? "300000");

/** Base + per-unit pricing for /api/compute (dynamic micropayment demo). */
export const PRICE_COMPUTE_BASE_STROOPS = BigInt(process.env.PRICE_COMPUTE_BASE_STROOPS ?? "200000");
export const PRICE_COMPUTE_PER_UNIT_STROOPS = BigInt(
  process.env.PRICE_COMPUTE_PER_UNIT_STROOPS ?? "50000",
);

/** Deployed AgentPay contract id (C...), optional for registry reads. */
export const CONTRACT_ID = process.env.CONTRACT_ID ?? "";

/** When true, payment verification accepts well-formed mock proofs (local demo). */
export const DEMO_SIMULATED = process.env.DEMO_SIMULATED === "1" || process.env.DEMO_SIMULATED === "true";

export const NETWORK_PASSPHRASE =
  process.env.NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015";
