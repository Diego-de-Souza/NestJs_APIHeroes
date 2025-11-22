import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models} from 'src/infrastructure/database/sequelize/models/index.model';
import { StudioModule } from 'src/interface/modules/studio.module';
import { TeamModule } from 'src/interface/modules/team.module';
import { DadosHeroisController } from 'src/interface/controllers/dados-herois.controller';
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
