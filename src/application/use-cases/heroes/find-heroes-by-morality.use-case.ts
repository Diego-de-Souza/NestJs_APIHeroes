import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByMoralityUseCase {
    constructor(private readonly heroesRepository: HeroesRepository) {}

    async findHeroesByMorality(morality: string): Promise<ApiResponseInterface<Heroes>> {
        try{
            if (!morality || morality.trim() === '') {
                throw new BadRequestException('Moralidade é obrigatória');
            }

            const heroes = await this.heroesRepository.findAllByMorality(morality);
            return {
                status: HttpStatus.OK,
                message: 'Heróis encontrados com sucesso.',
                data: heroes || [],
            };
        } catch (error) {
            console.error('Erro ao buscar heróis por moralidade:', error);
            
            return {
                status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Erro interno do servidor ao buscar heróis por moralidade.',
                error: error.message || error,
            };
        }
    }
}

