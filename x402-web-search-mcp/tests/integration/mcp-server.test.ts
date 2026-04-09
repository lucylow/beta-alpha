import { Keypair } from '@stellar/stellar-sdk';
import { describe, expect, it, jest } from '@jest/globals';

/**
 * Smoke test: web search handler returns a payment-required payload when no authorization is sent.
 * Verifies modules wire together without starting stdio (which would consume stdin).
 */
describe('MCP web_search wiring', () => {
  it('requests payment when paymentAuthorization is missing', async () => {
    process.env.STELLAR_NETWORK = 'stellar:testnet';
    process.env.STELLAR_PRIVATE_KEY = Keypair.random().secret();
    process.env.BRAVE_API_KEY = 'integration-test';
    process.env.CONFIRM_PAYMENTS = 'false';
    process.env.X402_FACILITATOR_URL = 'https://www.x402.org/facilitator';
    jest.resetModules();

    const { createWebSearchHandler } = await import('../../src/mcp/tools/web-search.js');

    const supportedBody = {
      kinds: [
        {
          x402Version: 2,
          scheme: 'exact',
          network: 'stellar:testnet',
          extra: {},
        },
      ],
      extensions: [],
      signers: {},
    };

    const fetchMock = jest.fn(async (url: string | URL) => {
      const u = String(url);
      if (u.includes('facilitator') && u.includes('supported')) {
        return new Response(JSON.stringify(supportedBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Unexpected fetch: ${u}`);
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const handler = createWebSearchHandler();
    const result = await handler({ query: 'hello world' });

    expect(result.isError).toBe(true);
    expect(result.content[0].type).toBe('text');
    expect(String((result.content[0] as { text?: string }).text)).toContain(
      'Payment required',
    );
  }, 30_000);
});
