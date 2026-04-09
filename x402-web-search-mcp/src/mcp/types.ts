import type { PaymentRequired } from '@x402/core/types';

export type WebSearchToolArgs = {
  query: string;
  country?: string;
  count?: number;
 /** JSON-encoded x402 PaymentPayload from your x402-enabled client */
  paymentAuthorization?: string;
};

export type PaymentRequiredToolPayload = PaymentRequired;
