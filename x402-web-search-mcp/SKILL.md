---
name: x402-web-search
description: Search the web using Brave Search with x402 micropayments on Stellar (MCP server).
---

# x402 Web Search Skill

Use the **`x402-web-search-mcp`** server when you need live web results and the project is configured for **x402 on Stellar**.

## Tools

### `web_search`

**Parameters**

- `query` (string, required): Search terms.
- `country` (string, optional): Country code (e.g. `US`).
- `count` (number, optional): Number of results (1–20).
- `paymentAuthorization` (string, optional): JSON string of an x402 **`PaymentPayload`** after the user pays (required once payments are enforced).

**Flow**

1. First call without `paymentAuthorization` returns **`PaymentRequired`** details in the tool response.
2. Pay via an x402 Stellar client, then retry with `paymentAuthorization` set to the stringified payload.

### `wallet_info`

Returns the configured server public key and approximate Horizon **USDC** balance.

## Setup

Configure the MCP server (see `README.md` in this package) with `STELLAR_PRIVATE_KEY`, `BRAVE_API_KEY`, and facilitator URL. Fund the wallet with USDC on the selected Stellar network before running paid searches.
