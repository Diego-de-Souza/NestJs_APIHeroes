/** Port IN: contrato do Payment (facade). Controller → Port → PaymentService. */
export interface IPaymentPort {
  createPaymentIntent(userId: string, planType: string, amount: number, currency?: string): Promise<unknown>;
  getAvailablePlans(): Promise<unknown>;
  createSubscription(userId: string, planType: string, customerId?: string): Promise<unknown>;
  checkPremiumStatus(userId: string): Promise<unknown>;
  cancelSubscription(userId: string): Promise<unknown>;
  handleWebhook(body: Buffer | string, signature: string): Promise<{ received: boolean }>;
}
