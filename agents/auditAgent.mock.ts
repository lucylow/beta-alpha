import { AuditEvent } from "./auditAgent";

export const auditSeed: AuditEvent[] = [
  {
    time: "12:34:05",
    actor: "agent-wallet",
    action: "paid for websearch",
    txHash: "0x7a3f9c2b1e4d8a5f",
  },
  {
    time: "12:35:11",
    actor: "agent-wallet",
    action: "retrieved results",
  },
];
