import { describe, expect, it, beforeEach } from "vitest";
import { clearTraces, getTraces, newTraceId, pushTrace } from "./traceLog.js";

describe("traceLog", () => {
  beforeEach(() => {
    clearTraces();
  });

  it("generates trace ids with prefix", () => {
    const id = newTraceId();
    expect(id.startsWith("trace-")).toBe(true);
    expect(id.length).toBeGreaterThan(12);
  });

  it("pushes and returns traces in LIFO order", () => {
    pushTrace({
      traceId: "a",
      endpoint: "/api/search",
      method: "GET",
      status: 200,
      durationMs: 10,
    });
    pushTrace({
      traceId: "b",
      endpoint: "/api/logs",
      method: "GET",
      status: 200,
      durationMs: 5,
    });
    const rows = getTraces();
    expect(rows[0].traceId).toBe("b");
    expect(rows[1].traceId).toBe("a");
  });

  it("clearTraces empties the buffer", () => {
    pushTrace({
      traceId: "x",
      endpoint: "/",
      method: "GET",
      status: 200,
      durationMs: 1,
    });
    clearTraces();
    expect(getTraces()).toHaveLength(0);
  });
});
