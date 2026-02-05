import { BadRequestException, HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IFindHeroesByTeamPort } from "../../ports/in/heroes/find-heroes-by-team.port";

@Injectable()
export class FindHeroesByTeamUseCase implements IFindHeroesByTeamPort {
    private readonly logger = new Logger(FindHeroesByTeamUseCase.name);

    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository
    ) {}

    async execute(teamName: string): Promise<ApiResponseInterface<Heroes>> {
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