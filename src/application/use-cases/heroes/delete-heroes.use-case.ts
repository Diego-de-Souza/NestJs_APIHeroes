import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { HeroesRepository } from "../../../infrastructure/repositories/heroes.repository";

@Injectable()
export class DeleteHeroesUseCase {
    
    constructor(
        private readonly heroesRepository: HeroesRepository
    ){}

    async DeleteHeroes(id: number): Promise<ApiResponseInterface<number>>{
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