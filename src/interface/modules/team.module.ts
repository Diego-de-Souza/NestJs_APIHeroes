import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { TeamController } from '../../interface/controllers/team.controller';
import { TeamRepository } from '../../infrastructure/repositories/team.repository';
import { CreateTeamUseCase } from '../../application/use-cases/team/create-team.use-case';
import { findTeamByIdUseCase } from '../../application/use-cases/team/find-team-by-id.use-case';
import { FindAllTeamUseCase } from '../../application/use-cases/team/find-all-team.use-case';
import { AuthModule } from './auth.module';
import { UpdateTeamUseCase } from 'src/application/use-cases/team/update-team.use-case';

/**
 * Módulo Team – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    AuthModule,
  ],
  controllers: [TeamController],
  providers: [
    TeamRepository,
    CreateTeamUseCase,
    findTeamByIdUseCase,
    FindAllTeamUseCase,
    UpdateTeamUseCase,
    //in ports
    { provide: 'ICreateTeamPort', useClass: CreateTeamUseCase },
    { provide: 'IFindTeamByIdPort', useClass: findTeamByIdUseCase },
    { provide: 'IFindAllTeamPort', useClass: FindAllTeamUseCase },
    { provide: 'IUpdateTeamPort', useClass: UpdateTeamUseCase },
    //out ports
    { provide: 'ITeamRepository', useClass: TeamRepository },
  ],
  exports: ['ITeamRepository', TeamRepository],
})
export class TeamModule {}
