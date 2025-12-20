import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models} from '../../infrastructure/database/sequelize/models/index.model';
import { StudioModule } from '../../interface/modules/studio.module';
import { TeamModule } from '../../interface/modules/team.module';
import { DadosHeroisController } from '../../interface/controllers/dados-herois.controller';
import { DataHeroesService } from '../../application/services/data-heroes.service';
import { CreateHeroesUseCase } from '../../application/use-cases/heroes/create-heroes.use-case';
import { FindAllHeroesUseCase } from '../../application/use-cases/heroes/find-all-heroes.use-case';
import { FindHeroesByIdUseCase } from '../../application/use-cases/heroes/find-heroes-by-id.use-case';
import { UpdateHeroesUseCase } from '../../application/use-cases/heroes/update-heroes.use-case';
import { DeleteHeroesUseCase } from '../../application/use-cases/heroes/delete-heroes.use-case';
import { HeroesRepository } from '../../infrastructure/repositories/heroes.repository';
import { FindHeroesByStudioUseCase } from '../../application/use-cases/heroes/find-heroe-by-studio.use-case';
import { FindHeroesByTeamUseCase } from '../../application/use-cases/heroes/find-heroes-by-team.use-case';
import { FindHeroesByReleaseYearUseCase } from '../../application/use-cases/heroes/find-heroes-by-release-year.use-case';
import { FindHeroesByMoralityUseCase } from '../../application/use-cases/heroes/find-heroes-by-morality.use-case';
import { FindHeroesByGenreUseCase } from '../../application/use-cases/heroes/find-heroes-by-genre.use-case';
import { AuthModule } from './auth.module';
import { ImageService } from '../../application/services/image.service';
import { ConverterImageUseCase } from '../../application/use-cases/images/converter-image.use-case';

@Module({
  imports: [
    SequelizeModule.forFeature(models), 
    TeamModule, 
    StudioModule,
    AuthModule
  ],
  controllers: [DadosHeroisController],
  providers: [
    DataHeroesService,
    CreateHeroesUseCase, 
    FindAllHeroesUseCase, 
    FindHeroesByIdUseCase,
    UpdateHeroesUseCase,
    DeleteHeroesUseCase, 
    HeroesRepository, 
    FindHeroesByStudioUseCase,
    FindHeroesByTeamUseCase,
    FindHeroesByReleaseYearUseCase,
    FindHeroesByMoralityUseCase,
    FindHeroesByGenreUseCase,
    ImageService,
    ConverterImageUseCase
  ],
  exports: [DataHeroesService],
})
export class DadosHeroisModule {}
