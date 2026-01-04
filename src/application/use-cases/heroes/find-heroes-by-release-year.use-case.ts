import { BadRequestException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByReleaseYearUseCase {
    private readonly logger = new Logger(FindHeroesByReleaseYearUseCase.name);

    constructor(private readonly heroesRepository: HeroesRepository) {}

    async findHeroesByReleaseYear(year: number): Promise<ApiResponseInterface<Heroes>> {
        try{
            if (!year || year < 1900 || year > 2100) {
                throw new BadRequestException('Ano de lançamento inválido');
            }

            const heroes = await this.heroesRepository.findAllByReleaseYear(year);
            return {
                status: HttpStatus.OK,
                message: 'Heróis encontrados com sucesso.',
                data: heroes || [],
            };
        } catch (error) {
            this.logger.error('Erro ao buscar heróis por ano de lançamento:', error);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro interno do servidor ao buscar heróis por ano de lançamento.');
        }
    }
}

