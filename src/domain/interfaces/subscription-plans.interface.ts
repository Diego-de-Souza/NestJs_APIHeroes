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

