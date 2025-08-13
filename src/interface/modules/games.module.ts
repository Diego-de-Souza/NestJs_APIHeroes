import { GamesController } from "../controllers/games.controller";
import { models } from "src/infrastructure/database/sequelize/models/index.model";
import { SequelizeModule } from "@nestjs/sequelize";
import {  Module } from "@nestjs/common";
import { GamesService } from "src/application/services/games.service";
import { FindDataMemoryGameUseCase } from "src/application/use-cases/games/memory-game/find-data-memory-game.use-case";
import { GamesRepository } from "src/infrastructure/repositories/games.repository";

@Module({
  imports: [SequelizeModule.forFeature(models) ],
  controllers: [GamesController],
  providers: [
    GamesService,
    FindDataMemoryGameUseCase,
    GamesRepository,
  ],
  exports: []
})
export class GamesModule {}