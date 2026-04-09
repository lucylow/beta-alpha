import { describe, it, expect } from "vitest";
import { SearchAgent } from "./searchAgent";

describe("SearchAgent", () => {
  it("can be instantiated", () => {
    expect(SearchAgent).toBeTruthy();
  });

  it("returns error for empty query", async () => {
    const agent = new SearchAgent({} as any);
    const result = await agent.run("");
    expect(result.error).toContain("Invalid query");
    expect(result.results).toEqual([]);
  });
});
