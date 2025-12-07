import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { StudioController } from 'src/interface/controllers/studio.controller';
import { StudioService } from 'src/application/services/studio.service';
import { StudioRepository } from 'src/infrastructure/repositories/studio.repository';
import { CreateStudioUseCase } from 'src/application/use-cases/studio/create-studio.use-case';
import { FindAllStudioUseCase } from 'src/application/use-cases/studio/find-all-studio.use-case';
import { DeleteStudioUseCase } from 'src/application/use-cases/studio/delete-studio.use-case';
import { FindStudioByIdUseCase } from 'src/application/use-cases/studio/find-studio-by-id.use-case';
import { UpdateStudioUseCase } from 'src/application/use-cases/studio/update-studio.use-case';
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
