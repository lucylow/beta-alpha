import { env } from '../config/env.js';

const level = env.LOG_LEVEL;
const levels = { debug: 0, info: 1, warn: 2, error: 3 } as const;

/** All logs go to stderr so stdout stays clean for MCP stdio JSON-RPC. */
function write(prefix: string, args: unknown[]): void {
  console.error(prefix, ...args);
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (levels[level] <= 0) write('[DEBUG]', args);
  },
  info: (...args: unknown[]) => {
    if (levels[level] <= 1) write('[INFO]', args);
  },
  warn: (...args: unknown[]) => {
    if (levels[level] <= 2) write('[WARN]', args);
  },
  error: (...args: unknown[]) => {
    if (levels[level] <= 3) write('[ERROR]', args);
  },
};
