export async function getMarketData(symbol: string): Promise<{
  symbol: string;
  stellar_usd: number | null;
  fetched_at: string;
}> {
  const sym = symbol.trim().toUpperCase() || "XLMUSDC";
  let res: Response;
  try {
    res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(12_000) },
    );
  } catch (e) {
    const hint = e instanceof Error ? e.name === "AbortError" ? "timeout" : e.message : "network_error";
    throw new Error(`coingecko_fetch:${hint}`);
  }
  if (!res.ok) {
    throw new Error(`coingecko_failed HTTP ${res.status}`);
  }
  let data: { stellar?: { usd?: number } };
  try {
    data = (await res.json()) as { stellar?: { usd?: number } };
  } catch {
    throw new Error("coingecko_invalid_json");
  }
  return {
    symbol: sym,
    stellar_usd: data.stellar?.usd ?? null,
    fetched_at: new Date().toISOString(),
  };
}
