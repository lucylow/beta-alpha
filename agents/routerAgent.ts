export type AgentCapability = "websearch" | "summarize" | "walletinfo";

export interface RegistryAgent {
  id: string;
  capability: AgentCapability;
  priceUSDC: number;
  latencyMs: number;
  reputation: number;
  endpoint: string;
}

export class RouterAgent {
  constructor(private registry: RegistryAgent[]) {}

  selectBest(capability: AgentCapability): RegistryAgent | null {
    if (!this.registry || this.registry.length === 0) {
      console.warn("[RouterAgent] empty registry");
      return null;
    }

    const candidates = this.registry.filter((a) => a.capability === capability);
    if (candidates.length === 0) {
      console.warn(`[RouterAgent] no agents found for capability: ${capability}`);
      return null;
    }

    return candidates.sort((a, b) => {
      const scoreA = a.reputation - a.priceUSDC * 100 - a.latencyMs / 1000;
      const scoreB = b.reputation - b.priceUSDC * 100 - b.latencyMs / 1000;
      return scoreB - scoreA;
    })[0];
  }
}
