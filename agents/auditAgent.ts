export interface AuditEvent {
  time: string;
  actor: string;
  action: string;
  txHash?: string;
}

export class AuditAgent {
  private events: AuditEvent[] = [];
  private readonly maxEvents: number;

  constructor(maxEvents = 1000) {
    this.maxEvents = maxEvents;
  }

  log(event: AuditEvent) {
    if (!event.actor || !event.action) {
      console.warn("[AuditAgent] skipping event with missing actor or action");
      return;
    }
    this.events.unshift({
      ...event,
      time: event.time || new Date().toISOString(),
    });
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
  }

  all() {
    return [...this.events];
  }

  findByActor(actor: string) {
    return this.events.filter((e) => e.actor === actor);
  }
}
