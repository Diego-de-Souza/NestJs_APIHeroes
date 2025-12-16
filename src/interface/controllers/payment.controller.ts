import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from '../../application/services/payment.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePaymentIntentDto } from '../dtos/payment/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ✅ CRIAR PAYMENT INTENT PARA PLANO ESPECÍFICO
  @Post('create-payment-intent')
  @UseGuards(AuthGuard)
  async createPaymentIntent(@Request() req, @Body() body: CreatePaymentIntentDto) {
    const { planType, amount, currency = 'brl' } = body;
    const userId = req.user.id;

    return await this.paymentService.createPaymentIntent(userId, planType, amount, currency);
  }

  // ✅ LISTAR PLANOS DISPONÍVEIS
  @Get('plans')
  async getAvailablePlans() {
    return await this.paymentService.getAvailablePlans();
  }

  // ✅ CRIAR SUBSCRIPTION (FLUXO RECORRENTE)
  @Post('create-subscription')
  @UseGuards(AuthGuard)
  async createSubscription(@Request() req, @Body() body: { planType: string; customerId?: string }) {
    const { planType, customerId } = body;
    const userId = req.user.id;

    return await this.paymentService.createSubscription(userId, planType, customerId);
  }

  // ✅ VERIFICAR STATUS PREMIUM COM DETALHES
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

  // ✅ CANCELAR SUBSCRIPTION
  @Post('cancel-subscription')
  @UseGuards(AuthGuard)
  async cancelSubscription(@Request() req) {
    const userId = req.user.id;
    return await this.paymentService.cancelSubscription(userId);
  }

  // ✅ WEBHOOK DO STRIPE
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    return await this.paymentService.handleWebhook(req.rawBody, signature);
  }

  // ✅ ENDPOINT DE TESTE (REMOVER EM PRODUÇÃO)
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'payment',
      timestamp: new Date().toISOString()
    };
  }
}
