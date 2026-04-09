import { Keypair } from '@stellar/stellar-sdk';
import { describe, expect, it } from '@jest/globals';
import { StellarClient } from '../../src/payment/stellar-client.js';

describe('StellarClient', () => {
  it('derives the public key from the configured secret', () => {
    const kp = Keypair.random();
    const client = new StellarClient('stellar:testnet', kp.secret());
    expect(client.getPublicKey()).toBe(kp.publicKey());
  });
});
