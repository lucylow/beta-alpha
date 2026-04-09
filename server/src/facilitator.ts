/**
 * Optional HTTP calls to an x402 facilitator (verify / settle).
 * The AgentPay server primarily verifies native Stellar payments via Horizon;
 * when `AGENTPAY_X402_USDC` is enabled, `@x402/core` uses this client internally.
 */

export type FacilitatorVerifyResult = {
  ok: boolean;
  settlementTxHash?: string;
  raw?: unknown;
};

export class StellarFacilitatorClient {
  constructor(private readonly baseUrl: string) {}

  /** Generic facilitator POST — paths vary by deployment; used for diagnostics. */
  async post(path: string, body: unknown): Promise<{ status: number; json: unknown }> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, json };
  }
}
