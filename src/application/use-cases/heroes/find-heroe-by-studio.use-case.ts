import { BadRequestException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByStudioUseCase {
    private readonly logger = new Logger(FindHeroesByStudioUseCase.name);

    constructor(private readonly heroesRepository: HeroesRepository) {}

    async findHeroesByStudio(studioId: number): Promise<ApiResponseInterface<Heroes>> {
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