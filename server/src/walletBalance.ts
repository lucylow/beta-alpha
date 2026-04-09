import { Horizon, StrKey } from "@stellar/stellar-sdk";
import { DEMO_SIMULATED, HORIZON_URL } from "./config.js";

export type WalletBalanceResponse = {
  address: string;
  network: string;
  nativeXlm: string;
  /** First classic `USDC` trustline on the account (testnet agents often hold Circle USDC here). */
  usdc?: { balance: string; assetIssuer: string };
  /** Rough budget hint at 0.001 USDC per paid search when `usdc` is present. */
  estimatedSearchesAt001Usdc?: number;
  mock?: boolean;
  error?: string;
};

/** Native XLM balance for a public key (testnet by default). */
export async function fetchNativeBalance(address: string): Promise<WalletBalanceResponse> {
  const trimmed = address.trim();
  if (!StrKey.isValidEd25519PublicKey(trimmed)) {
    return {
      address: trimmed,
      network: HORIZON_URL.includes("testnet") ? "stellar:testnet" : "stellar:pubnet",
      nativeXlm: "0",
      error: "invalid_public_key",
    };
  }

  if (DEMO_SIMULATED && trimmed.startsWith("GMOCK")) {
    return {
      address: trimmed,
      network: "stellar:testnet",
      nativeXlm: "1000.0000000",
      usdc: { balance: "4.9970000", assetIssuer: "mock" },
      estimatedSearchesAt001Usdc: 4997,
      mock: true,
    };
  }

  const server = new Horizon.Server(HORIZON_URL, { allowHttp: HORIZON_URL.startsWith("http://") });
  try {
    const account = await server.loadAccount(trimmed);
    const native = account.balances.find((b) => b.asset_type === "native");
    const nativeXlm = native && "balance" in native ? native.balance : "0";
    const usdcLine = account.balances.find(
      (b) => b.asset_type !== "native" && "asset_code" in b && b.asset_code === "USDC",
    );
    const usdc =
      usdcLine && "balance" in usdcLine && "asset_issuer" in usdcLine
        ? { balance: usdcLine.balance, assetIssuer: String(usdcLine.asset_issuer) }
        : undefined;
    const estimatedSearchesAt001Usdc =
      usdc != null ? Math.max(0, Math.floor(Number(usdc.balance) / 0.001)) : undefined;
    return {
      address: trimmed,
      network: HORIZON_URL.includes("testnet") ? "stellar:testnet" : "stellar:pubnet",
      nativeXlm,
      ...(usdc ? { usdc, estimatedSearchesAt001Usdc } : {}),
    };
  } catch {
    return {
      address: trimmed,
      network: HORIZON_URL.includes("testnet") ? "stellar:testnet" : "stellar:pubnet",
      nativeXlm: "0",
      error: "account_not_found_or_horizon_error",
    };
  }
}
