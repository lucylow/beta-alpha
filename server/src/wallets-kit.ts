import {
  HORIZON_URL,
  NETWORK_PASSPHRASE,
  SOROBAN_RPC_URL,
  STELLAR_NETWORK_X402,
} from "./config.js";

/** Wallets supported by @creit.tech/stellar-wallets-kit (browser). Server exposes this for dashboards + MCP. */
export const WALLETS_KIT_SUPPORTED = [
  { id: "freighter", name: "Freighter", kind: "extension" as const },
  { id: "albedo", name: "Albedo", kind: "web" as const },
  { id: "xbull", name: "xBull Wallet", kind: "extension_pwa" as const },
  { id: "walletconnect", name: "WalletConnect v2", kind: "mobile" as const },
  { id: "rabet", name: "Rabet", kind: "extension" as const },
  { id: "hana", name: "Hana Wallet", kind: "extension" as const },
  { id: "ledger", name: "Ledger", kind: "hardware" as const },
  { id: "trezor", name: "Trezor", kind: "hardware" as const },
  { id: "hot-wallet", name: "HOT Wallet", kind: "mobile" as const },
  { id: "lobstr", name: "Lobstr (via WalletConnect)", kind: "mobile" as const },
] as const;

export type WalletsKitBootstrap = {
  npmPackage: "@creit.tech/stellar-wallets-kit";
  /** Use browser / dashboard env; not secret if using WalletConnect public project id. */
  walletConnectProjectId: string | null;
  app: { name: string; description: string; url: string };
  stellar: {
    networkPassphrase: string;
    horizonUrl: string;
    sorobanRpcUrl: string;
    x402NetworkId: string;
  };
  integrationNotes: {
    clientSigning: string;
    serverVerifies: string;
    authorizationHeader: string;
  };
  supportedWallets: typeof WALLETS_KIT_SUPPORTED;
};

export function buildWalletsKitBootstrap(opts: {
  publicBase: string;
  walletConnectProjectId?: string | null;
  appName?: string;
  appDescription?: string;
  appUrl?: string;
}): WalletsKitBootstrap {
  const wc = opts.walletConnectProjectId ?? process.env.WALLETCONNECT_PROJECT_ID ?? null;
  return {
    npmPackage: "@creit.tech/stellar-wallets-kit",
    walletConnectProjectId: wc,
    app: {
      name: opts.appName ?? process.env.AGENTPAY_APP_NAME ?? "Stellar AgentPay",
      description:
        opts.appDescription ??
        process.env.AGENTPAY_APP_DESCRIPTION ??
        "Agent micropayments with Stellar Wallets Kit + x402",
      url: opts.appUrl ?? process.env.AGENTPAY_APP_URL ?? opts.publicBase,
    },
    stellar: {
      networkPassphrase: NETWORK_PASSPHRASE,
      horizonUrl: HORIZON_URL,
      sorobanRpcUrl: SOROBAN_RPC_URL,
      x402NetworkId: STELLAR_NETWORK_X402,
    },
    integrationNotes: {
      clientSigning:
        "Connect and sign with Stellar Wallets Kit in the browser (or embedded webview). The backend never holds user keys.",
      serverVerifies:
        "After payment, retry with Authorization: Stellar <json> (x402 payload or native challenge proof). AgentPay verifies on Horizon or via x402 facilitator.",
      authorizationHeader:
        "Use the same header shape as /api/search paid GET — works for any wallet the kit supports.",
    },
    supportedWallets: WALLETS_KIT_SUPPORTED,
  };
}
