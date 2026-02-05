import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Heroes } from "../../../infrastructure/database/sequelize/models/heroes.model";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IFindAllHeroesPort } from "../../ports/in/heroes/find-all-heroes.port";

@Injectable()
export class FindAllHeroesUseCase implements IFindAllHeroesPort {
    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository
    ) {}

    async execute(): Promise<ApiResponseInterface<Heroes>> {
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