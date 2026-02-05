import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import type { IStudioRepository } from "../../ports/out/studio.port";
import { CreateStudioDto } from "../../../interface/dtos/studio/create-studio.dto";
import type { IUpdateStudioPort } from "../../ports/in/studio/update-studio.port";

@Injectable()
export class UpdateStudioUseCase implements IUpdateStudioPort {
    constructor(
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository
    ) {}

    async execute(id: string, studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>> {
        const studioExist = await this.studioRepository.findStudioById(id);

        if(!studioExist){
            return {
                status: HttpStatus.NOT_FOUND,
                message: "Não existe um registro de studio."
            }
        }
        
        await this.studioRepository.updateStudio(id, studioDto);

        return {
            status: HttpStatus.OK,
            message: "Studio atualizado com sucesso.",
        };
    }
}