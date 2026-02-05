export interface CreateSubscriptionData {
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Date;
    price: number;
    currency?: string;
    planType: string;
}

export interface UpdateSubscriptionData {
    status?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    canceledAt?: Date;
    price?: number;
    currency?: string;
    planType?: string;
}

export interface CreatePaymentData {
    userId: string;
    stripePaymentIntentId: string;
    stripeChargeId?: string;
    amount: number;
    currency?: string;
    status?: string;
    paymentMethod: string;
    failureReason?: string;
    metadata?: object;
    paidAt?: Date;
}

export interface UpdatePaymentData {
    stripeChargeId?: string;
    status?: string;
    paymentMethod?: string;
    failureReason?: string;
    metadata?: object;
    paidAt?: Date;
}

