import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "src/domain/interfaces/APIResponse.interface";
import { Heroes } from "src/infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "src/infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByStudioUseCase {
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
            console.error('Erro ao buscar heróis por estúdio:', error);
            
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Erro interno do servidor ao buscar heróis por estúdio.',
                error: error.message || error,
            };
        }
        
    }
}