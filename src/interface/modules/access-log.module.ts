import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessLog } from '../../infrastructure/database/sequelize/models/access-log.model';
import { AccessLogService } from '../../application/services/access-log.service';
import { AccessLogRepository } from '../../infrastructure/repositories/access-log.repository';
import { AccessLogInterceptor } from '../../shared/interceptors/AccessLogInterceptor';
import { TrackHomeAccessUseCase } from '../../application/use-cases/access-log/track-home-access.use-case';

@Module({
    imports: [
        SequelizeModule.forFeature([AccessLog])
    ],
    providers: [
        AccessLogService,
        AccessLogRepository,
        AccessLogInterceptor,
        TrackHomeAccessUseCase
    ],
    exports: [
        AccessLogService,
        AccessLogInterceptor
    ]
})
export class AccessLogModule {}
