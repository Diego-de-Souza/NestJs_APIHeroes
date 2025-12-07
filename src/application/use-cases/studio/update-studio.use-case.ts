import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import { StudioRepository } from "../../../infrastructure/repositories/studio.repository";
import { CreateStudioDto } from "../../../interface/dtos/studio/create-studio.dto";

@Injectable()
export class UpdateStudioUseCase {
    
    constructor(
        private readonly studioRepository: StudioRepository
    ){}

    async updateStudio(id: number, studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>>{
        const studioExist = await this.studioRepository.findStudioById(id);

        if(studioExist){
            return {
                status: HttpStatus.CONFLICT,
                message: "Já existe um registro de studio."
            }
        }
        
        await this.studioRepository.updateStudio(id, studioDto);

        return {
            status: HttpStatus.OK,
            message: "Studio atualizado com sucesso."
        }
    }
}