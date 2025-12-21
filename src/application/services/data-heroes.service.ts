import { Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../domain/interfaces/APIResponse.interface";
import { CreateDadosHeroisDto } from "../../interface/dtos/dados-herois/create-dados-herois.dto";
import { CreateHeroesUseCase } from "../../application/use-cases/heroes/create-heroes.use-case";
import { Heroes } from "../../infrastructure/database/sequelize/models/heroes.model";
import { FindAllHeroesUseCase } from "../../application/use-cases/heroes/find-all-heroes.use-case";
import { FindHeroesByIdUseCase } from "../../application/use-cases/heroes/find-heroes-by-id.use-case";
import { UpdateHeroesUseCase } from "../../application/use-cases/heroes/update-heroes.use-case";
import { UpdateDadosHeroisDto } from "../../interface/dtos/dados-herois/update-dados-herois.dto";
import { DeleteHeroesUseCase } from "../../application/use-cases/heroes/delete-heroes.use-case";
import { FindHeroesByStudioUseCase } from "../../application/use-cases/heroes/find-heroe-by-studio.use-case";
import { FindHeroesByTeamUseCase } from "../use-cases/heroes/find-heroes-by-team.use-case";
import { FindHeroesByReleaseYearUseCase } from "../use-cases/heroes/find-heroes-by-release-year.use-case";
import { FindHeroesByMoralityUseCase } from "../use-cases/heroes/find-heroes-by-morality.use-case";
import { FindHeroesByGenreUseCase } from "../use-cases/heroes/find-heroes-by-genre.use-case";
import { HeroesData } from "src/domain/interfaces/card_heroes.interface";

@Injectable()
export class DataHeroesService {
    
    constructor(
        private readonly createHeroesUseCase: CreateHeroesUseCase,
        private readonly findAllHeroesUseCase: FindAllHeroesUseCase,
        private readonly findHeroesByIdUseCase: FindHeroesByIdUseCase,
        private readonly updateHeroesUseCase: UpdateHeroesUseCase,
        private readonly deleteHeroesUseCase: DeleteHeroesUseCase,
        private readonly findHeroesByStudioUseCase: FindHeroesByStudioUseCase,
        private readonly findHeroesByTeamUseCase: FindHeroesByTeamUseCase,
        private readonly findHeroesByReleaseYearUseCase: FindHeroesByReleaseYearUseCase,
        private readonly findHeroesByMoralityUseCase: FindHeroesByMoralityUseCase,
        private readonly findHeroesByGenreUseCase: FindHeroesByGenreUseCase
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>{
        return await this.createHeroesUseCase.create(heroesDto);
    }

    async findAllHeroes(): Promise<ApiResponseInterface<Heroes>>{
        return await this.findAllHeroesUseCase.findAllHeroes();
    }

    async findHeroesById(id: number): Promise<ApiResponseInterface<HeroesData>>{
        return await this.findHeroesByIdUseCase.findHeroesById(id);
    }

    async updateHeroes(id: number, heroesDto: UpdateDadosHeroisDto): Promise<ApiResponseInterface<any>>{
        return await this.updateHeroesUseCase.updateHeroes(id, heroesDto);
    }

    async DeleteHeroes(id: number): Promise<ApiResponseInterface<number>>{
        return await this.deleteHeroesUseCase.DeleteHeroes(id);
    }

    async findHeroesByStudio(studioId: number): Promise<ApiResponseInterface<Heroes>> {
        return await this.findHeroesByStudioUseCase.findHeroesByStudio(studioId);
    }

    async findHeroesByTeam(teamName: string): Promise<ApiResponseInterface<Heroes>> {
        return await this.findHeroesByTeamUseCase.findHeroesByTeam(teamName);
    }

    async findHeroesByReleaseYear(year: number): Promise<ApiResponseInterface<Heroes>> {
        return await this.findHeroesByReleaseYearUseCase.findHeroesByReleaseYear(year);
    }

    async findHeroesByMorality(morality: string): Promise<ApiResponseInterface<Heroes>> {
        return await this.findHeroesByMoralityUseCase.findHeroesByMorality(morality);
    }

    async findHeroesByGenre(genre: string): Promise<ApiResponseInterface<Heroes>> {
        return await this.findHeroesByGenreUseCase.findHeroesByGenre(genre);
    }
}