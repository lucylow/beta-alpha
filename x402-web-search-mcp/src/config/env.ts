import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  STELLAR_NETWORK: z
    .enum(['stellar:testnet', 'stellar:pubnet'])
    .default('stellar:testnet'),
  STELLAR_PRIVATE_KEY: z.string().min(1),
  BRAVE_API_KEY: z.string().min(1),
  X402_FACILITATOR_URL: z
    .string()
    .url()
    .default('https://www.x402.org/facilitator'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CONFIRM_PAYMENTS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
