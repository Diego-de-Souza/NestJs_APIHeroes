import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PaymentRepository } from '../../infrastructure/repositories/payment.repository';

@Injectable()
export class PremiumGuard implements CanActivate {
    constructor(private readonly paymentRepository: PaymentRepository) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        // Assumindo que o user já foi injetado pelo AuthGuard
        const userId = request.user?.id;

        if (!userId) {
            throw new ForbiddenException('Usuário não autenticado');
        }

        // Verifica se tem subscription ativa
        const hasActiveSubscription = await this.paymentRepository.hasActiveSubscription(userId);

        if (!hasActiveSubscription) {
            throw new ForbiddenException({
                message: 'Acesso Premium Necessário',
                code: 'PREMIUM_REQUIRED',
                details: 'Este conteúdo é exclusivo para assinantes. Faça sua assinatura para continuar.'
            });
        }

        return true;
    }
}