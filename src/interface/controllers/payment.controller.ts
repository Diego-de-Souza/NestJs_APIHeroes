// src/payments/payment.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  async createIntent(@Body() body: { amount: number; currency: string; method: string }) {
    const { amount, currency, method } = body;

    return this.paymentService.createPaymentIntent(amount, currency, [method]);
  }
}
