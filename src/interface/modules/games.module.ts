import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { GamesController } from '../controllers/games.controller';
import { FindDataMemoryGameUseCase } from '../../application/use-cases/games/memory-game/find-data-memory-game.use-case';
import { GamesRepository } from '../../infrastructure/repositories/games.repository';
import { ImageApiService } from '../../application/services/image-api.service';
import { UnsplashProvider } from '../../infrastructure/providers/unsplash.provider';
import { PexelsProvider } from '../../infrastructure/providers/pexels.provider';
import { PixabayProvider } from '../../infrastructure/providers/pixabay.provider';
import { GiphyProvider } from '../../infrastructure/providers/giphy.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from '../../infrastructure/database/sequelize/models/index.model';
import { GetUserProgressUseCase } from '../../application/use-cases/games/get-user-progress.use-case';
import { SaveUserGameProgressUseCase } from '../../application/use-cases/games/save-user-game-progress.use-case';
import { FindAllGamesUseCase } from '../../application/use-cases/games/find-all-games.use-case';
import { CreateGameUseCase } from '../../application/use-cases/games/create-game.use-case';
import { UpdateGameUseCase } from '../../application/use-cases/games/update-game.use-case';
import { ConverterImageUseCase } from '../../application/use-cases/images/converter-image.use-case';
import { ImageService } from '../../application/services/image.service';
import { DeleteGameUseCase } from '../../application/use-cases/games/delete-game.use-case';

/**
 * Módulo Games – arquitetura Clean/Hexagonal.
 * Ports IN → UseCase; Port OUT → Repository.
 */
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [GamesController],
  providers: [
    GamesRepository,
    ImageApiService,
    ImageService,
    ConverterImageUseCase,
    UnsplashProvider,
    PexelsProvider,
    PixabayProvider,
    GiphyProvider,
    FindDataMemoryGameUseCase,
    GetUserProgressUseCase,
    SaveUserGameProgressUseCase,
    FindAllGamesUseCase,
    CreateGameUseCase,
    UpdateGameUseCase,
    DeleteGameUseCase,
    { provide: 'ICreateGamePort', useClass: CreateGameUseCase },
    { provide: 'IUpdateGamePort', useClass: UpdateGameUseCase },
    { provide: 'IDeleteGamePort', useClass: DeleteGameUseCase },
    { provide: 'IFindAllGamesPort', useClass: FindAllGamesUseCase },
    { provide: 'IFindDataMemoryGamePort', useClass: FindDataMemoryGameUseCase },
    { provide: 'IGetUserGameProgressPort', useClass: GetUserProgressUseCase },
    { provide: 'ISaveUserGameProgressPort', useClass: SaveUserGameProgressUseCase },
    { provide: 'IGamesRepository', useClass: GamesRepository },
    {
      provide: 'IMAGE_PROVIDERS',
      useFactory: (
        unsplash: UnsplashProvider,
        pexels: PexelsProvider,
        pixabay: PixabayProvider,
        giphy: GiphyProvider,
      ) => [unsplash, pexels, pixabay, giphy],
      inject: [UnsplashProvider, PexelsProvider, PixabayProvider, GiphyProvider],
    },
  ],
  exports: [ImageApiService],
})
export class GamesModule {}
