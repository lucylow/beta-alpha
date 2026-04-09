import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { env } from '../config/env.js';
import { StellarClient } from '../payment/stellar-client.js';
import { webSearchTool, createWebSearchHandler } from './tools/web-search.js';
import { walletInfoTool, createWalletInfoHandler } from './tools/wallet-info.js';
import { logger } from '../utils/logger.js';

export async function startMcpServer(): Promise<void> {
  const server = new McpServer({
    name: 'x402-web-search-mcp',
    version: '1.0.0',
  });

  const stellar = new StellarClient(env.STELLAR_NETWORK, env.STELLAR_PRIVATE_KEY);

  server.registerTool(
    webSearchTool.name,
    {
      description: webSearchTool.description,
      inputSchema: webSearchTool.inputSchema,
    },
    createWebSearchHandler(),
  );

  server.registerTool(
    walletInfoTool.name,
    {
      description: walletInfoTool.description,
      inputSchema: walletInfoTool.inputSchema,
    },
    createWalletInfoHandler(stellar),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('x402 Web Search MCP server running on stdio');
}
