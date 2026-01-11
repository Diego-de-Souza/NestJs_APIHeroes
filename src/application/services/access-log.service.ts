import { Injectable, Logger } from '@nestjs/common';
import { AccessLogRepository } from '../../infrastructure/repositories/access-log.repository';
import { AccessLogData } from '../../domain/interfaces/access-log.interface';
import { TrackHomeAccessUseCase } from '../use-cases/access-log/track-home-access.use-case';
import { ApiResponseInterface } from '../../domain/interfaces/APIResponse.interface';

@Injectable()
export class AccessLogService {
    private readonly logger = new Logger(AccessLogService.name);

    constructor(
        private readonly accessLogRepository: AccessLogRepository,
        private readonly trackHomeAccessUseCase: TrackHomeAccessUseCase
    ) {}

    async logAccess(accessData: AccessLogData): Promise<void> {
        try {
            await this.accessLogRepository.create(accessData);
        } catch (error) {
            // Não queremos que erros de log quebrem a aplicação
            this.logger.error('Erro ao registrar acesso:', error);
        }
    }

    async getAccessStats(startDate?: Date, endDate?: Date): Promise<{
        totalAccesses: number;
        uniqueUsers: number;
        pageViews: number;
        logins: number;
    }> {
        return await this.accessLogRepository.getStats(startDate, endDate);
    }

    async trackHomeAccess(
        userId: number | null,
        ip: string,
        userAgent: string | undefined,
        route?: string
    ): Promise<ApiResponseInterface<{ registered: boolean; message: string }>> {
        return await this.trackHomeAccessUseCase.execute(userId, ip, userAgent, route);
    }
}
