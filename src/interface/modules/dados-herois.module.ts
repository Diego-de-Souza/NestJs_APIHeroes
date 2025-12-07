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
import { AuthModule } from './auth.module';

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
    FindHeroesByStudioUseCase
  ],
  exports: [DataHeroesService],
})
export class DadosHeroisModule {}
