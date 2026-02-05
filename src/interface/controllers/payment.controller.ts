import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest, Req, Logger, Inject } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePaymentIntentDto } from '../dtos/payment/payment.dto';
import { Request as ExpressRequest } from 'express';
import type { IPaymentPort } from '../../application/ports/in/payment/payment.port';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(@Inject('IPaymentPort') private readonly paymentPort: IPaymentPort) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  async createPaymentIntent(@Request() req, @Body() body: CreatePaymentIntentDto) {
    const { planType, amount, currency = 'brl' } = body;
    const userId = req.user.id;

    return await this.paymentPort.createPaymentIntent(userId, planType, amount, currency);
  }

  @Get('plans')
  async getAvailablePlans() {
    return await this.paymentPort.getAvailablePlans();
  }

  @Post('create-subscription')
  @UseGuards(AuthGuard)
  async createSubscription(@Request() req, @Body() body: { planType: string; customerId?: string }) {
    const { planType, customerId } = body;
    const userId = req.user.id;

    return await this.paymentPort.createSubscription(userId, planType, customerId);
  }

  @Get('premium-status')
  @UseGuards(AuthGuard)
  async checkPremiumStatus(@Request() req) {
    const userId = req.user.id;
    const statusDetails = await this.paymentPort.checkPremiumStatus(userId) as {
      hasPremium: boolean;
      daysRemaining?: number;
      subscription?: unknown;
      planType?: string;
      expiresAt?: unknown;
    };

    return {
      ...statusDetails,
      message: statusDetails.hasPremium
        ? `Acesso premium ativo - ${statusDetails.daysRemaining} dias restantes`
        : 'Usuário não tem acesso premium'
    };
  }

  @Post('cancel-subscription')
  @UseGuards(AuthGuard)
  async cancelSubscription(@Request() req) {
    const userId = req.user.id;
    return await this.paymentPort.cancelSubscription(userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') signature: string
  ) {
    // req.body será um Buffer devido ao express.raw configurado no main.ts
    const body = req.body as Buffer;
    this.logger.debug('Stripe Webhook recebido:', { signature, bodyLength: body?.length });
    return await this.paymentPort.handleWebhook(body, signature);
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'payment',
      timestamp: new Date().toISOString()
    };
  }
}
