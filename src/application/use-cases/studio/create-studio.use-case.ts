import { HttpStatus, Injectable, Inject } from "@nestjs/common";
import { ApiResponseInterface } from "../../../domain/interfaces/APIResponse.interface";
import { Studio } from "../../../infrastructure/database/sequelize/models/studio.model";
import type { IStudioRepository } from "../../ports/out/studio.port";
import { CreateStudioDto } from "../../../interface/dtos/studio/create-studio.dto";
import type { ICreateStudioPort } from "../../ports/in/studio/create-studio.port";

@Injectable()
export class CreateStudioUseCase implements ICreateStudioPort {
    constructor(
        @Inject('IStudioRepository') private readonly studioRepository: IStudioRepository
    ) {}

    async execute(studioDto: CreateStudioDto): Promise<ApiResponseInterface<Studio>> {
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
            dataUnit: studioCreated,
        };
    }
}