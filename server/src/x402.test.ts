import { describe, expect, it, vi } from "vitest";

describe("x402 builder", () => {
  it(
    "includes memo and challenge",
    async () => {
      vi.resetModules();
      process.env.PAYMENT_DESTINATION = "GDHJHMYAFXD77LHWGXDYU7XPLFWRATXUUKYRKOH5PPMAC7X5DJ2OEZY";
      process.env.DEMO_SIMULATED = "false";
      const { buildSearchPaymentRequirement, buildComputePaymentRequirement } = await import("./x402.js");
      const p = buildSearchPaymentRequirement("hello agent");
      expect(p.amount_stroops).toBeTruthy();
      expect(p.memo).toContain("AP|search|");
      expect(p.challenge_id.length).toBeGreaterThan(16);
      expect(p.destination.startsWith("G")).toBe(true);

      const c = buildComputePaymentRequirement(3);
      expect(c.service).toBe("compute");
      expect(c.memo).toMatch(/AP\|compute\|[a-f0-9]+\|u=3/);
      expect(BigInt(c.amount_stroops)).toBeGreaterThan(0n);
    },
    15_000,
  );
});
