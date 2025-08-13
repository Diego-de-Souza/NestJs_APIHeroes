import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models} from '../../infrastructure/database/sequelize/models/index.model';
import { StudioModule } from './studio.module';
import { TeamModule } from './team.module';
import { DadosHeroisController } from '../controllers/dados-herois.controller';
import { DataHeroesService } from 'src/application/services/data-heroes.service';
import { CreateHeroesUseCase } from 'src/application/use-cases/heroes/create-heroes.use-case';
import { FindAllHeroesUseCase } from 'src/application/use-cases/heroes/find-all-heroes.use-case';
import { FindHeroesByIdUseCase } from 'src/application/use-cases/heroes/find-heroes-by-id.use-case';
import { UpdateHeroesUseCase } from 'src/application/use-cases/heroes/update-heroes.use-case';
import { DeleteHeroesUseCase } from 'src/application/use-cases/heroes/delete-heroes.use-case';
import { HeroesRepository } from 'src/infrastructure/repositories/heroes.repository';
import { FindHeroesByStudioUseCase } from 'src/application/use-cases/heroes/find-heroe-by-studio.use-case';

@Module({
  imports: [
    SequelizeModule.forFeature(models), 
    TeamModule, 
    StudioModule
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
    FindHeroesByStudioUseCase
  ],
  exports: [DataHeroesService],
})
export class DadosHeroisModule {}
