import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { PlanType } from '../../../domain/interfaces/subscription-plans.interface';

export class CreatePaymentIntentDto {
    @IsEnum(PlanType, { 
        message: 'Plano deve ser: mensal, trimestral, semestral ou anual' 
    })
    planType: PlanType;

    @IsNumber({}, { message: 'Valor deve ser um número' })
    @Min(0.01, { message: 'Valor deve ser maior que zero' })
    amount: number;

    @IsOptional()
    @IsString({ message: 'Moeda deve ser uma string' })
    currency?: string;
}

export class CreateSubscriptionDto {
    @IsString({ message: 'Price ID deve ser uma string' })
    priceId: string;

    @IsOptional()
    @IsString({ message: 'Customer ID deve ser uma string' })
    customerId?: string;
}