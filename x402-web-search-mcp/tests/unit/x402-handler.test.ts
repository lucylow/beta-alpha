import { Keypair } from '@stellar/stellar-sdk';
import { afterEach, describe, expect, it, jest } from '@jest/globals';

describe('X402PaymentHandler', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('verifyPaymentPayload is bypassed when CONFIRM_PAYMENTS=false', async () => {
    process.env = {
      ...originalEnv,
      STELLAR_NETWORK: 'stellar:testnet',
      STELLAR_PRIVATE_KEY: Keypair.random().secret(),
      BRAVE_API_KEY: 'unit-test-brave',
      CONFIRM_PAYMENTS: 'false',
      X402_FACILITATOR_URL: 'https://www.x402.org/facilitator',
    };
    jest.resetModules();
    const { X402PaymentHandler } = await import('../../src/payment/x402-handler.js');
    const handler = new X402PaymentHandler(
      Keypair.random().publicKey(),
      'stellar:testnet',
    );
    await expect(handler.verifyPaymentPayload('not-json')).resolves.toBe(true);
  });
});
