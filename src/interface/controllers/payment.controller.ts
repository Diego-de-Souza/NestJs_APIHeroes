import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest, Req, Logger } from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePaymentIntentDto } from '../dtos/payment/payment.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  async createPaymentIntent(@Request() req, @Body() body: CreatePaymentIntentDto) {
    const { planType, amount, currency = 'brl' } = body;
    const userId = req.user.id;

    return await this.paymentService.createPaymentIntent(userId, planType, amount, currency);
  }

  @Get('plans')
  async getAvailablePlans() {
    return await this.paymentService.getAvailablePlans();
  }

  @Post('create-subscription')
  @UseGuards(AuthGuard)
  async createSubscription(@Request() req, @Body() body: { planType: string; customerId?: string }) {
    const { planType, customerId } = body;
    const userId = req.user.id;

    return await this.paymentService.createSubscription(userId, planType, customerId);
  }

  @Get('premium-status')
  @UseGuards(AuthGuard)
  async checkPremiumStatus(@Request() req) {
    const userId = req.user.id;
    const statusDetails = await this.paymentService.checkPremiumStatus(userId);

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
    return await this.paymentService.cancelSubscription(userId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    // req.body será um Buffer devido ao express.raw
    this.logger.debug('Stripe Webhook recebido:', { signature, body: req.body });
    return await this.paymentService.handleWebhook(req.body, signature);
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
