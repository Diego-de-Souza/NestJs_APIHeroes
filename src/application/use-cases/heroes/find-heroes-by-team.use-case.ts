import { BadRequestException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";


@Injectable()
export class FindHeroesByTeamUseCase {
    private readonly logger = new Logger(FindHeroesByTeamUseCase.name);

    constructor(private readonly heroesRepository: HeroesRepository) {}

    async findHeroesByTeam(teamName: string): Promise<ApiResponseInterface<Heroes>>{
        try{
            if (!teamName) {
                throw new BadRequestException('Name team is required');
            }

            const heroes = await this.heroesRepository.findAllByTeam(teamName);
            return {
                status: 200,
                message: 'Heróis encontrados com sucesso.',
                data: heroes || [],
            };
        } catch (error) {
            this.logger.error('Erro ao buscar heróis por Equipe:', error);
            
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro interno do servidor ao buscar heróis por Equipe.',
                error: error.message || error,
            };
        }
    }
}