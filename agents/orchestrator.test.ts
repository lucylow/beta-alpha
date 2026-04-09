import { describe, it, expect } from "vitest";
import { OrchestratorAgent } from "./orchestrator";

describe("OrchestratorAgent", () => {
  it("creates a workflow with summarize", () => {
    const agent = new OrchestratorAgent([]);
    expect(agent.plan("Search and summarize")).toHaveLength(2);
  });

  it("creates a single-step workflow without summarize", () => {
    const agent = new OrchestratorAgent([]);
    expect(agent.plan("Search for news")).toHaveLength(1);
  });

  it("returns empty plan for empty task", () => {
    const agent = new OrchestratorAgent([]);
    expect(agent.plan("")).toHaveLength(0);
  });

  it("choose returns null when registry is empty", () => {
    const agent = new OrchestratorAgent([]);
    const step = { id: "s1", capability: "websearch" as const, input: {} };
    expect(agent.choose(step)).toBeNull();
  });
});
