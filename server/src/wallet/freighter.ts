/**
 * Browser-only Freighter helpers (reference for agents / frontends).
 * The AgentPay server verifies payments via Horizon; signing happens in the client.
 */
export type FreighterConnect = {
  getPublicKey: () => Promise<{ publicKey?: string; error?: unknown }>;
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<{ signedTxXdr?: string; error?: unknown }>;
};

export async function freighterPublicKey(freighter: FreighterConnect): Promise<string> {
  const r = await freighter.getPublicKey();
  if (r.error || !r.publicKey) throw new Error("freighter_connect_failed");
  return r.publicKey;
}

export async function freighterSignTx(
  freighter: FreighterConnect,
  xdr: string,
  networkPassphrase: string,
): Promise<string> {
  const r = await freighter.signTransaction(xdr, { networkPassphrase });
  if (r.error || !r.signedTxXdr) throw new Error("freighter_sign_failed");
  return r.signedTxXdr;
}
