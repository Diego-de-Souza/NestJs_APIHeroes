import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { FindDataMemoryGameUseCase } from "src/application/use-cases/games/memory-game/find-data-memory-game.use-case";

@Injectable()
export class GamesService {

    constructor(private readonly findDataMemoryGameUseCase: FindDataMemoryGameUseCase) {}

    async getDataMemoryGame(payload: any): Promise<ApiResponseInterface>{
        return this.findDataMemoryGameUseCase.getDataMemoryGame(payload);
    }
}