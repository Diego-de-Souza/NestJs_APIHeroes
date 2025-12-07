import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { TeamController } from '../../interface/controllers/team.controller';
import { TeamService } from '../../application/services/team.service';
import { CreateTeamUseCase } from '../../application/use-cases/team/create-team.use-case';
import { findTeamByIdUseCase } from '../../application/use-cases/team/find-team-by-id.use-case';
import { FindAllTeamUseCase } from '../../application/use-cases/team/find-all-team.use-case';
import { TeamRepository } from '../../infrastructure/repositories/team.repository';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule
  ],
    controllers: [TeamController],
    providers: [
      TeamService, 
      CreateTeamUseCase, 
      findTeamByIdUseCase, 
      FindAllTeamUseCase,
      TeamRepository
    ],
    exports: [
      TeamService,
      TeamRepository
    ]
})
export class TeamModule {}
