import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { StudioController } from '../../interface/controllers/studio.controller';
import { StudioService } from '../../application/services/studio.service';
import { StudioRepository } from '../../infrastructure/repositories/studio.repository';
import { CreateStudioUseCase } from '../../application/use-cases/studio/create-studio.use-case';
import { FindAllStudioUseCase } from '../../application/use-cases/studio/find-all-studio.use-case';
import { DeleteStudioUseCase } from '../../application/use-cases/studio/delete-studio.use-case';
import { FindStudioByIdUseCase } from '../../application/use-cases/studio/find-studio-by-id.use-case';
import { UpdateStudioUseCase } from '../../application/use-cases/studio/update-studio.use-case';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule
  ],
  controllers: [StudioController],
  providers: [
    StudioService,
    CreateStudioUseCase,
    FindAllStudioUseCase,
    DeleteStudioUseCase,
    FindStudioByIdUseCase,
    UpdateStudioUseCase, 
    StudioRepository
  ],
  exports: [
    StudioService,
    StudioRepository
  ]
})
export class StudioModule {}
