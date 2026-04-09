export type DemoLogEntry = {
  at: string;
  kind: "402" | "paid" | "error" | "info";
  message: string;
  txHash?: string;
  challengeId?: string;
};

const entries: DemoLogEntry[] = [];
const MAX = 80;

export function logDemo(entry: Omit<DemoLogEntry, "at">) {
  entries.unshift({
    at: new Date().toISOString(),
    ...entry,
  });
  entries.splice(MAX);
}

export function getDemoLog(): DemoLogEntry[] {
  return [...entries];
}

export function clearDemoLog(): void {
  entries.length = 0;
}
