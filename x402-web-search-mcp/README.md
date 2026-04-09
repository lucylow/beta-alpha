# x402 Web Search MCP Server

MCP (Model Context Protocol) server that exposes a **`web_search`** tool backed by the [Brave Search API](https://brave.com/search/api/), with per-query pricing enforced through **x402 on Stellar** (testnet or pubnet).

This repo targets **x402 v2** using [`@x402/core`](https://www.npmjs.com/package/@x402/core) and [`@x402/stellar`](https://www.npmjs.com/package/@x402/stellar) (currently **v2.9.x** on npm — the `^1.0.0` range in early drafts is not published).

## Features

- **`web_search`** — Brave web results; **0.001 USDC** per query (`exact` scheme).
- **`wallet_info`** — Shows the server wallet address and classic USDC balance (Horizon).
- **Facilitator verification** — `HTTPFacilitatorClient` against `X402_FACILITATOR_URL` (default: `https://www.x402.org/facilitator`).
- **Type-safe** TypeScript, **Jest** unit/integration smoke tests.

## Prerequisites

- **Node.js 20+**
- **Stellar** keypair with **USDC** on the network you select (Soroban USDC for x402 settlement; Horizon balance in `wallet_info` reflects classic balances when applicable).
- **Brave Search API** subscription key.

## Installation

```bash
cd x402-web-search-mcp
npm install
npm run build
cp .env.example .env
# Edit .env with your keys
```

## Configuration

| Variable | Description |
|----------|-------------|
| `STELLAR_NETWORK` | `stellar:testnet` (default) or `stellar:pubnet` |
| `STELLAR_PRIVATE_KEY` | Secret key (`S…`) for the **pay-to** server wallet |
| `BRAVE_API_KEY` | Brave Search API token |
| `X402_FACILITATOR_URL` | x402 HTTP facilitator base URL |
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` |
| `CONFIRM_PAYMENTS` | `true` (default): call facilitator verify; `false`: **skip verification** (local demos/tests only) |

## Run (stdio MCP)

```bash
npm start
```

The server speaks MCP over **stdio**. Do not write logs to **stdout**; this implementation logs to **stderr** only.

### Cursor / Claude Code–style config

Point your MCP client at the built entry and pass env vars (or rely on `.env` if the launcher loads it):

```json
{
  "mcpServers": {
    "x402-web-search": {
      "command": "node",
      "args": ["/absolute/path/to/x402-web-search-mcp/dist/index.js"],
      "env": {
        "STELLAR_NETWORK": "stellar:testnet",
        "STELLAR_PRIVATE_KEY": "S...",
        "BRAVE_API_KEY": "...",
        "X402_FACILITATOR_URL": "https://www.x402.org/facilitator",
        "CONFIRM_PAYMENTS": "true"
      }
    }
  }
}
```

## Payment flow

1. The agent calls **`web_search`** with a `query` only.
2. The tool returns a **`PaymentRequired`** JSON payload (x402 v2) embedded in the tool error text.
3. The agent uses an **x402-capable client** (for example [`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch) with `ExactStellarScheme` from `@x402/stellar/exact/client`) to pay and obtain a **`PaymentPayload`**.
4. The agent calls **`web_search`** again with `paymentAuthorization` set to **`JSON.stringify(paymentPayload)`**.
5. The server calls **`x402ResourceServer.verifyPayment`** (via the facilitator) and, if valid, runs the Brave search.

See the [Stellar x402 quickstart](https://developers.stellar.org/docs/build/agentic-payments/x402/quickstart-guide) for end-to-end HTTP examples; the same client libraries produce the payload this MCP tool expects.

## Testing

```bash
npm test
```

Integration tests mock facilitator HTTP responses. Unit tests avoid live Brave/Stellar calls where possible. Set `CONFIRM_PAYMENTS=false` only in trusted environments.

## License

MIT — see [LICENSE](./LICENSE).
