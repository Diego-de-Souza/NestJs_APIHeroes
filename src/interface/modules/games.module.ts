import { Get, Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { GamesController } from '../controllers/games.controller';
import { GamesService } from '../../application/services/games.service';
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

@Module({
  imports: [
    SequelizeModule.forFeature(models),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [GamesController],
  providers: [
    GamesService,
    FindDataMemoryGameUseCase,
    GamesRepository,
    ImageApiService,
    UnsplashProvider,
    PexelsProvider,
    PixabayProvider,
    GiphyProvider,
    GetUserProgressUseCase,
    SaveUserGameProgressUseCase,
    FindAllGamesUseCase,  
    CreateGameUseCase,
    UpdateGameUseCase,
    DeleteGameUseCase,
    ImageService,
    ConverterImageUseCase,
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