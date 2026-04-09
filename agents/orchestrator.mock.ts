export const sampleTask = "Search for Stellar x402 news and summarize the top result.";
export const samplePlan = [
  { id: "step1", capability: "websearch", input: { query: sampleTask } },
  { id: "step2", capability: "summarize", input: { source: "step1" }, dependsOn: ["step1"] },
];
