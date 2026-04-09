import { useCallback, useEffect, useState } from "react";
import {
  getNetworkDetails,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";

const HORIZON = "https://horizon-testnet.stellar.org";

export type WalletState =
  | { status: "idle" }
  | { status: "no_extension" }
  | { status: "disconnected" }
  | { status: "connected"; address: string; network: string; passphrase: string };

export function useFreighterWallet() {
  const [state, setState] = useState<WalletState>({ status: "idle" });

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const ext = await isConnected();
      if (ext.error || !ext.isConnected) {
        setState({ status: "no_extension" });
        return;
      }
      const acc = await requestAccess();
      if (acc.error || !acc.address) {
        setState({ status: "disconnected" });
        return;
      }
      const net = await getNetworkDetails();
      setState({
        status: "connected",
        address: acc.address,
        network: net.network ?? "unknown",
        passphrase: net.networkPassphrase || "Test SDF Network ; September 2015",
      });
    } catch {
      setState({ status: "no_extension" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const connect = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const signAndSubmitPayment = useCallback(async (unsignedXdr: string, networkPassphrase: string) => {
    const signed = await signTransaction(unsignedXdr, {
      networkPassphrase,
    });
    if (signed.error || !signed.signedTxXdr) {
      throw new Error(signed.error?.message ?? "freighter_sign_failed");
    }
    const server = new Horizon.Server(HORIZON);
    const tx = TransactionBuilder.fromXDR(signed.signedTxXdr, networkPassphrase);
    const res = await server.submitTransaction(tx);
    return res.hash;
  }, []);

  return { state, connect, refresh, signAndSubmitPayment };
}
