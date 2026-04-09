export class WalletAgent {
  private balanceUSDC: number;

  constructor(initialBalance = 5) {
    if (typeof initialBalance !== "number" || initialBalance < 0 || !isFinite(initialBalance)) {
      throw new Error(`Invalid initial balance: ${initialBalance}`);
    }
    this.balanceUSDC = initialBalance;
  }

  getBalance() {
    return {
      balanceUSDC: this.balanceUSDC,
      remainingQueriesAt001: Math.floor(this.balanceUSDC / 0.001),
    };
  }

  spend(amount: number) {
    if (typeof amount !== "number" || amount <= 0 || !isFinite(amount)) {
      throw new Error(`Invalid spend amount: ${amount}. Must be a positive number.`);
    }
    if (this.balanceUSDC < amount) {
      throw new Error(
        `Insufficient funds: balance ${this.balanceUSDC} USDC, requested ${amount} USDC`
      );
    }
    this.balanceUSDC = Math.round((this.balanceUSDC - amount) * 1e7) / 1e7;
    return this.getBalance();
  }
}
