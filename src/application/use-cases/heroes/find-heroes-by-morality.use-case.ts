import { BadRequestException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByMoralityUseCase {
    private readonly logger = new Logger(FindHeroesByMoralityUseCase.name);

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
            this.logger.error('Erro ao buscar heróis por moralidade:', error);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro interno do servidor ao buscar heróis por moralidade.');
        }
    }
}

