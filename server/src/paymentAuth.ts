import type { PaymentProof } from "./horizonVerify.js";

/** Body shape for POST /api/paid-* routes (native memo settlement). */
export type NativePaymentBody = {
  challenge_id: string;
  proof: PaymentProof;
};

export type SearchPaidBody = NativePaymentBody & { q: string };
export type MarketPaidBody = NativePaymentBody & { symbol: string };
export type SummarizePaidBody = NativePaymentBody & { text: string };
export type NewsPaidBody = NativePaymentBody & { category: string };

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Parse `Authorization: Stellar <json | base64(json)>`. */
export function parseStellarAuthorizationHeader(
  value: string | undefined,
): Record<string, unknown> | null {
  if (!value || !value.startsWith("Stellar ")) return null;
  const token = value.slice("Stellar ".length).trim();
  const direct = tryParseJson(token);
  if (direct && typeof direct === "object") return direct as Record<string, unknown>;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const j = tryParseJson(decoded);
    if (j && typeof j === "object") return j as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const j = tryParseJson(decoded);
    if (j && typeof j === "object") return j as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return null;
}

export function extractNativeProof(
  auth: Record<string, unknown> | null,
): { challenge_id: string; proof: PaymentProof } | null {
  if (!auth) return null;
  const challenge_id = typeof auth.challenge_id === "string" ? auth.challenge_id : "";
  const proof = auth.proof as PaymentProof | undefined;
  if (!challenge_id || !proof?.payer || !proof?.tx_hash) return null;
  return { challenge_id, proof };
}

/** x402 facilitator payload string (JSON) from client after USDC settlement. */
export function extractX402PaymentPayload(auth: Record<string, unknown> | null): string | null {
  if (!auth) return null;
  if (typeof auth.paymentPayload === "string") return auth.paymentPayload;
  if (typeof auth.paymentAuthorization === "string") return auth.paymentAuthorization;
  if (auth.x402 === "payment-payload" && typeof auth.payload === "string") return auth.payload;
  return null;
}
