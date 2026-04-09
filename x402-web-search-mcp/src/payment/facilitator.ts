import { HTTPFacilitatorClient } from '@x402/core/server';
import { env } from '../config/env.js';

/** Creates the default HTTP facilitator client (verify / settle / supported). */
export function createFacilitatorClient(): HTTPFacilitatorClient {
  return new HTTPFacilitatorClient({ url: env.X402_FACILITATOR_URL });
}
