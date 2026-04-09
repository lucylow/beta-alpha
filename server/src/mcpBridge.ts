import type { Express } from "express";

/** Optional HTTP hints for MCP clients; the real MCP server uses stdio (`npm run mcp`). */
export function mountMcpHttp(app: Express) {
  app.get("/api/mcp", (_req, res) => {
    res.json({
      name: "agentpay-on-stellar",
      transport: "stdio",
      run: "cd server && AGENTPAY_API=http://localhost:8787 npm run mcp",
      tools: [
        "list_agents",
        "wallets_kit_bootstrap",
        "request_paid_search",
        "web_search",
        "wallet_info",
        "x402_search",
        "x402_market_data",
        "x402_summarize_challenge",
        "x402_news",
        "x402_compute",
        "check_demo_log",
        "get_payment_template",
        "check_contract_state",
      ],
    });
  });
}
