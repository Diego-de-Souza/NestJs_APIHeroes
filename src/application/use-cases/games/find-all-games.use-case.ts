import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Games } from "../../../infrastructure/database/sequelize/models/games/games.model";
import type { IGamesRepository } from "../../ports/out/games.port";
import type { IFindAllGamesPort } from "../../ports/in/games/find-all-games.port";

@Injectable()
export class FindAllGamesUseCase implements IFindAllGamesPort {
    constructor(
        @Inject('IGamesRepository') private readonly gamesRepository: IGamesRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<Games>> {
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
