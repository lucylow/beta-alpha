/**
 * Minimal browser/client helper: retry a paid HTTP call after a 402 by attaching
 * `Authorization: Stellar <json>` with native memo payment proof.
 */

export type NativeProofAuthorization = {
  challenge_id: string;
  proof: { payer: string; tx_hash: string };
};

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  let body: unknown = null;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`http_${res.status}:${typeof body === "string" ? body.slice(0, 200) : JSON.stringify(body).slice(0, 200)}`);
  }
  return body as T;
}

export async function payAndFetchWithAuthorization<T>(
  url: string,
  buildAuth: () => Promise<NativeProofAuthorization>,
  init?: RequestInit,
): Promise<T> {
  const first = await fetch(url, init);
  if (first.status !== 402) {
    const text = await first.text();
    return JSON.parse(text) as T;
  }
  const auth = await buildAuth();
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Stellar ${JSON.stringify(auth)}`);
  const second = await fetch(url, { ...init, headers });
  const text = await second.text();
  if (!second.ok) {
    throw new Error(`pay_retry_failed:${second.status}:${text.slice(0, 300)}`);
  }
  return JSON.parse(text) as T;
}
