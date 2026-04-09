import { env } from './config/env.js';
import { startMcpServer } from './mcp/server.js';
import { logger } from './utils/logger.js';

logger.info(
  `Starting x402 Web Search MCP server (network=${env.STELLAR_NETWORK}, facilitator=${env.X402_FACILITATOR_URL})`,
);

startMcpServer().catch((err: unknown) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
