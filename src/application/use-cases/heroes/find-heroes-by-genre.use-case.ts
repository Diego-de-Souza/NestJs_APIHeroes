import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByGenreUseCase {
    constructor(private readonly heroesRepository: HeroesRepository) {}

    async findHeroesByGenre(genre: string): Promise<ApiResponseInterface<Heroes>> {
        try{
            if (!genre || genre.trim() === '') {
                throw new BadRequestException('Gênero é obrigatório');
            }

            const heroes = await this.heroesRepository.findAllByGenre(genre);
            return {
                status: HttpStatus.OK,
                message: 'Heróis encontrados com sucesso.',
                data: heroes || [],
            };
        } catch (error) {
            console.error('Erro ao buscar heróis por gênero:', error);
            
            return {
                status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Erro interno do servidor ao buscar heróis por gênero.',
                error: error.message || error,
            };
        }
    }
}

