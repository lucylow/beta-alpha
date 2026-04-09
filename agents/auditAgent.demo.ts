import { AuditAgent } from "./auditAgent";
import { auditSeed } from "./auditAgent.mock";

const audit = new AuditAgent();
auditSeed.forEach((e) => audit.log(e));
console.log(audit.all());
