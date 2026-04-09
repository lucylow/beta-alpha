export class PaymentAgent {
  async requestQuote(amountUSDC: number) {
    if (typeof amountUSDC !== "number" || amountUSDC <= 0 || !isFinite(amountUSDC)) {
      throw new Error(`Invalid amount: ${amountUSDC}. Must be a positive number.`);
    }

    return {
      quoteId: `q_${Math.random().toString(36).slice(2, 8)}`,
      amountUSDC,
      token: "USDC",
      network: "testnet",
    };
  }

  async approve(quoteId: string) {
    if (!quoteId || typeof quoteId !== "string") {
      throw new Error("Invalid quoteId: must be a non-empty string.");
    }

    return {
      quoteId,
      approved: true,
      authEntry: `auth_${Math.random().toString(36).slice(2, 12)}`,
    };
  }
}
