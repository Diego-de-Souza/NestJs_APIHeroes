import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { FindDataMemoryGameUseCase } from "../../application/use-cases/games/memory-game/find-data-memory-game.use-case";
import { GetUserProgressUseCase } from "../use-cases/games/get-user-progress.use-case";
import { SaveUserGameProgressUseCase } from "../use-cases/games/save-user-game-progress.use-case";
import { FindAllGamesUseCase } from "../use-cases/games/find-all-games.use-case";
import { CreateGameUseCase } from "../use-cases/games/create-game.use-case";
import { UpdateGameUseCase } from "../use-cases/games/update-game.use-case";
import { DeleteGameUseCase } from "../use-cases/games/delete-game.use-case";

@Injectable()
export class GamesService {

    constructor(
        private readonly findDataMemoryGameUseCase: FindDataMemoryGameUseCase,
        private readonly getUserProgressUseCase: GetUserProgressUseCase,
        private readonly saveUserGameProgressUseCase: SaveUserGameProgressUseCase,
        private readonly findAllGamesUseCase: FindAllGamesUseCase,
        private readonly createGameUseCase: CreateGameUseCase,
        private readonly updateGameUseCase: UpdateGameUseCase,
        private readonly deleteGameUseCase: DeleteGameUseCase,
    ) {}
''
    async createGame(gameData: any): Promise<ApiResponseInterface>{
        return this.createGameUseCase.createGame(gameData);
    }

    async updateGame(id: number, gameData: any): Promise<ApiResponseInterface>{
        return this.updateGameUseCase.updateGame(id, gameData);
    }

    async deleteGame(id: number): Promise<ApiResponseInterface>{
        return this.deleteGameUseCase.deleteGame(id);
    }

    async getDataMemoryGame(payload: any): Promise<ApiResponseInterface>{
        return this.findDataMemoryGameUseCase.getDataMemoryGame(payload);
    }

    async getUserGameProgress(userId: number, gameId: number): Promise<ApiResponseInterface>{
        return this.getUserProgressUseCase.getUserGameProgress(userId, gameId);
    }

    async createUserGameProgress(data: {
      user_id: number;
      game_id: number;
      lvl_user: number;
      score: number;
      attempts: number;
      metadata: Record<string, any>;
    }): Promise<ApiResponseInterface>{
        return this.saveUserGameProgressUseCase.saveUserGameProgress(data);
    }

    async listGames(): Promise<ApiResponseInterface> {
        return this.findAllGamesUseCase.findAllGames();
    }
}