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

@Injectable()
export class DataHeroesService {
    
    constructor(
        private readonly createHeroesUseCase: CreateHeroesUseCase,
        private readonly findAllHeroesUseCase: FindAllHeroesUseCase,
        private readonly findHeroesByIdUseCase: FindHeroesByIdUseCase,
        private readonly updateHeroesUseCase: UpdateHeroesUseCase,
        private readonly deleteHeroesUseCase: DeleteHeroesUseCase,
        private readonly findHeroesByStudioUseCase: FindHeroesByStudioUseCase
    ){}

    async create(heroesDto: CreateDadosHeroisDto): Promise<ApiResponseInterface<Heroes>>{
        return await this.createHeroesUseCase.create(heroesDto);
    }

    async findAllHeroes(): Promise<ApiResponseInterface<Heroes>>{
        return await this.findAllHeroesUseCase.findAllHeroes();
    }

    async findHeroesById(id: number): Promise<ApiResponseInterface<Heroes>>{
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
}