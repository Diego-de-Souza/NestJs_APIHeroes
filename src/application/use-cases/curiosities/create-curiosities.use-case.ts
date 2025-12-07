import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Curiosities } from "../../../infrastructure/database/sequelize/models/curiosities.model";
import { CuriosityRepository } from "../../../infrastructure/repositories/curiosities.repository";
import { CreateCuriositiesDto } from "../../../interface/dtos/curiosities/curiositiesCreate.dto";

@Injectable()
export class CreateCuriosityUseCase {

    constructor(
        private readonly curiositiesRepository: CuriosityRepository
    ){}
    
    async createCuriosity(curiosityDto: CreateCuriositiesDto): Promise<ApiResponseInterface<Curiosities>>{
        const curiosityExist = await this.curiositiesRepository.findCuriosityByName(curiosityDto.title);

        if(curiosityExist){
            return{
                status: HttpStatus.CONFLICT,
                message: "Está curiosidade já existe."
            }
        }

        await this.curiositiesRepository.createCuriositity(curiosityDto);

        return{
            status: HttpStatus.CREATED,
            message: "Curiosidade cadastrada com sucesso."
        }
    }
}