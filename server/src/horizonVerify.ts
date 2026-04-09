import { Asset, Horizon, Memo, Operation, StrKey, TransactionBuilder } from "@stellar/stellar-sdk";
import {
  DEMO_SIMULATED,
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  PAYMENT_DESTINATION,
} from "./config.js";
import type { PaymentRequirement } from "./x402.js";

export type PaymentProof = {
  payer: string;
  tx_hash: string;
  challenge_id?: string;
};

type PaymentOperationRow = {
  type: "payment";
  to: string;
  asset_type: string;
  amount: string;
};

function isPaymentRow(r: { type: string }): r is PaymentOperationRow {
  return r.type === "payment";
}

/** Horizon `amount` for native XLM uses up to 7 decimal places. */
function nativeAmountToStroops(amount: string): bigint {
  const trimmed = amount.trim();
  const [whole, frac = ""] = trimmed.split(".");
  const frac7 = (frac + "0000000").slice(0, 7);
  return BigInt(whole || "0") * 10_000_000n + BigInt(frac7 || "0");
}

/** `Operation.payment` expects a lumen string, not raw stroops. */
export function stroopsToLumensAmount(stroops: bigint | string): string {
  const v = typeof stroops === "bigint" ? stroops : BigInt(stroops);
  const whole = v / 10_000_000n;
  const frac = v % 10_000_000n;
  const fracStr = frac.toString().padStart(7, "0").replace(/0+$/, "");
  return fracStr.length > 0 ? `${whole}.${fracStr}` : `${whole}`;
}

export async function verifyPaymentForChallenge(
  req: PaymentRequirement,
  proof: PaymentProof,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (DEMO_SIMULATED) {
    if (!StrKey.isValidEd25519PublicKey(proof.payer)) {
      return { ok: false, reason: "invalid_payer" };
    }
    if (!/^[a-f0-9]{64}$/.test(proof.tx_hash) && !proof.tx_hash.startsWith("demo-")) {
      return { ok: false, reason: "invalid_tx_hash_format" };
    }
    return { ok: true };
  }

  const dest = PAYMENT_DESTINATION;
  if (!dest || !StrKey.isValidEd25519PublicKey(dest)) {
    return { ok: false, reason: "server_missing_payment_destination" };
  }

  const server = new Horizon.Server(HORIZON_URL, { allowHttp: HORIZON_URL.startsWith("http://") });

  let tx;
  try {
    tx = await server.transactions().transaction(proof.tx_hash).call();
  } catch {
    return { ok: false, reason: "tx_not_found" };
  }

  if (!tx.successful) {
    return { ok: false, reason: "tx_not_successful" };
  }

  if (proof.challenge_id && req.challenge_id && proof.challenge_id !== req.challenge_id) {
    return { ok: false, reason: "challenge_mismatch" };
  }

  if (tx.source_account !== proof.payer) {
    return { ok: false, reason: "payer_mismatch" };
  }

  const memoOk =
    tx.memo_type === "text" &&
    typeof tx.memo === "string" &&
    tx.memo === req.memo;

  if (!memoOk) {
    return { ok: false, reason: "memo_mismatch" };
  }

  const ops = await server.operations().forTransaction(proof.tx_hash).call();
  let paid = 0n;
  for (const raw of ops.records) {
    if (!isPaymentRow(raw)) {
      continue;
    }
    if (raw.to !== dest) {
      continue;
    }
    if (raw.asset_type !== "native") {
      continue;
    }
    paid += nativeAmountToStroops(raw.amount);
  }

  const required = BigInt(req.amount_stroops);
  if (paid < required) {
    return { ok: false, reason: "insufficient_amount" };
  }

  return { ok: true };
}

export async function buildUnsignedPaymentTx(params: {
  source: string;
  destination: string;
  amountStroops: string;
  memo: string;
}): Promise<string> {
  const server = new Horizon.Server(HORIZON_URL, { allowHttp: HORIZON_URL.startsWith("http://") });
  const account = await server.loadAccount(params.source);
  const fee = await server.fetchBaseFee();
  const tx = new TransactionBuilder(account, {
    fee: fee.toString(),
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: params.destination,
        asset: Asset.native(),
        amount: stroopsToLumensAmount(params.amountStroops),
      }),
    )
    .addMemo(Memo.text(params.memo))
    .setTimeout(180)
    .build();
  return tx.toXDR();
}
