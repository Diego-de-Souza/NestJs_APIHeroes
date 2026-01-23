import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentRepository } from '../../infrastructure/repositories/payment.repository';
import { PlanType } from '../../domain/interfaces/subscription-plans.interface';
import { SUBSCRIPTION_PLANS, isValidPlan } from '../../shared/utils/subscription-plans.utils';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });

  constructor(private readonly paymentRepository: PaymentRepository) {}

  // ✅ CRIAR PAYMENT INTENT PARA PLANO ESPECÍFICO
  async createPaymentIntent(userId: number, planType: string, amount: number, currency: string = 'brl') {
    try {
      // Valida se o plano existe
      if (!isValidPlan(planType)) {
        throw new Error(`Plano inválido: ${planType}. Planos disponíveis: mensal, trimestral, semestral, anual`);
      }

      const plan = SUBSCRIPTION_PLANS[planType as PlanType];

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa centavos
        currency,
        payment_method_types: ['card', 'boleto'],
        metadata: {
          userId: userId.toString(),
          planType,
          planName: plan.name
        }
      });

      // Salva no banco
      await this.paymentRepository.createPayment({
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: 'pending',
        paymentMethod: 'card',
        metadata: { 
          stripeAmount: paymentIntent.amount,
          planType,
          planName: plan.name
        }
      });

      this.logger.log(`💳 Payment Intent criado: ${paymentIntent.id} para usuário ${userId} - Plano: ${plan.name}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        planDetails: {
          name: plan.name,
          duration: plan.duration,
          description: plan.description
        }
      };

    } catch (error) {
      this.logger.error('❌ Erro ao criar Payment Intent:', error.message);
      throw error;
    }
  }

  // ✅ LISTAR PLANOS DISPONÍVEIS
  async getAvailablePlans() {
    return Object.values(SUBSCRIPTION_PLANS).map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      durationDays: plan.duration,
      stripePriceId: plan.stripePriceId
    }));
  }

  // ✅ CRIAR SUBSCRIPTION
  async createSubscription(userId: number, planType: string, customerId?: string) {
    try {
      // Se não tem customer, cria um
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          metadata: { userId: userId.toString() }
        });
        customerId = customer.id;
      }

      // Busca o priceId correto pelo plano
      const plan = SUBSCRIPTION_PLANS[planType as PlanType];
      if (!plan || !plan.stripePriceId) {
        throw new Error('Plano ou priceId do Stripe não configurado corretamente.');
      }
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Salva no banco

      await this.paymentRepository.createSubscription({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: plan.stripePriceId,
        status: subscription.status,
        currentPeriodStart: new Date((subscription['current_period_start'] ?? 0) * 1000),
        currentPeriodEnd: new Date((subscription['current_period_end'] ?? 0) * 1000),
        price: (subscription.items.data[0]?.price?.unit_amount || 0) / 100,
        currency: subscription.items.data[0]?.price?.currency || 'brl',
        planType: planType
      });

      // latest_invoice pode ser string ou objeto, garantir que é objeto

      let paymentIntentClientSecret: string | undefined = undefined;
      if (typeof subscription.latest_invoice === 'object' && subscription.latest_invoice !== null) {
        const invoice = subscription.latest_invoice as any;
        if (invoice.payment_intent) {
          if (typeof invoice.payment_intent === 'object') {
            paymentIntentClientSecret = invoice.payment_intent.client_secret;
          }
        }
      }

      this.logger.log(`📱 Subscription criada: ${subscription.id} para usuário ${userId}`);

      return {
        subscriptionId: subscription.id,
        clientSecret: paymentIntentClientSecret,
        status: subscription.status
      };

    } catch (error) {
      this.logger.error('❌ Erro ao criar Subscription:', error.message);
      throw error;
    }
  }

  // ✅ PROCESSAR WEBHOOK
  async handleWebhook(body: Buffer | string, signature: string): Promise<{ received: boolean }> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      this.logger.log(`🔔 Webhook recebido: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object);
          break;

        default:
          this.logger.log(`⚠️ Evento não tratado: ${event.type}`);
      }

      return { received: true };

    } catch (error) {
      this.logger.error('❌ Erro no webhook:', error.message);
      throw error;
    }
  }

  // ✅ VERIFICAR STATUS PREMIUM COM DETALHES
  async checkPremiumStatus(userId: number) {
    const details = await this.paymentRepository.getActiveSubscriptionDetails(userId);
    
    return {
      hasPremium: details.isActive,
      subscription: details.subscription,
      daysRemaining: details.daysRemaining,
      planType: details.planType,
      expiresAt: details.subscription?.currentPeriodEnd
    };
  }

  // ✅ CANCELAR SUBSCRIPTION
  async cancelSubscription(userId: number) {
    try {
      const subscription = await this.paymentRepository.findSubscriptionByUserId(userId);
      
      if (!subscription) {
        throw new Error('Subscription não encontrada');
      }

      await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      await this.paymentRepository.updateSubscription(subscription.id, {
        cancelAtPeriodEnd: true
      });

      this.logger.log(`❌ Subscription cancelada: ${subscription.stripeSubscriptionId}`);

      return { success: true };

    } catch (error) {
      this.logger.error('❌ Erro ao cancelar subscription:', error.message);
      throw error;
    }
  }

  // 🔄 MÉTODOS PRIVADOS PARA WEBHOOKS
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.paymentRepository.findPaymentByStripeId(paymentIntent.id);
    
    if (payment) {
      // Atualiza status do pagamento
      let stripeChargeId: string | undefined = undefined;
      if ('charges' in paymentIntent && paymentIntent.charges) {
        const charges = paymentIntent.charges as { data: Array<{ id: string }> };
        if (Array.isArray(charges.data) && charges.data.length > 0) {
          stripeChargeId = charges.data[0]?.id;
        }
      }
      await this.paymentRepository.updatePayment(payment.id, {
        status: 'succeeded',
        stripeChargeId,
        paidAt: new Date()
      });

      // Se tem planType nos metadados, ativa/renova subscription
      const planType = paymentIntent.metadata?.planType;
      
      if (planType && isValidPlan(planType)) {
        await this.paymentRepository.renewSubscription(
          payment.userId, 
          planType as PlanType, 
          payment.amount
        );

        this.logger.log(`✅ Pagamento confirmado e subscription ativada: ${paymentIntent.id} - Plano: ${planType}`);
      } else {
        this.logger.log(`✅ Pagamento confirmado: ${paymentIntent.id}`);
      }
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.paymentRepository.findPaymentByStripeId(paymentIntent.id);
    
    if (payment) {
      await this.paymentRepository.updatePayment(payment.id, {
        status: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Falha no pagamento'
      });
      
      this.logger.log(`❌ Pagamento falhou: ${paymentIntent.id}`);
    }
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const dbSubscription = await this.paymentRepository.findSubscriptionByStripeId(subscription.id);
    
    if (dbSubscription) {
      await this.paymentRepository.updateSubscription(dbSubscription.id, {
        status: subscription.status,
        currentPeriodStart: new Date((subscription['current_period_start'] ?? 0) * 1000),
        currentPeriodEnd: new Date((subscription['current_period_end'] ?? 0) * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      });
      
      this.logger.log(`🔄 Subscription atualizada: ${subscription.id}`);
    }
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const dbSubscription = await this.paymentRepository.findSubscriptionByStripeId(subscription.id);
    
    if (dbSubscription) {
      await this.paymentRepository.updateSubscription(dbSubscription.id, {
        status: 'canceled',
        canceledAt: new Date()
      });
      
      this.logger.log(`❌ Subscription cancelada: ${subscription.id}`);
    }
  }
}