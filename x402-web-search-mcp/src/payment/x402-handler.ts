import { x402ResourceServer } from '@x402/core/server';
import type {
  Network,
  PaymentPayload,
  PaymentRequired,
  PaymentRequirements,
  ResourceInfo,
} from '@x402/core/types';
import { ExactStellarScheme } from '@x402/stellar/exact/server';
import { SEARCH_PRICE_USDC } from '../config/constants.js';
import { env } from '../config/env.js';
import { createFacilitatorClient } from './facilitator.js';
import { logger } from '../utils/logger.js';

const WEB_SEARCH_RESOURCE: ResourceInfo = {
  url: 'mcp://x402-web-search-mcp/web_search',
  description: 'Paid Brave web search query',
  mimeType: 'text/plain',
};

export class X402PaymentHandler {
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
      scheme: 'exact' as const,
      payTo: this.merchantWallet,
      price: `$${SEARCH_PRICE_USDC}` as const,
      network: this.network,
      maxTimeoutSeconds: 600,
    };
  }

  /** Full x402 payment required payload (v2) for clients to satisfy. */
  async buildPaymentRequired(): Promise<PaymentRequired> {
    await this.ensureInitialized();
    const requirements = await this.resourceServer.buildPaymentRequirements(
      this.resourceConfig(),
    );
    return this.resourceServer.createPaymentRequiredResponse(
      requirements,
      WEB_SEARCH_RESOURCE,
    );
  }

  /** Raw payment requirements (after facilitator enrichment during initialize). */
  async getPaymentRequirements(): Promise<PaymentRequirements[]> {
    await this.ensureInitialized();
    return this.resourceServer.buildPaymentRequirements(this.resourceConfig());
  }

  /**
   * Verifies a JSON-encoded x402 `PaymentPayload` produced by an x402 client after payment.
   */
  async verifyPaymentPayload(paymentJson: string): Promise<boolean> {
    if (!env.CONFIRM_PAYMENTS) {
      logger.warn('CONFIRM_PAYMENTS=false: skipping facilitator verification');
      return true;
    }

    await this.ensureInitialized();
    let payload: PaymentPayload;
    try {
      payload = JSON.parse(paymentJson) as PaymentPayload;
    } catch {
      return false;
    }

    const requirements = await this.resourceServer.buildPaymentRequirements(
      this.resourceConfig(),
    );
    const matched =
      this.resourceServer.findMatchingRequirements(requirements, payload) ??
      payload.accepted;

    if (!matched) {
      logger.warn('No matching payment requirements for payload');
      return false;
    }

    const result = await this.resourceServer.verifyPayment(payload, matched);
    if (!result.isValid) {
      logger.warn('Facilitator rejected payment', result.invalidReason ?? '');
    }
    return result.isValid === true;
  }
}
