import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import type { IGamesRepository } from "../../../ports/out/games.port";
import type { IFindDataMemoryGamePort } from "../../../ports/in/games/find-data-memory-game.port";

@Injectable()
export class FindDataMemoryGameUseCase implements IFindDataMemoryGamePort {
    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository
    ) {}

    async execute(payload: Record<string, unknown>): Promise<ApiResponseInterface<unknown>> {
        try{
            const type = payload.type as string;
            const _id_game = await this.gamesRepository.findGameByType(type);

            if (!_id_game) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Jogo não encontrado.',
                };
            }

            const userId = payload.userId as string;
            const userProgress = await this.gamesRepository.findOneProcess(userId, _id_game.id);

            if (!userProgress) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Progresso do usuário não encontrado.',
                };
            }



            return {
                status: HttpStatus.OK,
                message: 'Dados do jogo encontrados com sucesso.',
                data: [{game: true}]
            };

        } catch (error: unknown) {
            const err = error as Error;
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro interno ao buscar dados do jogo da memória.',
                error: (err?.message ?? String(error)),
            };
        }
    }
}