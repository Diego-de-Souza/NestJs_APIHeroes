import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { FindDataMemoryGameUseCase } from "src/application/use-cases/games/memory-game/find-data-memory-game.use-case";
import { GetUserProgressUseCase } from "../use-cases/games/get-user-progress.use-case";
import { SaveUserGameProgressUseCase } from "../use-cases/games/save-user-game-progress.use-case";

@Injectable()
export class GamesService {

    constructor(
        private readonly findDataMemoryGameUseCase: FindDataMemoryGameUseCase,
        private readonly getUserProgressUseCase: GetUserProgressUseCase,
        private readonly saveUserGameProgressUseCase: SaveUserGameProgressUseCase,
    ) {}

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
      metadata: { theme: string };
    }): Promise<ApiResponseInterface>{
        return this.saveUserGameProgressUseCase.saveUserGameProgress(data);
    }
}