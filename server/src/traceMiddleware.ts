import type { NextFunction, Request, Response } from "express";
import { newTraceId, pushTrace } from "./traceLog.js";

export type TraceRequest = Request & { traceId: string };

declare module "express-serve-static-core" {
  interface Locals {
    traceAmount?: string;
    traceWallet?: string;
    traceApproval?: string;
    traceMessage?: string;
  }
}

/** Optional fields recorded on `res.locals` for trace rows. */
export type TraceLocals = Pick<
  import("express-serve-static-core").Locals,
  "traceAmount" | "traceWallet" | "traceApproval" | "traceMessage"
>;


function isTruthyHeader(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

/** Attach trace id, echo client id if present, record a row when the response finishes. */
export function traceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.headers["x-trace-id"];
  const traceId = isTruthyHeader(incoming) ? incoming : newTraceId();
  res.setHeader("X-Trace-Id", traceId);
  (req as TraceRequest).traceId = traceId;

  const started = Date.now();
  const path = (req.originalUrl ?? req.url).split("?")[0] || req.path || "/";

  res.on("finish", () => {
    const durationMs = Date.now() - started;
    try {
      pushTrace({
        endpoint: path,
        method: req.method,
        status: res.statusCode,
        traceId,
        durationMs,
        amount: res.locals.traceAmount,
        wallet: res.locals.traceWallet,
        approval: res.locals.traceApproval,
        message: res.locals.traceMessage,
      });
    } catch (err) {
      console.error("[trace] pushTrace failed", err);
    }
  });

  next();
}

export function getTraceId(req: Request): string {
  return (req as TraceRequest).traceId ?? newTraceId();
}
