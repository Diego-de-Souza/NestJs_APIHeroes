import { Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IGamesRepository } from "../../ports/out/games.port";
import type { IUpdateGamePort } from "../../ports/in/games/update-game.port";

@Injectable()
export class UpdateGameUseCase implements IUpdateGamePort {
    private readonly logger = new Logger(UpdateGameUseCase.name);
    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository
    ) {}

    async execute(id: string, gameData: Record<string, unknown>): Promise<ApiResponseInterface<unknown>> {
        try{
            const gameExist = await this.gamesRepository.findGameById(id);
            
            if(!gameExist){
                return {
                    status: 404,
                    message: 'Jogo não encontrado.',
                };
            }

            const dataGame ={
                name: gameData.name,
                description: gameData.description,
                type: gameData.type,
                link: gameData.link
            }

            const game = await this.gamesRepository.updateGame(id, dataGame);

            return {
                status: 200,
                message: 'Jogo atualizado com sucesso.',
            };
        } catch (error: unknown) {
            const err = error as Error;
            this.logger.error('Erro ao atualizar jogo:', error);
            return {
                status: 500,
                message: 'Erro inesperado ao atualizar jogo.',
                error: (err?.message ?? String(error)),
            };
        }
    }
}