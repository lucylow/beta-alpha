# AgentPay Soroban contract

Rust crate `agent-pay` implements:

- **`initialize`** — one-time admin setup (requires admin auth).
- **`register_agent` / `update_agent` / `remove_agent`** — agent/service registry (owner-authenticated).
- **`list_agents` / `get_agent`** — read agents with simple pagination.
- **`record_query_payment`** — payer-authenticated attestation of a completed off-chain payment (`payment_ref` is replay-protected). Underpaying the agent’s `price_stroops` returns **`BelowListedPrice`** (distinct from non-positive **`BadAmount`**).
- **`registry_stats`** — O(1) read of `next_agent_id`, `payment_count`, and `paused` (dashboard / indexer friendly).
- **Events** — `reg` after each `register_agent`; `pay` after each successful `record_query_payment` (topics + full `PaymentEntry` payload for explorers).
- **`set_paused`** — admin emergency pause.

## Build & test

Requires Rust and (on macOS) Xcode command line tools for linking.

```bash
cd contracts/agent-pay
cargo test
cargo build --target wasm32v1-none --release
```

Deploy with [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools) per Stellar docs, then set `CONTRACT_ID` in `server/.env`.
