import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../../domain/interfaces/APIResponse.interface";
import { GamesRepository } from "../../../../infrastructure/repositories/games.repository";

@Injectable()
export class FindDataMemoryGameUseCase {
    
    constructor(
        private readonly gamesRepository: GamesRepository
    ){}

    async getDataMemoryGame(payload: any): Promise<ApiResponseInterface> {
        try{
            const _id_game = await this.gamesRepository.findGameByType(payload.type);

            if (!_id_game) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Jogo não encontrado.',
                };
            }

            const userProgress = await this.gamesRepository.findOneProcess(payload.userId, _id_game.id);

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

        }catch (error) {
            console.error('Erro ao buscar heróis por estúdio:', error);
                    
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro interno do servidor ao buscar heróis por estúdio.',
                error: error.message || error,
            };
        }
    }
}