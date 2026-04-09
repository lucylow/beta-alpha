import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const base = process.env.AGENTPAY_API ?? "http://127.0.0.1:8787";

const mcp = new McpServer({ name: "agentpay-on-stellar", version: "0.1.0" });

mcp.registerTool(
  "list_agents",
  {
    description:
      "Fetches agent listings from the AgentPay API (search, compute, Soroban hints, Wallets Kit bootstrap URL).",
  },
  async () => {
    const res = await fetch(`${base}/api/agents`);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  },
);

mcp.registerTool(
  "wallets_kit_bootstrap",
  {
    description:
      "Returns JSON to initialize @creit.tech/stellar-wallets-kit in a browser: networks, supported wallets, WalletConnect project id env, and signing notes. MCP cannot open a wallet; use this to instruct the user or a web client.",
  },
  async () => {
    const res = await fetch(`${base}/api/wallets/kit`);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  },
);

mcp.registerTool(
  "request_paid_search",
  {
    description:
      "Starts a paid search: returns HTTP 402 payment requirements from AgentPay. Call with a search query string.",
    inputSchema: {
      q: z.string().min(1).describe("Search query"),
    },
  },
  async (args) => {
    const res = await fetch(`${base}/api/paid-search?q=${encodeURIComponent(args.q)}`);
    const body = await res.text();
    const summary = [
      `status: ${res.status}`,
      res.status === 402 ? "PAID RESOURCE: use wallet + POST /api/paid-search with proof" : "",
      body.slice(0, 8000),
    ]
      .filter(Boolean)
      .join("\n");
    return { content: [{ type: "text", text: summary }] };
  },
);

function searchApiUrl(q: string, count?: number, country?: string): string {
  const u = new URL(`${base}/api/search`);
  u.searchParams.set("q", q);
  if (count != null) u.searchParams.set("count", String(count));
  if (country != null && country.length >= 2) u.searchParams.set("country", country.slice(0, 2));
  return u.toString();
}

mcp.registerTool(
  "x402_search",
  {
    description:
      "Fetches /api/search (canonical AgentPay route). On 402, returns Stellar payment requirements JSON; pay then POST with proof or paymentAuthorization.",
    inputSchema: {
      q: z.string().min(1).describe("Search query"),
      count: z.number().int().min(1).max(20).optional().describe("Result count (default 10)"),
      country: z.string().length(2).optional().describe("ISO country code e.g. US"),
    },
  },
  async (args) => {
    const res = await fetch(searchApiUrl(args.q, args.count, args.country));
    const body = await res.text();
    return {
      content: [
        {
          type: "text",
          text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n"),
        },
      ],
    };
  },
);

mcp.registerTool(
  "web_search",
  {
    description:
      "Pay-per-query web search (x402 on Stellar): hits /api/search with optional region and count. On HTTP 402, complete USDC payment then retry with proof — same flow as x402_search.",
    inputSchema: {
      query: z.string().min(1).describe("Search query"),
      country: z.string().length(2).optional().describe("Regional results (e.g. US, GB)"),
      count: z.number().int().min(1).max(20).optional().describe("Number of results (default 10)"),
    },
  },
  async (args) => {
    const res = await fetch(searchApiUrl(args.query, args.count, args.country));
    const body = await res.text();
    return {
      content: [
        {
          type: "text",
          text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n"),
        },
      ],
    };
  },
);

mcp.registerTool(
  "wallet_info",
  {
    description:
      "Returns XLM and classic USDC trustline balance for a Stellar address (Horizon). Includes an rough estimate of 0.001-USDC searches remaining.",
    inputSchema: {
      address: z.string().min(56).max(56).describe("Stellar public key (G...)"),
    },
  },
  async (args) => {
    const url = new URL(`${base}/api/wallet/balance`);
    url.searchParams.set("address", args.address);
    const res = await fetch(url);
    const body = await res.text();
    return {
      content: [{ type: "text", text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n") }],
    };
  },
);

mcp.registerTool(
  "x402_market_data",
  {
    description:
      "Fetches /api/market-data (paywalled). On 402, pay native XLM per challenge memo or use x402_exact from JSON; then POST with challenge_id and proof.",
    inputSchema: {
      symbol: z.string().min(1).describe("Trading pair symbol e.g. XLMUSDC"),
    },
  },
  async (args) => {
    const res = await fetch(`${base}/api/market-data?symbol=${encodeURIComponent(args.symbol)}`);
    const body = await res.text();
    return {
      content: [
        {
          type: "text",
          text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n"),
        },
      ],
    };
  },
);

mcp.registerTool(
  "x402_summarize_challenge",
  {
    description:
      "POST /api/summarize with JSON { text } only — returns HTTP 402 + payment challenge. User must pay with a Stellar wallet (e.g. Wallets Kit), then POST again with challenge_id + proof or paymentAuthorization.",
    inputSchema: {
      text: z.string().min(1).describe("Text to summarize after payment"),
    },
  },
  async (args) => {
    const res = await fetch(`${base}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: args.text }),
    });
    const body = await res.text();
    return {
      content: [{ type: "text", text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n") }],
    };
  },
);

mcp.registerTool(
  "x402_news",
  {
    description:
      "GET /api/news (paywalled). On 402, pay then retry with Authorization: Stellar or POST with challenge_id + proof.",
    inputSchema: {
      category: z.string().min(1).optional().describe("News category e.g. blockchain"),
    },
  },
  async (args) => {
    const cat = args.category ?? "blockchain";
    const res = await fetch(`${base}/api/news?category=${encodeURIComponent(cat)}`);
    const body = await res.text();
    return {
      content: [{ type: "text", text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n") }],
    };
  },
);

mcp.registerTool(
  "x402_compute",
  {
    description:
      "GET /api/compute?op=...&units=1..500 — returns 402 with dynamic pricing, then paid digest. Use after wallet signs payment via Wallets Kit + x402 flow.",
    inputSchema: {
      op: z.string().min(1).describe("Opaque job / op id for the demo compute stub"),
      units: z.number().int().min(1).max(500).optional(),
    },
  },
  async (args) => {
    const u = args.units ?? 1;
    const res = await fetch(
      `${base}/api/compute?op=${encodeURIComponent(args.op)}&units=${encodeURIComponent(String(u))}`,
    );
    const body = await res.text();
    return {
      content: [{ type: "text", text: [`status: ${res.status}`, body.slice(0, 8000)].join("\n") }],
    };
  },
);

mcp.registerTool(
  "check_demo_log",
  {
    description: "Reads recent AgentPay API demo / payment timeline log entries.",
  },
  async () => {
    const res = await fetch(`${base}/api/demo-log`);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  },
);

mcp.registerTool(
  "get_payment_template",
  {
    description:
      "Build an unsigned Stellar payment XDR for the current x402 challenge (needs challenge_id + source account).",
    inputSchema: {
      challenge_id: z.string().min(4),
      source: z.string().min(56).max(56),
    },
  },
  async (args) => {
    const url = new URL(`${base}/api/payment-xdr`);
    url.searchParams.set("challenge_id", args.challenge_id);
    url.searchParams.set("source", args.source);
    const res = await fetch(url);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  },
);

mcp.registerTool(
  "check_contract_state",
  {
    description:
      "Reports whether a Soroban contract id is configured server-side (full RPC read is done via Stellar CLI in README).",
  },
  async () => {
    const res = await fetch(`${base}/api/config`);
    const text = await res.text();
    return { content: [{ type: "text", text }] };
  },
);

const transport = new StdioServerTransport();
await mcp.connect(transport);
