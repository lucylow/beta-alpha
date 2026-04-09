import { RegistryAgentStore } from "./registryAgent";

const registry = new RegistryAgentStore();
registry.register({
  id: "a1",
  name: "Search Agent",
  capability: "websearch",
  priceUSDC: 0.001,
  reputation: 95,
  endpoint: "mcp://search",
});
console.log(registry.findByCapability("websearch"));
