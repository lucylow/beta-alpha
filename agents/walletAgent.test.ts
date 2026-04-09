import { describe, it, expect } from "vitest";
import { WalletAgent } from "./walletAgent";

describe("WalletAgent", () => {
  it("spends funds correctly", () => {
    const wallet = new WalletAgent(1);
    expect(wallet.spend(0.001).balanceUSDC).toBeCloseTo(0.999);
  });

  it("throws on insufficient funds", () => {
    const wallet = new WalletAgent(0.0005);
    expect(() => wallet.spend(0.001)).toThrow("Insufficient funds");
  });

  it("throws on invalid spend amount", () => {
    const wallet = new WalletAgent(1);
    expect(() => wallet.spend(-1)).toThrow("Invalid spend amount");
    expect(() => wallet.spend(0)).toThrow("Invalid spend amount");
  });

  it("throws on invalid initial balance", () => {
    expect(() => new WalletAgent(-5)).toThrow("Invalid initial balance");
  });

  it("tracks remaining queries", () => {
    const wallet = new WalletAgent(5);
    expect(wallet.getBalance().remainingQueriesAt001).toBe(5000);
  });
});
