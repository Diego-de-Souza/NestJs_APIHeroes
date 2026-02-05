import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { StudioController } from '../../interface/controllers/studio.controller';
import { StudioRepository } from '../../infrastructure/repositories/studio.repository';
import { CreateStudioUseCase } from '../../application/use-cases/studio/create-studio.use-case';
import { FindAllStudioUseCase } from '../../application/use-cases/studio/find-all-studio.use-case';
import { DeleteStudioUseCase } from '../../application/use-cases/studio/delete-studio.use-case';
import { FindStudioByIdUseCase } from '../../application/use-cases/studio/find-studio-by-id.use-case';
import { UpdateStudioUseCase } from '../../application/use-cases/studio/update-studio.use-case';
import { AuthModule } from './auth.module';

/**
 * Módulo Studio – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule,
  ],
  controllers: [StudioController],
  providers: [
    StudioRepository,
    CreateStudioUseCase,
    FindAllStudioUseCase,
    DeleteStudioUseCase,
    FindStudioByIdUseCase,
    UpdateStudioUseCase,
    { provide: 'ICreateStudioPort', useClass: CreateStudioUseCase },
    { provide: 'IFindAllStudioPort', useClass: FindAllStudioUseCase },
    { provide: 'IFindStudioByIdPort', useClass: FindStudioByIdUseCase },
    { provide: 'IDeleteStudioPort', useClass: DeleteStudioUseCase },
    { provide: 'IUpdateStudioPort', useClass: UpdateStudioUseCase },
    { provide: 'IStudioRepository', useClass: StudioRepository },
  ],
  exports: ['IStudioRepository', StudioRepository],
})
export class StudioModule {}
