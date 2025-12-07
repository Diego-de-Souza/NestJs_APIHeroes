import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import { StudioRepository } from "../../../infrastructure/repositories/studio.repository";
import { CreateStudioDto } from "../../../interface/dtos/studio/create-studio.dto";

@Injectable()
export class CreateStudioUseCase {
    
    constructor(
        private readonly studioRepository: StudioRepository
    ){}

    async createStudio(studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>>{
        const studioExists = await this.studioRepository.findStudioByName(studioDto.name);

        if(studioExists){
            return {
                status: HttpStatus.CONFLICT,
                message: 'Usuário já existe',
            };
        }

        const studioCreated = await this.studioRepository.create(studioDto);

        return {
            status: HttpStatus.CREATED,
            message: "Studio criado com sucesso.",
            dataUnit: studioCreated
        }
    }
}