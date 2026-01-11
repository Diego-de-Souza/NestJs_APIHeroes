import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { AccessLogRepository } from '../../../infrastructure/repositories/access-log.repository';
import { AccessLogData } from '../../../domain/interfaces/access-log.interface';
import { ApiResponseInterface } from '../../../domain/interfaces/APIResponse.interface';

@Injectable()
export class TrackHomeAccessUseCase {
    private readonly logger = new Logger(TrackHomeAccessUseCase.name);
    private readonly MINUTES_THRESHOLD = 5; // 5 minutos para considerar duplicata

    constructor(
        private readonly accessLogRepository: AccessLogRepository
    ) {}

    async execute(
        userId: number | null,
        ip: string,
        userAgent: string | undefined,
        route: string = '/home'
    ): Promise<ApiResponseInterface<{ registered: boolean; message: string }>> {
        try {
            // Verifica se já existe acesso recente
            const hasRecent = await this.accessLogRepository.hasRecentAccess(
                userId,
                ip,
                'page_view',
                this.MINUTES_THRESHOLD
            );

            if (hasRecent) {
                this.logger.debug(`Acesso duplicado ignorado - UserId: ${userId || 'anonymous'}, IP: ${ip}`);
                return {
                    status: HttpStatus.OK,
                    message: 'Acesso já registrado recentemente',
                    data: [{
                        registered: false,
                        message: 'Acesso já foi registrado nos últimos minutos'
                    }]
                };
            }

            // Registra o acesso
            const accessData: AccessLogData = {
                route,
                method: 'GET',
                ip,
                userAgent,
                userId,
                timestamp: new Date(),
                actionType: 'page_view',
                statusCode: HttpStatus.OK
            };

            await this.accessLogRepository.create(accessData);

            this.logger.debug(`Acesso à home registrado - UserId: ${userId || 'anonymous'}, IP: ${ip}`);

            return {
                status: HttpStatus.OK,
                message: 'Acesso registrado com sucesso',
                data: [{
                    registered: true,
                    message: 'Acesso registrado'
                }]
            };
        } catch (error) {
            this.logger.error('Erro ao registrar acesso à home:', error);
            throw error;
        }
    }
}
