import { RouterAgent } from "./routerAgent";
import { mockRegistry } from "./routerAgent.mock";

const router = new RouterAgent(mockRegistry);
console.log(router.selectBest("websearch"));
