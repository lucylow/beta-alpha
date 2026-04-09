import type { PaymentRequirement } from "./x402.js";

const TTL_MS = 1000 * 60 * 30;

type Entry = { req: PaymentRequirement; expires: number };

const withExpiry = new Map<string, Entry>();

export function rememberChallenge(req: PaymentRequirement): void {
  withExpiry.set(req.challenge_id, { req, expires: Date.now() + TTL_MS });
}

export function takeChallenge(challengeId: string): PaymentRequirement | undefined {
  prune();
  const e = withExpiry.get(challengeUrlId(challengeId));
  if (!e) {
    return undefined;
  }
  return e.req;
}

export function peekChallenge(challengeId: string): PaymentRequirement | undefined {
  prune();
  return withExpiry.get(challengeUrlId(challengeId))?.req;
}

function challengeUrlId(id: string): string {
  return id.trim();
}

function prune() {
  const now = Date.now();
  for (const [k, v] of withExpiry) {
    if (v.expires < now) {
      withExpiry.delete(k);
    }
  }
}

/** Clear all pending challenges (demo reset). */
export function clearAllChallenges(): void {
  withExpiry.clear();
}
