import type { Request, Response } from "express";
import type { PaymentProof } from "./horizonVerify.js";
import { verifyPaymentForChallenge } from "./horizonVerify.js";
import { logDemo, type DemoLogEntry } from "./demoLog.js";
import {
  X402_HEADERS,
  buildSpec402Body,
  type PaymentRequirement,
} from "./x402.js";
import {
  extractNativeProof,
  extractX402PaymentPayload,
  parseStellarAuthorizationHeader,
} from "./paymentAuth.js";
import type { X402ExactHandler } from "./x402-exact-handler.js";

export type PayCtx = {
  x402Json: string | null;
  challenge_id: string;
  proof: PaymentProof;
};

export type SendPaymentRequiredDeps = {
  publicBase: string;
  getExactHandler: () => X402ExactHandler | null;
};

export function readPayCtx(
  req: Request,
  bodyChallenge?: string,
  bodyProof?: PaymentProof,
): PayCtx | null {
  const fromHeader = parseStellarAuthorizationHeader(req.headers.authorization);

  if (fromHeader) {
    const x402FromAuth = extractX402PaymentPayload(fromHeader);
    if (x402FromAuth) {
      return {
        x402Json: x402FromAuth,
        challenge_id: bodyChallenge ?? "",
        proof: bodyProof ?? { payer: "", tx_hash: "" },
      };
    }
    const nativeFromAuth = extractNativeProof(fromHeader);
    if (nativeFromAuth) {
      return {
        x402Json: null,
        challenge_id: nativeFromAuth.challenge_id,
        proof: nativeFromAuth.proof,
      };
    }
  }

  if (typeof req.body?.paymentAuthorization === "string") {
    return {
      x402Json: req.body.paymentAuthorization as string,
      challenge_id: bodyChallenge ?? "",
      proof: bodyProof ?? { payer: "", tx_hash: "" },
    };
  }

  if (bodyChallenge && bodyProof) {
    return { x402Json: null, challenge_id: bodyChallenge, proof: bodyProof };
  }
  return null;
}

/** Paid retry via `Authorization: Stellar …` on GET (agent-friendly). */
export function authPayCtxFromRequest(req: Request): PayCtx | null {
  const fromHeader = parseStellarAuthorizationHeader(req.headers.authorization);
  if (!fromHeader) return null;
  const x402 = extractX402PaymentPayload(fromHeader);
  if (x402) {
    return { x402Json: x402, challenge_id: "", proof: { payer: "", tx_hash: "" } };
  }
  const native = extractNativeProof(fromHeader);
  if (native) {
    return { x402Json: null, challenge_id: native.challenge_id, proof: native.proof };
  }
  return null;
}

export async function verifyPaid(
  requirement: PaymentRequirement | undefined,
  ctx: PayCtx,
  exact: X402ExactHandler | null,
): Promise<{ ok: true } | { ok: false; reason: string; status: number }> {
  if (ctx.x402Json && exact) {
    const ok = await exact.verifyPaymentPayload(ctx.x402Json);
    return ok ? { ok: true } : { ok: false, reason: "x402_payment_not_verified", status: 402 };
  }
  if (ctx.x402Json && !exact) {
    return { ok: false, reason: "x402_exact_not_configured", status: 400 };
  }
  if (!requirement) {
    return { ok: false, reason: "unknown_or_expired_challenge", status: 400 };
  }
  const v = await verifyPaymentForChallenge(requirement, {
    payer: ctx.proof.payer,
    tx_hash: ctx.proof.tx_hash,
    challenge_id: ctx.challenge_id,
  });
  return v.ok ? { ok: true } : { ok: false, reason: v.reason, status: 402 };
}

export async function sendPaymentRequired(
  res: Response,
  requirement: PaymentRequirement,
  deps: SendPaymentRequiredDeps,
  options?: {
    logDemo?: (e: Omit<DemoLogEntry, "at" | "txHash">) => void;
    traceId?: string;
  },
): Promise<void> {
  const spec = buildSpec402Body(requirement);
  const payload: Record<string, unknown> = {
    error: "payment_required",
    documentation: "https://developers.stellar.org/",
    ...spec,
  };
  if (options?.traceId) {
    payload.traceId = options.traceId;
  }

  const loc = res as Response & { locals?: Record<string, unknown> };
  if (loc.locals) {
    loc.locals.traceAmount = `${requirement.usdc_amount} USDC`;
    loc.locals.traceApproval = "pending";
    loc.locals.traceMessage = `payment_required:${requirement.service}`;
  }

  const exact = deps.getExactHandler();
  if (exact) {
    try {
      const pr = await exact.buildPaymentRequired({
        url: `${deps.publicBase}${requirement.resource.split("?")[0]}`,
        description: `AgentPay ${requirement.service} (x402 exact / USDC)`,
        mimeType: "application/json",
      });
      payload.x402_exact = pr;
    } catch {
      /* optional; native memo path still works */
    }
  }

  (options?.logDemo ?? logDemo)({
    kind: "402",
    message: `Payment required [${requirement.service}]: ${requirement.memo.slice(0, 80)}…`,
    challengeId: requirement.challenge_id,
  });
  res
    .status(402)
    .setHeader(X402_HEADERS.acceptPayment, JSON.stringify(spec.payment))
    .json(payload);
}
