import { PaymentAgent } from "./paymentAgent";

export async function demoPayment() {
  const agent = new PaymentAgent();
  try {
    const quote = await agent.requestQuote(0.001);
    const auth = await agent.approve(quote.quoteId);
    return { quote, auth, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[demoPayment] failed: ${message}`);
    return { quote: null, auth: null, error: message };
  }
}
