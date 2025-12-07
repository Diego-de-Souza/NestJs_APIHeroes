import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from 'src/infrastructure/database/sequelize/models/index.model';
import { TeamController } from 'src/interface/controllers/team.controller';
import { TeamService } from 'src/application/services/team.service';
import { CreateTeamUseCase } from 'src/application/use-cases/team/create-team.use-case';
import { findTeamByIdUseCase } from 'src/application/use-cases/team/find-team-by-id.use-case';
import { FindAllTeamUseCase } from 'src/application/use-cases/team/find-all-team.use-case';
import { TeamRepository } from 'src/infrastructure/repositories/team.repository';
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
