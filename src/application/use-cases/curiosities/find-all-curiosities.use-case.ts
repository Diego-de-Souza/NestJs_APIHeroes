import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Curiosities } from "../../../infrastructure/database/sequelize/models/curiosities.model";
import { CuriosityRepository } from "../../../infrastructure/repositories/curiosities.repository";

@Injectable()
export class FindAllCuriositiesUseCase {

    constructor(
        private readonly curiosityRepository: CuriosityRepository
    ){}

    async findAllCuriosities(): Promise<ApiResponseInterface<Curiosities>>{
        const curiosityAll = await this.curiosityRepository.findAllCuriosities();

        if(!curiosityAll){
            return{
                status: HttpStatus.NOT_FOUND,
                message: "Curiosidades não encontradas."
            }
        }

        return {
            status: HttpStatus.OK,
            message: "Curiosidade encontradas com sucesso.",
            data: curiosityAll
        }
    }
}