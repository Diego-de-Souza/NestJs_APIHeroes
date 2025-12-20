import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByReleaseYearUseCase {
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
            console.error('Erro ao buscar heróis por ano de lançamento:', error);
            
            return {
                status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Erro interno do servidor ao buscar heróis por ano de lançamento.',
                error: error.message || error,
            };
        }
    }
}

