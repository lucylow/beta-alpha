export interface AgentRecord {
  id: string;
  name: string;
  capability: string;
  priceUSDC: number;
  reputation: number;
  endpoint: string;
}

export class RegistryAgentStore {
  private agents: AgentRecord[] = [];

  register(agent: AgentRecord) {
    if (!agent.id || !agent.capability || !agent.endpoint) {
      throw new Error(
        `Invalid agent record: id, capability, and endpoint are required. Got: ${JSON.stringify(agent)}`
      );
    }
    if (this.agents.some((a) => a.id === agent.id)) {
      console.warn(`[RegistryAgentStore] duplicate agent id "${agent.id}", replacing`);
      this.agents = this.agents.filter((a) => a.id !== agent.id);
    }
    this.agents.push(agent);
  }

  findByCapability(capability: string): AgentRecord[] {
    if (!capability) return [];
    return this.agents.filter((a) => a.capability === capability);
  }

  getAll(): AgentRecord[] {
    return [...this.agents];
  }
}
