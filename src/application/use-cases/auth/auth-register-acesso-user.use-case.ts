import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';
import { AccessLogService } from '../../services/access-log.service';

@Injectable()
export class AuthRegisterAcessoUserUseCase {
    private readonly logger = new Logger(AuthRegisterAcessoUserUseCase.name);

    constructor(
        private readonly accessLogService: AccessLogService
    ) {}

    async execute(req: Request): Promise<ApiResponseInterface<{ registered: boolean; message: string }>> {
        try {
            const user = req['user']; // Usuário autenticado (se houver)
            const userId = user?.id || user?.sub || null;
            
            // Extrai IP de forma mais robusta (considera proxies e load balancers)
            const forwardedFor = req.headers['x-forwarded-for'];
            const ip = forwardedFor 
                ? (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0].trim())
                : req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
            
            const userAgent = req.headers['user-agent'];

            this.logger.debug(`Registrando acesso - UserId: ${userId || 'anonymous'}, IP: ${ip}`);

            return await this.accessLogService.trackHomeAccess(
                userId,
                ip as string,
                userAgent,
                '/home'
            );
        } catch (error) {
            this.logger.error('Erro ao registrar acesso do usuário:', error);
            throw error;
        }
    }
}
