import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import type { IHeroesRepository } from "../../ports/out/heroes.port";
import type { IDeleteHeroesPort } from "../../ports/in/heroes/delete-heroes.port";

@Injectable()
export class DeleteHeroesUseCase implements IDeleteHeroesPort {
    constructor(
        @Inject('IHeroesRepository') private readonly heroesRepository: IHeroesRepository
    ) {}

    async execute(id: string): Promise<ApiResponseInterface<number>> {
        const isDestroyHeroes = await this.heroesRepository.DeleteHeroes(id);

        if(isDestroyHeroes === 0){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Não foi possivel remover o heróis desejado."
            }
        }

        return{
            status: HttpStatus.OK,
            message: "Herói removido com sucesso."
        }
    }
}