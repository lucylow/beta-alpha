import { z } from 'zod';
import { StellarClient } from '../../payment/stellar-client.js';
import { SEARCH_PRICE_USDC } from '../../config/constants.js';

const inputSchema = z.object({});

export const walletInfoToolName = 'wallet_info';

export const walletInfoTool = {
  name: walletInfoToolName,
  description:
    'Show the merchant Stellar address (pay-to) and approximate USDC balance for this server wallet.',
  inputSchema,
  registerOn: (stellar: StellarClient) => async () => {
    const address = stellar.getPublicKey();
    const balance = await stellar.getUSDCBalance();
    const text =
      `**Wallet**\n` +
      `- Public key: ${address}\n` +
      `- USDC balance (Horizon, classic USDC): ${balance}\n` +
      `- Search price: ${SEARCH_PRICE_USDC} USDC / query\n`;
    return { content: [{ type: 'text' as const, text }] };
  },
};

export function createWalletInfoHandler(stellar: StellarClient) {
  return walletInfoTool.registerOn(stellar);
}
