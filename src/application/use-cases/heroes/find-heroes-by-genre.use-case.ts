import { BadRequestException, HttpStatus, Injectable, Logger, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IFindHeroesByGenrePort } from "../../ports/in/heroes/find-heroes-by-genre.port";

@Injectable()
export class FindHeroesByGenreUseCase implements IFindHeroesByGenrePort {
    private readonly logger = new Logger(FindHeroesByGenreUseCase.name);

    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository
    ) {}

    async execute(genre: string): Promise<ApiResponseInterface<Heroes>> {
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
            this.logger.error('Erro ao buscar heróis por gênero:', error);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro interno do servidor ao buscar heróis por gênero.');
        }
    }
}

