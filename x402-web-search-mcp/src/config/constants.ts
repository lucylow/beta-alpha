import { getUsdcAddress } from '@x402/stellar';

/** USDC per web search (decimal string). */
export const SEARCH_PRICE_USDC = '0.001';

/** Display helper (fractional cents). */
export const SEARCH_PRICE_IN_CENTS = 0.1;

export const STELLAR_CONFIG = {
  testnet: {
    horizon: 'https://horizon-testnet.stellar.org',
    rpc: 'https://soroban-testnet.stellar.org',
    usdcContract: getUsdcAddress('stellar:testnet'),
  },
  pubnet: {
    horizon: 'https://horizon.stellar.org',
    rpc: 'https://soroban.stellar.org',
    usdcContract: getUsdcAddress('stellar:pubnet'),
  },
} as const;

export function getNetworkConfig(network: string) {
  return network === 'stellar:testnet'
    ? STELLAR_CONFIG.testnet
    : STELLAR_CONFIG.pubnet;
}
