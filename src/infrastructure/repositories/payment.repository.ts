import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Subscription } from "../database/sequelize/models/subscription.model";
import { Payment } from "../database/sequelize/models/payment.model";
import { PlanType, calculateExpirationDate } from "../../shared/utils/subscription-plans.utils";

@Injectable()
export class PaymentRepository {

    constructor(
        @InjectModel(Subscription) private readonly subscriptionModel: typeof Subscription,
        @InjectModel(Payment) private readonly paymentModel: typeof Payment
    ) {}

    // SUBSCRIPTION METHODS
    async createSubscription(subscriptionData: any): Promise<Subscription> {
        return await this.subscriptionModel.create(subscriptionData);
    }

    async findSubscriptionByUserId(userId: number): Promise<Subscription | null> {
        return await this.subscriptionModel.findOne({
            where: { userId, status: 'active' }
        });
    }

    async findSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | null> {
        return await this.subscriptionModel.findOne({
            where: { stripeSubscriptionId }
        });
    }

    async updateSubscription(id: number, updateData: any): Promise<void> {
        await this.subscriptionModel.update(updateData, {
            where: { id }
        });
    }

    async cancelSubscription(userId: number): Promise<void> {
        await this.subscriptionModel.update(
            { 
                status: 'canceled', 
                canceledAt: new Date() 
            },
            { where: { userId } }
        );
    }

    // PAYMENT METHODS
    async createPayment(paymentData: any): Promise<Payment> {
        return await this.paymentModel.create(paymentData);
    }

    async findPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | null> {
        return await this.paymentModel.findOne({
            where: { stripePaymentIntentId }
        });
    }

    async updatePayment(id: number, updateData: any): Promise<void> {
        await this.paymentModel.update(updateData, {
            where: { id }
        });
    }

    async findPaymentsByUserId(userId: number): Promise<Payment[]> {
        return await this.paymentModel.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    // PREMIUM ACCESS VERIFICATION
    async hasActiveSubscription(userId: number): Promise<boolean> {
        const subscription = await this.subscriptionModel.findOne({
            where: { 
                userId, 
                status: 'active',
                currentPeriodEnd: {
                    [require('sequelize').Op.gt]: new Date()
                }
            }
        });

        return !!subscription;
    }

    // CRIAR SUBSCRIPTION COM PLANO ESPECÍFICO
    async createSubscriptionWithPlan(userId: number, planType: PlanType, amount: number, stripePaymentIntentId?: string): Promise<Subscription> {
        const startDate = new Date();
        const endDate = calculateExpirationDate(planType, startDate);

        return await this.subscriptionModel.create({
            userId,
            stripeCustomerId: '', 
            stripeSubscriptionId: stripePaymentIntentId || `manual_${Date.now()}`,
            stripePriceId: `plan_${planType}`,
            status: 'active',
            currentPeriodStart: startDate,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
            price: amount,
            currency: 'BRL',
            planType
        });
    }

    // RENOVAR SUBSCRIPTION EXISTENTE
    async renewSubscription(userId: number, planType: PlanType, amount: number): Promise<void> {
        const subscription = await this.findSubscriptionByUserId(userId);
        
        if (subscription) {
            // Se já tem subscription, estende a data
            const currentEnd = subscription.currentPeriodEnd;
            const now = new Date();
            
            // Se ainda está ativa, soma a partir da data atual de fim
            // Se expirou, soma a partir de agora
            const baseDate = currentEnd > now ? currentEnd : now;
            const newEndDate = calculateExpirationDate(planType, baseDate);

            await this.updateSubscription(subscription.id, {
                status: 'active',
                currentPeriodEnd: newEndDate,
                planType,
                price: amount,
                cancelAtPeriodEnd: false
            });
        } else {
            // Se não tem subscription, cria nova
            await this.createSubscriptionWithPlan(userId, planType, amount);
        }
    }

    // BUSCAR DETALHES DA SUBSCRIPTION ATIVA
    async getActiveSubscriptionDetails(userId: number): Promise<{
        subscription: Subscription | null;
        isActive: boolean;
        daysRemaining: number;
        planType: string | null;
    }> {
        const subscription = await this.findSubscriptionByUserId(userId);
        
        if (!subscription) {
            return {
                subscription: null,
                isActive: false,
                daysRemaining: 0,
                planType: null
            };
        }

        const now = new Date();
        const isActive = subscription.currentPeriodEnd > now;
        const daysRemaining = isActive 
            ? Math.ceil((subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        return {
            subscription,
            isActive,
            daysRemaining,
            planType: subscription.planType
        };
    }
}