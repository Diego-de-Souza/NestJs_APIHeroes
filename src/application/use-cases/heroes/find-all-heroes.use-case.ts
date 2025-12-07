import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindAllHeroesUseCase {
    
    constructor(
        private readonly heroesRepository: HeroesRepository
    ){}

    async findAllHeroes(): Promise<ApiResponseInterface<Heroes>>{
        const heroes = await this.heroesRepository.findAllHeroes();

        if(!heroes){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não foram encontrados dados dos herois."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Herois encontrados com sucesso.",
            data: heroes
        }
    }
}