export type TraceEntry = {
  time: string;
  endpoint: string;
  method: string;
  status: number;
  traceId: string;
  durationMs: number;
  amount?: string;
  wallet?: string;
  approval?: string;
  message?: string;
};

const entries: TraceEntry[] = [];
const MAX = 200;

export function newTraceId(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `trace-${hex}`;
}

export function pushTrace(entry: Omit<TraceEntry, "time"> & { time?: string }): void {
  entries.unshift({
    time: entry.time ?? new Date().toISOString(),
    ...entry,
  });
  entries.splice(MAX);
}

export function getTraces(): TraceEntry[] {
  return [...entries];
}

export function clearTraces(): void {
  entries.length = 0;
}
