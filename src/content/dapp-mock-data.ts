// Centralized mock data for the x402 dapp experience

export const NETWORK_CONFIG = {
  testnet: { name: "Testnet", color: "text-warning", badge: "bg-warning/10 text-warning border-warning/20" },
  mainnet: { name: "Mainnet", color: "text-success", badge: "bg-success/10 text-success border-success/20" },
};

export const WALLET_MOCK = {
  address: "GDQP2K...X4RMFH",
  fullAddress: "GDQP2KPYOSCSP5FNP5UXHGIPTO7AQMIPUF3V2KX4RMFH",
  xlmBalance: 9_847.32,
  usdcBalance: 12.45,
  network: "testnet" as const,
  connected: false,
};

export const QUERY_COST_USDC = 0.001;

export const ACTIVITY_FEED = [
  { id: "1", time: "12s ago", query: "Stellar x402 protocol spec", amount: 0.001, status: "confirmed" as const, wallet: "GDQP…MFH", txHash: "abc123…f9e2" },
  { id: "2", time: "1m ago", query: "Soroban smart contract tutorial", amount: 0.001, status: "confirmed" as const, wallet: "GBNE…KLQ", txHash: "def456…a1b3" },
  { id: "3", time: "2m ago", query: "MCP server implementation guide", amount: 0.001, status: "confirmed" as const, wallet: "GCXY…WRP", txHash: "ghi789…c4d5" },
  { id: "4", time: "5m ago", query: "x402 payment header format", amount: 0.001, status: "pending" as const, wallet: "GDQP…MFH", txHash: "jkl012…e6f7" },
  { id: "5", time: "8m ago", query: "Brave Search API pricing", amount: 0.001, status: "confirmed" as const, wallet: "GFHI…NOP", txHash: "mno345…g8h9" },
  { id: "6", time: "12m ago", query: "Claude Code MCP integration", amount: 0.001, status: "failed" as const, wallet: "GBNE…KLQ", txHash: "pqr678…i0j1" },
  { id: "7", time: "15m ago", query: "Stellar testnet faucet", amount: 0.001, status: "confirmed" as const, wallet: "GCXY…WRP", txHash: "stu901…k2l3" },
  { id: "8", time: "22m ago", query: "Web3 micropayment patterns", amount: 0.001, status: "confirmed" as const, wallet: "GDQP…MFH", txHash: "vwx234…m4n5" },
];

export const ANALYTICS_DATA = {
  today: { queries: 847, spend: 0.847, successRate: 98.2, avgCost: 0.001 },
  week: { queries: 5_230, spend: 5.23, successRate: 97.8, avgCost: 0.001 },
  month: { queries: 18_450, spend: 18.45, successRate: 98.5, avgCost: 0.001 },
  chartData: [
    { day: "Mon", queries: 720, spend: 0.72 },
    { day: "Tue", queries: 680, spend: 0.68 },
    { day: "Wed", queries: 810, spend: 0.81 },
    { day: "Thu", queries: 950, spend: 0.95 },
    { day: "Fri", queries: 1100, spend: 1.1 },
    { day: "Sat", queries: 620, spend: 0.62 },
    { day: "Sun", queries: 350, spend: 0.35 },
  ],
};

export const PRICING_PLANS = [
  {
    name: "Demo",
    price: "Free",
    description: "Testnet-only, no real payments",
    features: ["Unlimited testnet queries", "Mock payment flow", "Full API access", "Community support"],
    badge: "Try Now",
    highlighted: false,
  },
  {
    name: "Builder",
    price: "$0.001",
    unit: "per query",
    description: "Pay-as-you-go on mainnet",
    features: ["Unlimited queries", "Real USDC settlements", "x402 payment receipts", "Webhook notifications", "Priority support"],
    badge: "Most Popular",
    highlighted: true,
  },
  {
    name: "Agent Fleet",
    price: "Custom",
    description: "Volume pricing for autonomous agents",
    features: ["Bulk query discounts", "Dedicated endpoints", "SLA guarantees", "Custom rate limits", "Direct integration support"],
    badge: "Contact Us",
    highlighted: false,
  },
];

export const X402_STEPS = [
  { step: 1, title: "Request", description: "Agent sends a search query to the MCP server.", detail: "GET /api/search?q=stellar+x402", header: "" },
  { step: 2, title: "402 Challenge", description: "Server responds with Payment Required and x402 requirements.", detail: "HTTP/1.1 402 Payment Required", header: "X-Payment: {\"scheme\":\"exact\",\"network\":\"stellar:testnet\",\"payTo\":\"G...\",\"maxAmountRequired\":\"1000\"}" },
  { step: 3, title: "Authorization", description: "Client signs a Stellar transaction authorizing the payment.", detail: "signTransaction(unsignedXdr, { networkPassphrase })", header: "" },
  { step: 4, title: "Settlement", description: "Payment is verified via the x402 facilitator on Stellar.", detail: "POST facilitator/verify → { isValid: true }", header: "Authorization: Stellar <payment_payload_json>" },
  { step: 5, title: "Response", description: "Search results are delivered after payment confirmation.", detail: "HTTP/1.1 200 OK\n{ results: [...] }", header: "" },
];

