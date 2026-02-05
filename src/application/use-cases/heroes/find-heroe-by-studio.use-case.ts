import { BadRequestException, HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IFindHeroesByStudioPort } from "../../ports/in/heroes/find-heroes-by-studio.port";

@Injectable()
export class FindHeroesByStudioUseCase implements IFindHeroesByStudioPort {
    private readonly logger = new Logger(FindHeroesByStudioUseCase.name);

    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository
    ) {}

    async execute(studioId: string): Promise<ApiResponseInterface<Heroes>> {
        try{
            if (!studioId) {
                throw new BadRequestException('Studio ID is required');
            }

            const heroes = await this.heroesRepository.findAllByStudio(studioId);
            return {
                status: 200,
                message: 'Heróis encontrados com sucesso.',
                data: heroes || [],
            };
        } catch (error) {
            this.logger.error('Erro ao buscar heróis por estúdio:', error);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro interno do servidor ao buscar heróis por estúdio.');
        }
        
    }
}