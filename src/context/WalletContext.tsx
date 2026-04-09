import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getNetwork, requestAccess } from "@stellar/freighter-api";

const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";
const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";

export function truncateStellarAddress(address: string, head = 4, tail = 4) {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

async function fetchTestnetUsdcBalance(publicKey: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${HORIZON_TESTNET}/accounts/${publicKey}`);
  } catch (err) {
    console.warn("Horizon fetch failed:", err);
    return "0.000";
  }
  if (res.status === 404) return "0.000";
  if (!res.ok) throw new Error(`Horizon returned ${res.status}`);
  try {
    const data = (await res.json()) as {
      balances?: Array<{ asset_type?: string; asset_code?: string; balance?: string }>;
    };
    const usdc = (data.balances ?? []).filter(
      (b) =>
        b.asset_type !== "native" && String(b.asset_code ?? "").toUpperCase() === "USDC",
    );
    if (!usdc.length) return "0.000";
    const total = usdc.reduce((sum, b) => sum + parseFloat(b.balance ?? "0"), 0);
    return isNaN(total) ? "0.000" : total.toFixed(3);
  } catch {
    console.warn("Failed to parse Horizon response");
    return "0.000";
  }
}

type WalletContextValue = {
  publicKey: string | null;
  truncatedAddress: string | null;
  usdcBalance: string | null;
  isTestnet: boolean;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isTestnet, setIsTestnet] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const bal = await fetchTestnetUsdcBalance(publicKey);
      setUsdcBalance(bal);
    } catch {
      setUsdcBalance("0.000");
    }
  }, [publicKey]);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const access = await requestAccess();
      if (access.error) {
        const msg =
          typeof access.error === "object" && access.error && "message" in access.error
            ? String((access.error as { message?: string }).message)
            : "Freighter access denied";
        throw new Error(msg || "Freighter access denied");
      }
      if (!access.address) throw new Error("No address returned from Freighter");

      const net = await getNetwork();
      const onTestnet =
        !net.error &&
        net.networkPassphrase === TESTNET_PASSPHRASE;

      setPublicKey(access.address);
      setIsTestnet(onTestnet);
      if (!onTestnet && !net.error) {
        setError("Switch Freighter to Testnet for this demo (balances shown are testnet USDC).");
      }

      try {
        const bal = await fetchTestnetUsdcBalance(access.address);
        setUsdcBalance(bal);
      } catch {
        setUsdcBalance("0.000");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Wallet connection failed";
      setError(message);
      setPublicKey(null);
      setUsdcBalance(null);
      throw e;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setUsdcBalance(null);
    setError(null);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      publicKey,
      truncatedAddress: publicKey ? truncateStellarAddress(publicKey) : null,
      usdcBalance,
      isTestnet,
      connecting,
      error,
      connect,
      disconnect,
      refreshBalance,
    }),
    [publicKey, usdcBalance, isTestnet, connecting, error, connect, disconnect, refreshBalance],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
