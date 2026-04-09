import { Horizon, Keypair } from '@stellar/stellar-sdk';
import { getNetworkConfig } from '../config/constants.js';

export class StellarClient {
  private readonly horizonServer: Horizon.Server;
  private readonly keypair: Keypair;
  private readonly network: string;

  constructor(network: string, privateKey: string) {
    this.network = network;
    const config = getNetworkConfig(network);
    this.horizonServer = new Horizon.Server(config.horizon);
    this.keypair = Keypair.fromSecret(privateKey);
  }

  getNetwork(): string {
    return this.network;
  }

  getPublicKey(): string {
    return this.keypair.publicKey();
  }

  async getUSDCBalance(): Promise<string> {
    const account = await this.horizonServer.loadAccount(this.keypair.publicKey());
    const usdcBalance = account.balances.find(
      (b) =>
        b.asset_type === 'credit_alphanum4' &&
        'asset_code' in b &&
        b.asset_code === 'USDC',
    );
    return usdcBalance && 'balance' in usdcBalance ? usdcBalance.balance : '0';
  }

  async hasSufficientFunds(requiredAmount: string): Promise<boolean> {
    const balance = await this.getUSDCBalance();
    return parseFloat(balance) >= parseFloat(requiredAmount);
  }
}
