export enum PlanType {
    MENSAL = 'mensal',
    TRIMESTRAL = 'trimestral', 
    SEMESTRAL = 'semestral',
    ANUAL = 'anual'
}

export interface PlanConfig {
    id: PlanType;
    name: string;
    duration: number; // em dias
    stripePriceId?: string; // ID do preço no Stripe
    description: string;
}

export const SUBSCRIPTION_PLANS: Record<PlanType, PlanConfig> = {
    [PlanType.MENSAL]: {
        id: PlanType.MENSAL,
        name: 'Plano Mensal',
        duration: 30, // 1 mês = 30 dias
        description: 'Acesso premium por 1 mês',
        stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID
    },
    [PlanType.TRIMESTRAL]: {
        id: PlanType.TRIMESTRAL,
        name: 'Plano Trimestral',
        duration: 90, // 3 meses = 90 dias
        description: 'Acesso premium por 3 meses',
        stripePriceId: process.env.STRIPE_QUARTERLY_PRICE_ID
    },
    [PlanType.SEMESTRAL]: {
        id: PlanType.SEMESTRAL,
        name: 'Plano Semestral', 
        duration: 180, // 6 meses = 180 dias
        description: 'Acesso premium por 6 meses',
        stripePriceId: process.env.STRIPE_SEMIANNUAL_PRICE_ID
    },
    [PlanType.ANUAL]: {
        id: PlanType.ANUAL,
        name: 'Plano Anual',
        duration: 365, // 1 ano = 365 dias
        description: 'Acesso premium por 1 ano',
        stripePriceId: process.env.STRIPE_ANNUAL_PRICE_ID
    }
};

//  Helper para calcular data de expiração
export function calculateExpirationDate(planType: PlanType, startDate: Date = new Date()): Date {
    const plan = SUBSCRIPTION_PLANS[planType];
    const expirationDate = new Date(startDate);
    expirationDate.setDate(expirationDate.getDate() + plan.duration);
    return expirationDate;
}

//  Helper para validar se plano existe
export function isValidPlan(planType: string): planType is PlanType {
    return Object.values(PlanType).includes(planType as PlanType);
}