export const DOCS_TABS = [
  {
    id: "quickstart",
    label: "Quickstart",
    steps: [
      { title: "Clone the repo", code: "git clone https://github.com/lucylow/beta-alpha.git\ncd beta-alpha" },
      { title: "Install dependencies", code: "cd x402-web-search-mcp && npm install" },
      { title: "Set environment variables", code: "cp .env.example .env\n# Add STELLAR_PRIVATE_KEY and BRAVE_API_KEY" },
      { title: "Start the MCP server", code: "npm run dev" },
    ],
  },
  {
    id: "mcp-config",
    label: "MCP Config",
    steps: [
      { title: "Claude Code config", code: "{\n  \"mcpServers\": {\n    \"x402-search\": {\n      \"command\": \"node\",\n      \"args\": [\"dist/index.js\"],\n      \"env\": {\n        \"STELLAR_PRIVATE_KEY\": \"S...\",\n        \"BRAVE_API_KEY\": \"BSA...\"\n      }\n    }\n  }\n}" },
      { title: "Cursor config", code: "// Add to .cursor/mcp.json\n{\n  \"x402-search\": {\n    \"command\": \"npx\",\n    \"args\": [\"x402-web-search-mcp\"]\n  }\n}" },
    ],
  },
  {
    id: "env-vars",
    label: "Environment",
    steps: [
      { title: "Required variables", code: "STELLAR_PRIVATE_KEY=S...   # Stellar secret key\nBRAVE_API_KEY=BSA...       # Brave Search API key\nSTELLAR_NETWORK=stellar:testnet\nCONFIRM_PAYMENTS=true" },
      { title: "Optional variables", code: "X402_FACILITATOR_URL=https://www.x402.org/facilitator\nLOG_LEVEL=info" },
    ],
  },
  {
    id: "wallet",
    label: "Wallet Setup",
    steps: [
      { title: "Install Freighter", code: "# Install from https://freighter.app\n# Switch to Testnet in settings" },
      { title: "Fund with Friendbot", code: "curl https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY" },
      { title: "Add USDC trustline", code: "# In Freighter, add asset:\n# Code: USDC\n# Issuer: GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    steps: [
      { title: "402 not returned?", code: "# Check STELLAR_PRIVATE_KEY is set\n# Check the server is running on the correct port\ncurl -v http://localhost:3000/api/search?q=test" },
      { title: "Payment fails?", code: "# Ensure USDC trustline exists\n# Check testnet balance\n# Verify CONFIRM_PAYMENTS=true" },
    ],
  },
];

export const FAQ_ITEMS = [
  { q: "Do I need an API key to use this?", a: "You need a Brave Search API key for the server. Clients pay per query via x402 — no API keys required on the client side." },
  { q: "Does this work on mainnet?", a: "The codebase supports both testnet and mainnet. Switch by changing the STELLAR_NETWORK environment variable." },
  { q: "How are x402 payments settled?", a: "Payments are signed by the user's Stellar wallet and verified by the x402 facilitator. Settlement happens on-chain before results are returned." },
  { q: "How do I verify a transaction?", a: "Every successful query returns a transaction hash. You can verify it on Stellar Expert or Horizon API." },
  { q: "What happens if payment fails?", a: "The server returns a 402 with updated payment requirements. The client can retry with a new signed transaction." },
  { q: "Can agents use this autonomously?", a: "Yes. Any MCP-compatible agent (Claude Code, Cursor, etc.) can discover the tool and pay per query without human intervention." },
  { q: "Is 0.001 USDC the final price?", a: "The current price is set in the server config. Operators can adjust it. Volume pricing is planned for the Agent Fleet tier." },
];

export const DEMO_STEPS = [
  { label: "Idle", description: "Ready for query" },
  { label: "Quoting", description: "Generating payment requirements" },
  { label: "Awaiting Approval", description: "Sign transaction in wallet" },
  { label: "Verifying", description: "Checking payment with facilitator" },
  { label: "Settled", description: "Payment confirmed on Stellar" },
  { label: "Searching", description: "Querying Brave Search API" },
  { label: "Completed", description: "Results delivered" },
];

export const WALLET_TIMELINE = [
  { event: "Wallet connected", time: "2m ago", icon: "link" as const },
  { event: "Payment authorized — 0.001 USDC", time: "1m ago", icon: "check" as const },
  { event: "Search settled — tx abc123…", time: "45s ago", icon: "zap" as const },
  { event: "Results delivered — 5 items", time: "44s ago", icon: "search" as const },
];

export const SEARCH_SUGGESTIONS = [
  "Search latest Stellar x402 updates",
  "Soroban smart contract best practices",
  "MCP server architecture patterns",
  "Brave Search API documentation",
  "Stellar testnet USDC faucet",
];
