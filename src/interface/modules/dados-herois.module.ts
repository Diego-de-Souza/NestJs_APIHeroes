import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { StudioModule } from './studio.module';
import { TeamModule } from './team.module';
import { DadosHeroisController } from '../controllers/dados-herois.controller';
import { HeroesRepository } from '../../infrastructure/repositories/heroes.repository';
import { CreateHeroesUseCase } from '../../application/use-cases/heroes/create-heroes.use-case';
import { FindAllHeroesUseCase } from '../../application/use-cases/heroes/find-all-heroes.use-case';
import { FindHeroesByIdUseCase } from '../../application/use-cases/heroes/find-heroes-by-id.use-case';
import { UpdateHeroesUseCase } from '../../application/use-cases/heroes/update-heroes.use-case';
import { DeleteHeroesUseCase } from '../../application/use-cases/heroes/delete-heroes.use-case';
import { FindHeroesByStudioUseCase } from '../../application/use-cases/heroes/find-heroe-by-studio.use-case';
import { FindHeroesByTeamUseCase } from '../../application/use-cases/heroes/find-heroes-by-team.use-case';
import { FindHeroesByReleaseYearUseCase } from '../../application/use-cases/heroes/find-heroes-by-release-year.use-case';
import { FindHeroesByMoralityUseCase } from '../../application/use-cases/heroes/find-heroes-by-morality.use-case';
import { FindHeroesByGenreUseCase } from '../../application/use-cases/heroes/find-heroes-by-genre.use-case';
import { AuthModule } from './auth.module';
import { ImageService } from '../../application/services/image.service';
import { ConverterImageUseCase } from '../../application/use-cases/images/converter-image.use-case';

/**
 * Módulo DadosHerois (Heroes) – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 * Depende de StudioModule e TeamModule (IStudioRepository, ITeamRepository).
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    TeamModule,
    StudioModule,
    AuthModule,
  ],
  controllers: [DadosHeroisController],
  providers: [
    HeroesRepository,
    ImageService,
    ConverterImageUseCase,
    CreateHeroesUseCase,
    FindAllHeroesUseCase,
    FindHeroesByIdUseCase,
    UpdateHeroesUseCase,
    DeleteHeroesUseCase,
    FindHeroesByStudioUseCase,
    FindHeroesByTeamUseCase,
    FindHeroesByReleaseYearUseCase,
    FindHeroesByMoralityUseCase,
    FindHeroesByGenreUseCase,
    { provide: 'ICreateHeroesPort', useClass: CreateHeroesUseCase },
    { provide: 'IFindAllHeroesPort', useClass: FindAllHeroesUseCase },
    { provide: 'IFindHeroesByIdPort', useClass: FindHeroesByIdUseCase },
    { provide: 'IUpdateHeroesPort', useClass: UpdateHeroesUseCase },
    { provide: 'IDeleteHeroesPort', useClass: DeleteHeroesUseCase },
    { provide: 'IFindHeroesByStudioPort', useClass: FindHeroesByStudioUseCase },
    { provide: 'IFindHeroesByTeamPort', useClass: FindHeroesByTeamUseCase },
    { provide: 'IFindHeroesByReleaseYearPort', useClass: FindHeroesByReleaseYearUseCase },
    { provide: 'IFindHeroesByMoralityPort', useClass: FindHeroesByMoralityUseCase },
    { provide: 'IFindHeroesByGenrePort', useClass: FindHeroesByGenreUseCase },
    { provide: 'IHeroesRepository', useClass: HeroesRepository },
  ],
})
export class DadosHeroisModule {}
