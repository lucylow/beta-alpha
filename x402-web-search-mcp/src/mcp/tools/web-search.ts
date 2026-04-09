import { z } from 'zod';
import { SEARCH_PRICE_USDC } from '../../config/constants.js';
import { env } from '../../config/env.js';
import { X402PaymentHandler } from '../../payment/x402-handler.js';
import { StellarClient } from '../../payment/stellar-client.js';
import { BraveSearchClient } from '../../search/brave-client.js';
import { formatSearchResults } from '../../search/formatter.js';

const inputSchema = z.object({
  query: z.string().min(1),
  country: z.string().optional(),
  count: z.number().int().min(1).max(20).optional(),
  paymentAuthorization: z.string().optional(),
});

export const webSearchToolName = 'web_search';

export const webSearchTool = {
  name: webSearchToolName,
  description:
    'Search the web using Brave Search. Each query costs 0.001 USDC via x402 on Stellar (see paymentAuthorization).',
  inputSchema,
  registerOn: (deps: {
    search: BraveSearchClient;
    payment: X402PaymentHandler;
  }) =>
    async (args: z.infer<typeof inputSchema>) => {
      const { query, country, count, paymentAuthorization } = args;

      if (!paymentAuthorization) {
        const paymentRequired = await deps.payment.buildPaymentRequired();
        return {
          content: [
            {
              type: 'text' as const,
              text:
                `Payment required: ${SEARCH_PRICE_USDC} USDC per search.\n` +
                `Provide paymentAuthorization as a JSON string of your x402 PaymentPayload (from your x402 client after paying).\n` +
                `PaymentRequired: ${JSON.stringify(paymentRequired, null, 2)}`,
            },
          ],
          isError: true,
        };
      }

      const ok = await deps.payment.verifyPaymentPayload(paymentAuthorization);
      if (!ok) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Invalid or unverified payment authorization.',
            },
          ],
          isError: true,
        };
      }

      try {
        const results = await deps.search.search(query, { country, count });
        const formatted = formatSearchResults(query, results);
        return { content: [{ type: 'text' as const, text: formatted }] };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text' as const, text: `Search failed: ${message}` }],
          isError: true,
        };
      }
    },
};

/** Default factory using env-configured clients (stdio server). */
export function createWebSearchHandler() {
  const search = new BraveSearchClient(env.BRAVE_API_KEY);
  const stellar = new StellarClient(env.STELLAR_NETWORK, env.STELLAR_PRIVATE_KEY);
  const payment = new X402PaymentHandler(
    stellar.getPublicKey(),
    env.STELLAR_NETWORK,
  );
  return webSearchTool.registerOn({ search, payment });
}
