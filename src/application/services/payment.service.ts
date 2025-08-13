import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil', 
  });

  async createPaymentIntent(amount: number, currency: string, paymentMethodTypes: string[]) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: paymentMethodTypes,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }
}