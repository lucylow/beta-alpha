import { RouterAgent, RegistryAgent } from "./routerAgent";

export interface WorkflowStep {
  id: string;
  capability: "websearch" | "summarize" | "walletinfo";
  input: Record<string, unknown>;
  dependsOn?: string[];
}

export class OrchestratorAgent {
  constructor(private registry: RegistryAgent[]) {}

  plan(task: string): WorkflowStep[] {
    if (!task || typeof task !== "string" || !task.trim()) {
      console.warn("[OrchestratorAgent] empty task, returning empty plan");
      return [];
    }

    if (task.toLowerCase().includes("summarize")) {
      return [
        { id: "step1", capability: "websearch", input: { query: task } },
        { id: "step2", capability: "summarize", input: { source: "step1" }, dependsOn: ["step1"] },
      ];
    }
    return [{ id: "step1", capability: "websearch", input: { query: task } }];
  }

  choose(step: WorkflowStep): RegistryAgent | null {
    const router = new RouterAgent(this.registry);
    const agent = router.selectBest(step.capability);
    if (!agent) {
      console.warn(`[OrchestratorAgent] no agent available for step ${step.id} (${step.capability})`);
    }
    return agent;
  }
}
