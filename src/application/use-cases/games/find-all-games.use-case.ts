import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Games } from "../../../infrastructure/database/sequelize/models/games/games.model";
import { GamesRepository } from "../../../infrastructure/repositories/games.repository";

@Injectable()
export class FindAllGamesUseCase {
    constructor(
        private readonly gamesRepository: GamesRepository
    ) {}

    async findAllGames(): Promise<ApiResponseInterface<Games>> {
        try {
            const games = await this.gamesRepository.findAllGames();

            if (!games || games.length === 0) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'Nenhum jogo encontrado no banco de dados',
                    data: []
                };
            }

            // Filtra games com type 'quiz' para não retornar ao front
            const filteredGames = games.filter(game => game.type !== 'quiz');

            return {
                status: HttpStatus.OK,
                message: 'Jogos encontrados com sucesso',
                data: filteredGames
            };
        } catch (error) {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro ao buscar jogos',
                error: error.message || error,
                data: []
            };
        }
    }
}
