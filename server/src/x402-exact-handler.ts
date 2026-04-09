import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import type {
  Network,
  PaymentPayload,
  PaymentRequired,
  PaymentRequirements,
  ResourceInfo,
} from "@x402/core/types";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import {
  AGENTPAY_CONFIRM_X402,
  STELLAR_NETWORK_X402,
  X402_FACILITATOR_URL,
} from "./config.js";

const SEARCH_PRICE_USDC = "0.001";

function createFacilitatorClient(): HTTPFacilitatorClient {
  return new HTTPFacilitatorClient({ url: X402_FACILITATOR_URL });
}

/** USDC `exact` x402 flow (facilitator-backed), aligned with `x402-web-search-mcp`. */
export class X402ExactHandler {
  private readonly resourceServer: x402ResourceServer;
  private initialized = false;
  private readonly network: Network;

  constructor(
    private readonly merchantWallet: string,
    network: string,
  ) {
    this.network = network as Network;
    const facilitator = createFacilitatorClient();
    this.resourceServer = new x402ResourceServer(facilitator);
    this.resourceServer.register(this.network, new ExactStellarScheme());
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await this.resourceServer.initialize();
    this.initialized = true;
  }

  private resourceConfig() {
    return {
      scheme: "exact" as const,
      payTo: this.merchantWallet,
      price: `$${SEARCH_PRICE_USDC}` as const,
      network: this.network,
      maxTimeoutSeconds: 600,
    };
  }

  async buildPaymentRequired(resource: ResourceInfo): Promise<PaymentRequired> {
    await this.ensureInitialized();
    const requirements = await this.resourceServer.buildPaymentRequirements(this.resourceConfig());
    return this.resourceServer.createPaymentRequiredResponse(requirements, resource);
  }

  async getPaymentRequirements(): Promise<PaymentRequirements[]> {
    await this.ensureInitialized();
    return this.resourceServer.buildPaymentRequirements(this.resourceConfig());
  }

  async verifyPaymentPayload(paymentJson: string): Promise<boolean> {
    if (!AGENTPAY_CONFIRM_X402) {
      return true;
    }

    await this.ensureInitialized();
    let payload: PaymentPayload;
    try {
      payload = JSON.parse(paymentJson) as PaymentPayload;
    } catch {
      return false;
    }

    const requirements = await this.resourceServer.buildPaymentRequirements(this.resourceConfig());
    const matched =
      this.resourceServer.findMatchingRequirements(requirements, payload) ?? payload.accepted;

    if (!matched) {
      return false;
    }

    const result = await this.resourceServer.verifyPayment(payload, matched);
    return result.isValid === true;
  }
}

export function defaultStellarNetwork(): "stellar:testnet" | "stellar:pubnet" {
  return STELLAR_NETWORK_X402;
}
