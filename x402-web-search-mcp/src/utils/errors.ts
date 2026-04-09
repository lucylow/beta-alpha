export class PaymentRequiredError extends Error {
  constructor(public readonly paymentDetails: unknown) {
    super('Payment required');
    this.name = 'PaymentRequiredError';
  }
}

export class InsufficientFundsError extends Error {
  constructor() {
    super('Insufficient USDC balance');
    this.name = 'InsufficientFundsError';
  }
}
