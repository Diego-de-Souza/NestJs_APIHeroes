import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class FindHeroesByIdUseCase {

    constructor(
        private readonly heroesRepository: HeroesRepository
    ){}

    async findHeroesById(id: number): Promise<ApiResponseInterface<Heroes>>{
        const heroes = await this.heroesRepository.findHeroesById(id);

        if(!heroes){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Não foi encontrado nenhum herói."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Herói encontrado com sucesso.",
            dataUnit: heroes
        }
    }
}