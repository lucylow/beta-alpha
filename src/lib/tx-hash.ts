/** Lowercase hex string suitable for Stellar explorer URLs (demo / mock). */
export function randomStellarTxHashHex() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function stellarExpertTestnetTxUrl(hashHex: string) {
  return `https://stellar.expert/explorer/testnet/tx/${hashHex}`;
}
